import { useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { useThemeStore } from '@/components/TopBar/useThemeStore'
import { formatDate } from '@/helpers/FormatDate'
import { COLORES_REPORTE } from '@/pages/ReporteMeta/helpers/coloresReporte'
import { useReporteAsistenciaStore } from '../hook/useReporteAsistenciaStore'
import {
  asistenciasDelDia,
  asistidosPorDia,
  detalleClientesAsistidos,
  type PuntoAsistidosDia,
} from '../helpers/resumenAsistencia'
import { ModalClientesReporte } from './ModalClientesReporte'

/** Más días que esto: el eje X muestra uno de cada tantos (el día exacto sale en el tooltip) */
const MAX_TICKS_X = 16

/**
 * Card con el gráfico de líneas de los clientes que asistieron cada día del rango. Un cliente cuenta una vez por día
 * aunque marque varias veces; los días futuros del rango quedan sin punto. Click en un día: sus clientes en un modal.
 */
export const GraficoAsistidosPorDia = () => {
  const { theme } = useThemeStore()
  const colores = COLORES_REPORTE[theme]
  const { asistencias, filtros, cargando } = useReporteAsistenciaStore()
  const serie = asistidosPorDia(asistencias, filtros.fecha_inicio, filtros.fecha_fin)
  /** yyyy-mm-dd del día abierto en el modal */
  const [fechaAbierta, setFechaAbierta] = useState<string | null>(null)
  const clientesFechaAbierta = fechaAbierta ? detalleClientesAsistidos(asistenciasDelDia(asistencias, fechaAbierta), 1) : []

  // El click toma el día más cercano (el mismo del tooltip), no hace falta atinarle al punto; los futuros no abren
  const abrirDia = (indice: number | string | null | undefined) => {
    const p = indice === undefined || indice === null ? undefined : serie[Number(indice)]
    if (p && p.clientes !== null) setFechaAbierta(p.fecha)
  }

  // El primer y el último día siempre se muestran
  const paso = Math.ceil(serie.length / MAX_TICKS_X)
  const ultimo = serie.length - 1
  const ticksX = serie.filter((_, i) => i === ultimo || (i % paso === 0 && ultimo - i >= paso)).map((p) => p.dia)
  const punto = { r: 4, fill: colores.ventas, stroke: colores.superficie, strokeWidth: 2 }

  return (
    <div className="card-mode-actual rounded p-3 h-100 position-relative">
      <LoadingOverlay texto="Cargando asistencias" show={cargando} interno />
      <h5 className="fw-bold mb-1">Clientes asistidos por día</h5>
      <div className="small opacity-75 mb-3">Click en un día para ver sus clientes</div>
      {!serie.length
        ? <div className="small opacity-75 py-5 text-center">Elige un rango de fechas válido.</div>
        : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={serie}
              margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
              onClick={(estado) => abrirDia(estado?.activeTooltipIndex)}
              style={{ cursor: 'pointer' }}
            >
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
                allowDecimals={false}
                tick={{ fill: colores.texto, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                content={({ active, payload }) => <TooltipAsistidos active={active} payload={payload} color={colores.ventas} />}
                cursor={{ stroke: colores.texto, strokeWidth: 1 }}
              />
              <Line
                dataKey="clientes"
                stroke={colores.ventas}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                dot={punto}
                activeDot={{ ...punto, r: 6 }}
                connectNulls={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      <ModalClientesReporte
        card={fechaAbierta ? 'dia' : null}
        onHide={() => setFechaAbierta(null)}
        dia={fechaAbierta ? { fecha: fechaAbierta, clientes: clientesFechaAbierta } : undefined}
      />
    </div>
  )
}

type TooltipAsistidosProps = {
  active?: boolean
  /** Entradas que entrega Recharts; cada una trae el punto completo en `payload` */
  payload?: ReadonlyArray<{ payload?: unknown }>
  color: string
}

/** Tooltip: fecha completa y clientes (el texto usa el color de texto; el color de la serie va en el punto) */
const TooltipAsistidos = ({ active, payload, color }: TooltipAsistidosProps) => {
  if (!active || !payload?.length) return null
  const punto = payload[0].payload as PuntoAsistidosDia
  if (punto.clientes === null) return null
  return (
    <div className="card-mode-actual rounded shadow-sm px-3 py-2" style={{ minWidth: 180 }}>
      <div className="fw-bold mb-1">{formatDate(punto.fecha, 'yyyy-mm-dd', 'DDDD dd [de] MMMM')}</div>
      <div className="d-flex align-items-center gap-2 small">
        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, display: 'inline-block' }} />
        <span className="opacity-75">Clientes</span>
        <span className="fw-semibold ms-auto">{punto.clientes}</span>
      </div>
    </div>
  )
}
