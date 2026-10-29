import { useEffect, useMemo, type ReactNode } from 'react'
import { Col, Row } from 'react-bootstrap'
import IconCR, { type IconName } from '@/components/Icons/IconCR'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import type { ClienteActivoProps } from '../hook/useClientesActivos'
import { getFormatMoney } from '@/helpers/getFormatMoney'
import { clientesPorTipo, montoClientes, porVencerEn } from '../helpers/resumenClientesActivos'

/** Días de la card "Por vencer" */
const DIAS_POR_VENCER = 7

type CardResumenProps = {
  icono: IconName
  titulo: string
  valor: string
  detalle: ReactNode
  cargando: boolean
}

/** Card de un dato del resumen: título, valor grande y detalle */
const CardResumen = ({ icono, titulo, valor, detalle, cargando }: CardResumenProps) => (
  <div className="card-mode-actual rounded p-3 h-100 position-relative">
    <LoadingOverlay texto="Cargando" show={cargando} interno />
    <div className="d-flex align-items-center gap-2 mb-2">
      <IconCR name={icono} size={16} />
      <span className="small fw-semibold opacity-75">{titulo}</span>
    </div>
    <div className="fs-4 fw-bold">{valor}</div>
    <div className="small opacity-75">{detalle}</div>
  </div>
)

type Header2AppProps = {
  clientes: ClienteActivoProps[]
  loading: boolean
  error: string
}

const clientesTexto = (cantidad: number) => `${cantidad} ${cantidad === 1 ? 'cliente' : 'clientes'}`

/**
 * Resumen de clientes activos: total, por vencer en 7 días, congelados / con regalo y una card por tipo de cliente.
 * Cada card: cantidad de clientes y, en el detalle, lo vendido en sus membresías (monto).
 */
export const Header2App = ({ clientes, loading, error }: Header2AppProps) => {
  const { cargar: cargarTiposCliente, data: tiposCliente } = useTerminologiaPersona('tipoClienteVenta')

  useEffect(() => {
    cargarTiposCliente()
  }, [cargarTiposCliente])

  const porVencer = useMemo(() => porVencerEn(clientes, DIAS_POR_VENCER), [clientes])
  const congelados = useMemo(() => clientes.filter((cliente) => cliente.es_congelado), [clientes])
  const conRegalo = useMemo(() => clientes.filter((cliente) => cliente.es_regalo), [clientes])
  const porTipo = useMemo(() => clientesPorTipo(tiposCliente, clientes), [tiposCliente, clientes])
  const valor = (cantidad: number) => (error ? '—' : String(cantidad))
  const sinDatos = 'No se pudieron cargar los clientes'
  const monto = (lista: ClienteActivoProps[]) => getFormatMoney(montoClientes(lista))

  return (
    <>
      <Row className="g-3 mb-3">
        <Col lg={4} md={6}>
          <CardResumen icono="users" titulo="Clientes activos" valor={valor(clientes.length)} cargando={loading}
            detalle={error ? sinDatos : `${monto(clientes)} en membresías · vencen después de hoy`} />
        </Col>
        <Col lg={4} md={6}>
          <CardResumen icono="calendar" titulo={`Por vencer en ${DIAS_POR_VENCER} días`} valor={valor(porVencer.length)} cargando={loading}
            detalle={error ? sinDatos : `${monto(porVencer)} en membresías · vencen en los próximos ${DIAS_POR_VENCER} días`} />
        </Col>
        <Col lg={4} md={6}>
          <CardResumen icono="check" titulo="Congelados / con regalo" valor={valor(congelados.length + conRegalo.length)} cargando={loading}
            detalle={error ? sinDatos : `${monto([...congelados, ...conRegalo])} en membresías · ${clientesTexto(congelados.length)} en congelamiento · ${clientesTexto(conRegalo.length)} con regalo`} />
        </Col>
      </Row>
      <Row className="g-3 mb-3">
        {porTipo.map((tipo) => (
          <Col key={tipo.id} lg md={6}>
            <CardResumen icono="users" titulo={tipo.nombre} valor={valor(tipo.cantidad)} cargando={loading}
              detalle={error ? sinDatos : `${getFormatMoney(tipo.monto)} en membresías · tipo de cliente de su venta`} />
          </Col>
        ))}
      </Row>
    </>
  )
}
