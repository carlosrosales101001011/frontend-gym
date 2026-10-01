import { useEffect, useMemo, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { useThemeStore } from '@/components/TopBar/useThemeStore'
import { getFormatMoney } from '@/helpers/getFormatMoney'
import { useReporteMetaStore } from '../hook/useReporteMetaStore'
import { calcularRitmoEquipo } from '../helpers/ritmoEquipo'
import { COLORES_REPORTE } from '../helpers/coloresReporte'
import type { VentaReporteProps } from '../store/reporteMetaSlice'

type RitmoEquipoProps = {
  /** yyyy-MM-dd */
  fecha_inicio: string
  /** yyyy-MM-dd */
  fecha_fin: string
}

/** Dato destacado debajo de la dona */
const Indicador = ({ titulo, valor }: { titulo: string, valor: string }) => (
  <div className="border rounded p-2 text-center h-100">
    <div className="fs-4 fw-bold">{valor}</div>
    <div className="small opacity-75">{titulo}</div>
  </div>
)

/**
 * Card "Ritmo del equipo" ("Ritmo de [asesor]" si se eligió uno): dona con la venta acumulada (azul) sobre la meta total del periodo (plomo),
 * el % de alcance al centro y, debajo, lo que falta (en curso) o cómo fue cada día (periodo terminado).
 */
export const RitmoEquipo = ({ fecha_inicio, fecha_fin }: RitmoEquipoProps) => {
  const { theme } = useThemeStore()
  const colores = COLORES_REPORTE[theme]
  const { montoMetaObjetivo, idAsesorSeleccionado, asesorSeleccionado, obtenerVentasRango, filtrarVentasPorAsesor } = useReporteMetaStore()
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

  // Con un asesor elegido: su meta y sus ventas
  const ritmo = useMemo(
    () => calcularRitmoEquipo(fecha_inicio, fecha_fin, montoMetaObjetivo, filtrarVentasPorAsesor(ventas)),
    [ventas, idAsesorSeleccionado, fecha_inicio, fecha_fin, montoMetaObjetivo]
  )

  // Anillo: lo vendido (hasta la meta) + lo que falta; si ya se pasó la meta, el anillo queda completo en azul
  const segmentos = [
    { nombre: 'Venta acumulada', valor: Math.min(ritmo.ventaAcumulada, montoMetaObjetivo), color: colores.ventas },
    { nombre: 'Falta para la meta', valor: Math.max(montoMetaObjetivo - ritmo.ventaAcumulada, 0), color: colores.pendiente },
  ]
  const porcentajeTexto = `${Math.round(ritmo.porcentaje * 10) / 10}%`

  return (
    <div className="card-mode-actual rounded p-3 h-100 position-relative">
      <LoadingOverlay texto="Cargando ventas" show={loading} interno />
      <h5 className="fw-bold mb-3">{asesorSeleccionado ? `Ritmo de ${asesorSeleccionado.label_empl}` : 'Ritmo del equipo'}</h5>

      {error && <div className="text-danger small">No se pudieron cargar las ventas: {error}</div>}
      {!error && montoMetaObjetivo <= 0 && (
        <div className="small opacity-75 py-5 text-center">La meta no tiene monto asignado para comparar.</div>
      )}
      {!error && montoMetaObjetivo > 0 && (
        <>
          <div className="position-relative" style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segmentos}
                  dataKey="valor"
                  nameKey="nombre"
                  innerRadius={70}
                  outerRadius={95}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {segmentos.map((segmento) => <Cell key={segmento.nombre} fill={segmento.color} />)}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => active && payload?.length ? (
                    <div className="card-mode-actual rounded shadow-sm px-3 py-2 small">
                      <span className="opacity-75">{String(payload[0].name)}: </span>
                      <span className="fw-semibold">{getFormatMoney(Number(payload[0].value) || 0)}</span>
                    </div>
                  ) : null}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* % de alcance al centro de la dona */}
            <div className="position-absolute top-50 start-50 translate-middle text-center" style={{ pointerEvents: 'none' }}>
              <div className="fw-bold" style={{ fontSize: 28, lineHeight: 1.1 }}>{porcentajeTexto}</div>
              <div className="small opacity-75">de la meta</div>
            </div>
          </div>

          {/* Leyenda con montos: el color va en el punto, el texto en color de texto */}
          <div className="d-flex flex-wrap justify-content-center gap-3 small mb-3">
            <span className="d-inline-flex align-items-center gap-1">
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: colores.ventas, display: 'inline-block' }} />
              <span className="opacity-75">Venta acumulada:</span>
              <span className="fw-semibold">{getFormatMoney(ritmo.ventaAcumulada)}</span>
            </span>
            <span className="d-inline-flex align-items-center gap-1">
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: colores.pendiente, display: 'inline-block' }} />
              <span className="opacity-75">Meta del periodo:</span>
              <span className="fw-semibold">{getFormatMoney(montoMetaObjetivo)}</span>
            </span>
          </div>

          <Row className="g-2">
            {ritmo.periodoTerminado ? (
              <>
                <Col xs={6}><Indicador titulo="Días que alcanzaron la meta del día" valor={String(ritmo.diasLogrados)} /></Col>
                <Col xs={6}><Indicador titulo="Días que no la alcanzaron" valor={String(ritmo.diasNoLogrados)} /></Col>
              </>
            ) : (
              <>
                <Col xs={6}><Indicador titulo="Días que faltan (contando hoy)" valor={String(ritmo.diasRestantes)} /></Col>
                <Col xs={6}>
                  <Indicador
                    titulo={ritmo.porDia > 0 ? 'Por día para alcanzar la meta' : 'Meta alcanzada'}
                    valor={getFormatMoney(ritmo.porDia)}
                  />
                </Col>
              </>
            )}
          </Row>
        </>
      )}
    </div>
  )
}
