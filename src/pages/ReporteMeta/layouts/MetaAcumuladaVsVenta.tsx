import { useEffect, useMemo, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { useThemeStore } from '@/components/TopBar/useThemeStore'
import { formatDate } from '@/helpers/FormatDate'
import { getFormatMoney } from '@/helpers/getFormatMoney'
import { useReporteMetaStore } from '../hook/useReporteMetaStore'
import { armarSerieMetaVsVenta, type PuntoMetaVsVenta } from '../helpers/serieMetaVsVenta'
import type { VentaReporteProps } from '../store/reporteMetaSlice'
import { COLORES_REPORTE, type ColoresReporte } from '../helpers/coloresReporte'

type MetaAcumuladaVsVentaProps = {
  /** yyyy-MM-dd */
  fecha_inicio: string
  /** yyyy-MM-dd */
  fecha_fin: string
}

const NOMBRES = { meta: 'Meta acumulada', ventas: 'Venta real acumulada' } as const

/** Card "Meta acumulada vs venta real": llama a las ventas del periodo y las compara día a día con la meta */
export const MetaAcumuladaVsVenta = ({ fecha_inicio, fecha_fin }: MetaAcumuladaVsVentaProps) => {
  const { theme } = useThemeStore()
  const colores = COLORES_REPORTE[theme]
  const { montoMetaObjetivo, idAsesorSeleccionado, obtenerVentasRango, filtrarVentasPorAsesor } = useReporteMetaStore()
  const [ventas, setVentas] = useState<VentaReporteProps[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Cada vez que cambia el periodo se vuelven a pedir las ventas (se ignora la respuesta de un periodo anterior)
  useEffect(() => {
    let vigente = true
    const cargar = async () => {
      setLoading(true)
      setError('')
      try {
        const lista = await obtenerVentasRango(fecha_inicio, fecha_fin)
        if (vigente) setVentas(lista)
      } catch (e) {
        if (vigente) setError(String(e))
      } finally {
        if (vigente) setLoading(false)
      }
    }
    cargar()
    return () => { vigente = false }
  }, [fecha_inicio, fecha_fin])

  // Con un asesor elegido solo cuentan sus ventas (la meta ya viene filtrada en montoMetaObjetivo)
  const serie = useMemo(
    () => armarSerieMetaVsVenta(fecha_inicio, fecha_fin, montoMetaObjetivo, filtrarVentasPorAsesor(ventas)),
    [ventas, idAsesorSeleccionado, fecha_inicio, fecha_fin, montoMetaObjetivo]
  )

  // Eje Y: de la meta total hacia abajo en pasos de 25%
  const ticksY = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(montoMetaObjetivo * f * 100) / 100)
  // Eje X: todos los días si caben; en periodos largos, uno sí y uno no (el día exacto sale en el tooltip).
  // El primer y el último día siempre se muestran; se quita el penúltimo si quedaría pegado al último.
  const ultimo = serie.length - 1
  const ticksX = serie
    .filter((_, i) => serie.length <= 16 || i === ultimo || (i % 2 === 0 && i !== ultimo - 1))
    .map((punto) => punto.dia)
  const ultimoConVentas = serie.reduce((ultimo, punto, i) => (punto.ventas !== null ? i : ultimo), -1)

  type Posicion = { dx: number, dy: number, anchor: 'start' | 'end' }
  /** Etiqueta al final de cada línea (la leyenda + etiqueta evitan depender solo del color) */
  const etiquetaFinal = (indiceFinal: number, texto: string, { dx, dy, anchor }: Posicion) =>
    ({ x, y, index }: { x?: number | string, y?: number | string, index?: number }) =>
      index === indiceFinal
        ? <text x={Number(x) + dx} y={Number(y) + dy} textAnchor={anchor} fill={colores.texto} fontSize={11} fontWeight={600}>{texto}</text>
        : null
  // Las líneas suben hacia la derecha: si las ventas van sobre la meta, el hueco libre está arriba a la
  // izquierda del último punto; si van debajo, abajo a la derecha. Así "Ventas" no choca con la meta.
  const puntoFinalVentas = serie[ultimoConVentas]
  const ventasSobreMeta = !!puntoFinalVentas && (puntoFinalVentas.ventas ?? 0) >= puntoFinalVentas.meta
  const posicionVentas: Posicion = ventasSobreMeta ? { dx: -8, dy: -10, anchor: 'end' } : { dx: 8, dy: 16, anchor: 'start' }

  const puntos = (color: string) => ({ r: 4, fill: color, stroke: colores.superficie, strokeWidth: 2 })

  return (
    <div className="card-mode-actual rounded p-3 h-100 position-relative">
      <LoadingOverlay texto="Cargando ventas" show={loading} interno />
      <h5 className="fw-bold mb-3">Meta acumulada vs venta real</h5>

      {error && <div className="text-danger small">No se pudieron cargar las ventas: {error}</div>}
      {!error && montoMetaObjetivo <= 0 && (
        <div className="small opacity-75 py-5 text-center">La meta no tiene monto asignado para comparar.</div>
      )}
      {!error && montoMetaObjetivo > 0 && (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={serie} margin={{ top: 8, right: 64, bottom: 0, left: 8 }}>
            <CartesianGrid vertical={false} stroke={colores.grilla} strokeWidth={1} />
            <XAxis
              dataKey="dia"
              tick={{ fill: colores.texto, fontSize: 11 }}
              axisLine={{ stroke: colores.grilla }}
              tickLine={false}
              ticks={ticksX}
              interval={0}
            />
            <YAxis
              domain={[0, montoMetaObjetivo]}
              ticks={ticksY}
              tickFormatter={(valor: number) => getFormatMoney(valor, { is_version_cut: true })}
              tick={{ fill: colores.texto, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={86}
            />
            <Tooltip
              content={({ active, payload }) => <TooltipMetaVsVenta active={active} payload={payload} colores={colores} />}
              cursor={{ stroke: colores.texto, strokeWidth: 1 }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              height={28}
              iconType="circle"
              formatter={(valor: string) => <span style={{ color: colores.texto }}>{NOMBRES[valor as keyof typeof NOMBRES]}</span>}
            />
            <Line
              dataKey="meta"
              name="meta"
              stroke={colores.meta}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              dot={puntos(colores.meta)}
              activeDot={{ ...puntos(colores.meta), r: 6 }}
              label={etiquetaFinal(ultimo, 'Meta', { dx: 8, dy: 4, anchor: 'start' })}
              isAnimationActive={false}
            />
            <Line
              dataKey="ventas"
              name="ventas"
              stroke={colores.ventas}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              dot={puntos(colores.ventas)}
              activeDot={{ ...puntos(colores.ventas), r: 6 }}
              label={etiquetaFinal(ultimoConVentas, 'Ventas', posicionVentas)}
              connectNulls={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

type TooltipMetaVsVentaProps = {
  active?: boolean
  /** Entradas que entrega Recharts; cada una trae el punto completo en `payload` */
  payload?: ReadonlyArray<{ payload?: unknown }>
  colores: ColoresReporte
}

/** Tooltip: fecha completa y ambos acumulados (el texto usa el color de texto; el color de la serie va en el punto) */
const TooltipMetaVsVenta = ({ active, payload, colores }: TooltipMetaVsVentaProps) => {
  if (!active || !payload?.length) return null
  const punto = payload[0].payload as PuntoMetaVsVenta
  const filas = [
    { nombre: NOMBRES.meta, valor: punto.meta, color: colores.meta },
    ...(punto.ventas !== null ? [{ nombre: NOMBRES.ventas, valor: punto.ventas, color: colores.ventas }] : []),
  ]
  return (
    <div className="card-mode-actual rounded shadow-sm px-3 py-2" style={{ minWidth: 200 }}>
      <div className="fw-bold mb-1">{formatDate(punto.fecha, 'yyyy-mm-dd', 'd MMMM yyyy')}</div>
      {filas.map((fila) => (
        <div key={fila.nombre} className="d-flex align-items-center gap-2 small">
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: fila.color, display: 'inline-block' }} />
          <span className="opacity-75">{fila.nombre}</span>
          <span className="fw-semibold ms-auto">{getFormatMoney(fila.valor)}</span>
        </div>
      ))}
    </div>
  )
}
