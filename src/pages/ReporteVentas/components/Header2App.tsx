import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Col, Row } from 'react-bootstrap'
import IconCR, { type IconName } from '@/components/Icons/IconCR'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { getFormatMoney } from '@/helpers/getFormatMoney'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { useReporteVentasStore } from '../hook/useReporteVentasStore'
import { calcularResumenVentas } from '../helpers/resumenVentas'
import { resumirPorTipoCliente } from '../helpers/ventasPorTipoCliente'
import type { VentaReporteVentasProps } from '../store/reporteVentasSlice'
import { ModalDetalleVentas, type DetalleVentas } from './ModalDetalleVentas'

type CardResumenProps = {
  icono: IconName
  titulo: string
  cargando: boolean
  children: ReactNode
  /** Acción opcional a la derecha del título (ej. "Ver ventas") */
  accion?: ReactNode
}

/** Card de un dato del resumen, con loading interno */
const CardResumen = ({ icono, titulo, cargando, children, accion }: CardResumenProps) => (
  <div className="card-mode-actual rounded p-3 h-100 position-relative">
    <LoadingOverlay texto="Cargando" show={cargando} interno />
    <div className="d-flex align-items-center gap-2 mb-2">
      <IconCR name={icono} size={16} />
      <span className="small fw-semibold opacity-75">{titulo}</span>
      {accion && <span className="ms-auto">{accion}</span>}
    </div>
    {children}
  </div>
)

/** Segundo header del reporte de ventas: resumen de las ventas del rango con los filtros del header */
export const Header2App = () => {
  const { fecha_inicio, fecha_fin, rangoValido, idAsesorSeleccionado, idOrigenSeleccionado, filtroMembresia, porFechaPago, textos, obtenerVentasRango, filtrarVentas } = useReporteVentasStore()
  const [detalle, setDetalle] = useState<DetalleVentas | null>(null)
  const [ventas, setVentas] = useState<VentaReporteVentasProps[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { cargar: cargarTiposCliente, data: tiposCliente } = useTerminologiaPersona('tipoClienteVenta')

  useEffect(() => {
    cargarTiposCliente()
  }, [cargarTiposCliente])

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
  }, [fecha_inicio, fecha_fin, porFechaPago])

  // Los filtros de asesor, programa y origen se aplican sobre las ventas ya cargadas
  const resumen = useMemo(
    () => calcularResumenVentas(filtrarVentas(ventas), filtroMembresia),
    [ventas, idAsesorSeleccionado, filtroMembresia, idOrigenSeleccionado]
  )

  // Nuevos, renovaciones y reinscripciones: monto y cantidad de ventas (con los mismos filtros del header)
  const porTipoCliente = useMemo(
    () => resumirPorTipoCliente(tiposCliente, filtrarVentas(ventas), filtroMembresia),
    [tiposCliente, ventas, idAsesorSeleccionado, filtroMembresia, idOrigenSeleccionado]
  )

  if (!rangoValido) return null

  const valor = (texto: string) => <div className="fs-4 fw-bold">{error ? '—' : texto}</div>
  const textoDetalle = (texto: string) => <div className="small opacity-75">{error ? textos.errorCarga : texto}</div>
  // Lo mismo que suma "Total vendido/ingresado" (con todos los filtros del header)
  const abrirDetalle = () => setDetalle({ titulo: `${textos.tituloModal} del rango`, filas: filtrarVentas(ventas), filtro: filtroMembresia })

  return (
    <>
    <Row className="g-3 mb-3">
      <Col lg={3} md={6}>
        <CardResumen
          icono="sales"
          titulo={textos.total}
          cargando={loading}
          accion={!error && !loading && (
            <button type="button" className="btn btn-link btn-sm p-0" onClick={abrirDetalle}>{textos.verDetalle}</button>
          )}
        >
          {valor(getFormatMoney(resumen.totalVendido))}
          {textoDetalle(textos.detalleTotal)}
        </CardResumen>
      </Col>
      <Col lg={3} md={6}>
        <CardResumen icono="users" titulo="Número de clientes" cargando={loading}>
          {valor(String(resumen.numeroClientes))}
          {textoDetalle(textos.detalleClientes)}
        </CardResumen>
      </Col>
      <Col lg={3} md={6}>
        {/* No pagado es el dato principal (grande); pagado va debajo, más pequeño */}
        <CardResumen icono="reporte" titulo="No pagado" cargando={loading}>
          {valor(getFormatMoney(resumen.montoNoPagado))}
          <div className="small opacity-75">
            {error ? textos.errorCarga : <>Pagado: <span className="fw-semibold">{getFormatMoney(resumen.montoPagado)}</span></>}
          </div>
        </CardResumen>
      </Col>
      <Col lg={3} md={6}>
        <CardResumen icono="user" titulo="Clientes con deudas" cargando={loading}>
          {valor(String(resumen.clientesConDeuda))}
          {textoDetalle(`De ${resumen.numeroClientes} ${resumen.numeroClientes === 1 ? 'cliente' : 'clientes'}`)}
        </CardResumen>
      </Col>
    </Row>
    <Row className="g-3 mb-3">
      {porTipoCliente.map((tipo) => (
        <Col key={tipo.id_tipo_cli} lg={4} md={6}>
          <CardResumen icono="users" titulo={tipo.label} cargando={loading}>
            {valor(getFormatMoney(tipo.montoTotal))}
            {textoDetalle(textos.cantidad(tipo.cantidad))}
          </CardResumen>
        </Col>
      ))}
    </Row>
    {detalle && (
      <ModalDetalleVentas detalle={detalle} onHide={() => setDetalle(null)} porFechaPago={porFechaPago} fecha_inicio={fecha_inicio} fecha_fin={fecha_fin} />
    )}
    </>
  )
}
