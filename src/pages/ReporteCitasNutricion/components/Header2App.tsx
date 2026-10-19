import { useMemo, type ReactNode } from 'react'
import { Col, Row } from 'react-bootstrap'
import IconCR, { type IconName } from '@/components/Icons/IconCR'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { formatDate } from '@/helpers/FormatDate'
import { useReporteCitasStore } from '../hook/useReporteCitasStore'
import { useCitasRango } from '../hook/useCitasRango'
import { calcularResumenCitas, contarPorEstado, estadosReportados } from '../helpers/resumenCitas'
import { ID_TODOS } from '../store/reporteCitasSlice'

type CardResumenProps = {
  icono: IconName
  titulo: ReactNode
  cargando: boolean
  children: ReactNode
  /** Color de fondo de la card (con texto blanco); sin él usa el fondo del tema */
  color?: string
}

/** Card de un dato del resumen, con loading interno */
const CardResumen = ({ icono, titulo, cargando, children, color }: CardResumenProps) => (
  <div
    className={`${color ? 'text-white' : 'card-mode-actual'} rounded p-3 h-100 position-relative`}
    style={color ? { backgroundColor: color } : undefined}
  >
    <LoadingOverlay texto="Cargando" show={cargando} interno />
    <div className="d-flex align-items-center gap-2 mb-2">
      <IconCR name={icono} size={16} />
      <span className="small fw-semibold opacity-75 fs-4">{titulo}</span>
    </div>
    {children}
  </div>
)

/**
 * Segundo header del reporte de citas: total, % de asistencia, mejor día y una card por estado.
 * El total usa todos los filtros; la asistencia, el mejor día y las cards por estado ignoran el filtro de estado
 * (comparan los estados entre sí) y la card del estado elegido se resalta.
 */
export const Header2App = () => {
  const { fecha_inicio, fecha_fin, rangoValido, estados, idEstadoSeleccionado, filtrarCitas } = useReporteCitasStore()
  const { citas, loading, error } = useCitasRango(fecha_inicio, fecha_fin, rangoValido)

  const total = useMemo(() => filtrarCitas(citas).length, [citas, filtrarCitas])
  const { resumen, porEstado } = useMemo(() => {
    const delNutricionista = filtrarCitas(citas, { ignorarEstado: true })
    return {
      resumen: calcularResumenCitas(delNutricionista, estados),
      porEstado: contarPorEstado(delNutricionista, estadosReportados(estados, delNutricionista)),
    }
  }, [citas, estados, filtrarCitas])

  if (!rangoValido) return null

  const valor = (texto: string) => <div className="fs-4 fw-bold">{error ? '—' : texto}</div>
  const detalle = (texto: string) => <div className="small opacity-75">{error ? 'No se pudieron cargar las citas' : texto}</div>

  return (
    <>
    <Row className="g-3 mb-3">
      <Col lg={4} md={6}>
        <CardResumen icono="calendar" titulo="Total de citas" cargando={loading}>
          {valor(String(total))}
          {detalle('Citas agendadas en el rango')}
        </CardResumen>
      </Col>
      <Col lg={4} md={6}>
        <CardResumen icono="check" titulo="% de asistencia" cargando={loading}>
          {valor(resumen.asistencia === null ? '—' : `${resumen.asistencia}%`)}
          {detalle(resumen.asistencia === null
            ? 'Aún no hay citas atendidas ni inasistencias'
            : `${resumen.atendidas} atendidas de ${resumen.atendidas + resumen.noAsistio} (atendidas + no asistió)`)}
        </CardResumen>
      </Col>
      <Col lg={4} md={12}>
        <CardResumen icono="estrella" titulo="Mejor día" cargando={loading}>
          {valor(resumen.mejorDia ? formatDate(resumen.mejorDia.fecha, 'yyyy-mm-dd', 'd MMMM yyyy') : '—')}
          {detalle(resumen.mejorDia
            ? `${resumen.mejorDia.atendidas} ${resumen.mejorDia.atendidas === 1 ? 'atendida' : 'atendidas'} de ${resumen.mejorDia.citas} ${resumen.mejorDia.citas === 1 ? 'cita' : 'citas'}`
            : 'Ningún día con citas atendidas')}
        </CardResumen>
      </Col>
    </Row>
    <Row className="g-3 mb-3">
      {porEstado.map((estado) => (
        <Col key={estado.value} lg md={6}>
          <div className={`h-100 ${idEstadoSeleccionado !== ID_TODOS && estado.value !== idEstadoSeleccionado ? 'opacity-50' : ''}`}>
            <CardResumen icono="users" color={estado.color} titulo={estado.label} cargando={loading}>
              {valor(String(estado.cantidad))}
              {detalle(`${estado.participacion}% de las citas`)}
            </CardResumen>
          </div>
        </Col>
      ))}
    </Row>
    </>
  )
}
