import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Col, Row } from 'react-bootstrap'
import IconCR, { type IconName } from '@/components/Icons/IconCR'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { formatDate } from '@/helpers/FormatDate'
import { getFormatMoney } from '@/helpers/getFormatMoney'
import { useReporteMetaStore } from '../hook/useReporteMetaStore'
import { calcularResumenMeta } from '../helpers/resumenMeta'
import type { VentaReporteProps } from '../store/reporteMetaSlice'

type CardResumenProps = {
  icono: IconName
  titulo: string
  valor: string
  detalle: ReactNode
  /** Muestra el loading dentro de la card (las que dependen de las ventas) */
  cargando?: boolean
}

/** Card de un dato del resumen: título, valor grande y detalle */
const CardResumen = ({ icono, titulo, valor, detalle, cargando = false }: CardResumenProps) => (
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

/** Segundo header del reporte: 4 cards con el resumen de la meta elegida (y del asesor, si se eligió uno) */
export const Header2App = () => {
  const { metaSeleccionada, montoMetaObjetivo, idAsesorSeleccionado, obtenerVentasRango, filtrarVentasPorAsesor } = useReporteMetaStore()
  const [ventas, setVentas] = useState<VentaReporteProps[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fecha_inicio = metaSeleccionada?.fecha_inicio ?? ''
  const fecha_fin = metaSeleccionada?.fecha_fin ?? ''

  // Ventas del periodo de la meta (se ignora la respuesta de un periodo anterior)
  useEffect(() => {
    if (!fecha_inicio || !fecha_fin) return
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

  const resumen = useMemo(
    () => fecha_inicio && fecha_fin
      ? calcularResumenMeta(fecha_inicio, fecha_fin, montoMetaObjetivo, filtrarVentasPorAsesor(ventas))
      : null,
    [ventas, idAsesorSeleccionado, fecha_inicio, fecha_fin, montoMetaObjetivo]
  )

  if (!resumen) return null

  return (
    <Row className="g-3 mb-3">
      <Col lg={3} md={6}>
        <CardResumen
          icono="reporte"
          titulo="Meta acumulada total"
          valor={getFormatMoney(resumen.metaTotal)}
          detalle="Meta completa del periodo"
        />
      </Col>
      <Col lg={3} md={6}>
        <CardResumen
          icono="calendar"
          titulo="Meta por día"
          valor={getFormatMoney(resumen.metaPorDia)}
          detalle={`Repartida en ${resumen.cantidadDias} días`}
        />
      </Col>
      <Col lg={3} md={6}>
        <CardResumen
          icono="sales"
          titulo="Venta total acumulada"
          valor={error ? '—' : getFormatMoney(resumen.ventaTotal)}
          detalle={error ? 'No se pudieron cargar las ventas' : 'Membresías vendidas en el periodo'}
          cargando={loading}
        />
      </Col>
      <Col lg={3} md={6}>
        <CardResumen
          icono="check"
          titulo="Mejor día de venta"
          valor={error || !resumen.mejorDia ? '—' : getFormatMoney(resumen.mejorDia.monto)}
          detalle={
            error ? 'No se pudieron cargar las ventas'
              : resumen.mejorDia
                ? `${formatDate(resumen.mejorDia.fecha, 'yyyy-mm-dd', 'd MMMM yyyy')} · +${getFormatMoney(resumen.mejorDia.excedente)} sobre la meta del día`
                : 'Ningún día superó la meta del día'
          }
          cargando={loading}
        />
      </Col>
    </Row>
  )
}
