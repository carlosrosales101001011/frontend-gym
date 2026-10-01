import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Col, Row } from 'react-bootstrap'
import IconCR, { type IconName } from '@/components/Icons/IconCR'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { getFormatMoney } from '@/helpers/getFormatMoney'
import { useReporteVentasStore } from '../hook/useReporteVentasStore'
import { calcularResumenVentas } from '../helpers/resumenVentas'
import type { VentaReporteVentasProps } from '../store/reporteVentasSlice'

type CardResumenProps = {
  icono: IconName
  titulo: string
  cargando: boolean
  children: ReactNode
}

/** Card de un dato del resumen, con loading interno */
const CardResumen = ({ icono, titulo, cargando, children }: CardResumenProps) => (
  <div className="card-mode-actual rounded p-3 h-100 position-relative">
    <LoadingOverlay texto="Cargando" show={cargando} interno />
    <div className="d-flex align-items-center gap-2 mb-2">
      <IconCR name={icono} size={16} />
      <span className="small fw-semibold opacity-75">{titulo}</span>
    </div>
    {children}
  </div>
)

/** Segundo header del reporte de ventas: resumen de las ventas del rango con los filtros del header */
export const Header2App = () => {
  const { fecha_inicio, fecha_fin, rangoValido, idAsesorSeleccionado, idSucursalSeleccionada, idOrigenSeleccionado, filtroMembresia, obtenerVentasRango, filtrarVentas } = useReporteVentasStore()
  const [ventas, setVentas] = useState<VentaReporteVentasProps[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Ventas del rango (se ignora la respuesta de un rango anterior)
  useEffect(() => {
    if (!rangoValido) return
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

  // Los filtros de asesor, sucursal, programa y origen se aplican sobre las ventas ya cargadas
  const resumen = useMemo(
    () => calcularResumenVentas(filtrarVentas(ventas), filtroMembresia),
    [ventas, idAsesorSeleccionado, idSucursalSeleccionada, filtroMembresia, idOrigenSeleccionado]
  )

  if (!rangoValido) return null

  const valor = (texto: string) => <div className="fs-4 fw-bold">{error ? '—' : texto}</div>
  const detalle = (texto: string) => <div className="small opacity-75">{error ? 'No se pudieron cargar las ventas' : texto}</div>

  return (
    <Row className="g-3 mb-3">
      <Col lg={3} md={6}>
        <CardResumen icono="sales" titulo="Total vendido" cargando={loading}>
          {valor(getFormatMoney(resumen.totalVendido))}
          {detalle('Membresías vendidas en el rango')}
        </CardResumen>
      </Col>
      <Col lg={3} md={6}>
        <CardResumen icono="users" titulo="Número de clientes" cargando={loading}>
          {valor(String(resumen.numeroClientes))}
          {detalle('Clientes con ventas en el rango')}
        </CardResumen>
      </Col>
      <Col lg={3} md={6}>
        {/* No pagado es el dato principal (grande); pagado va debajo, más pequeño */}
        <CardResumen icono="reporte" titulo="No pagado" cargando={loading}>
          {valor(getFormatMoney(resumen.montoNoPagado))}
          <div className="small opacity-75">
            {error ? 'No se pudieron cargar las ventas' : <>Pagado: <span className="fw-semibold">{getFormatMoney(resumen.montoPagado)}</span></>}
          </div>
        </CardResumen>
      </Col>
      <Col lg={3} md={6}>
        <CardResumen icono="user" titulo="Clientes con deudas" cargando={loading}>
          {valor(String(resumen.clientesConDeuda))}
          {detalle(`De ${resumen.numeroClientes} ${resumen.numeroClientes === 1 ? 'cliente' : 'clientes'}`)}
        </CardResumen>
      </Col>
    </Row>
  )
}
