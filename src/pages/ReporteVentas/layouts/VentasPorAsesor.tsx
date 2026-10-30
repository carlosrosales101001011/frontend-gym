import { useEffect, useMemo, useState } from 'react'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { useReporteVentasStore } from '../hook/useReporteVentasStore'
import { agruparVentasPorAsesor } from '../helpers/ventasPorAsesor'
import { prepararBarras } from '@/components/ReporteBarras/barrasComparacion'
import type { MedidaReporte } from '@/components/ReporteBarras/medidaReporte'
import { SelectorMedida } from '@/components/ReporteBarras/SelectorMedida'
import { PanelBarras } from '@/components/ReporteBarras/PanelBarras'
import { ID_TODOS, type VentaReporteVentasProps } from '../store/reporteVentasSlice'
import type { BarraComparacion } from '@/components/ReporteBarras/barrasComparacion'
import { ModalDetalleVentas, type DetalleVentas } from '../components/ModalDetalleVentas'

type VentasPorAsesorProps = {
  /** yyyy-MM-dd */
  fecha_inicio: string
  /** yyyy-MM-dd */
  fecha_fin: string
}

/**
 * Card "Ventas por asesor": barras con lo vendido (misma base que "Total vendido") o la cantidad de ventas
 * de cada asesor, según los botones Monto / Cantidad. Muestra a todos para comparar; si se eligió un asesor
 * en el header, su barra se resalta y las de quienes vendieron más muestran el % de alcance.
 */
export const VentasPorAsesor = ({ fecha_inicio, fecha_fin }: VentasPorAsesorProps) => {
  const { idAsesorSeleccionado, idOrigenSeleccionado, filtroMembresia, porFechaPago, textos, obtenerVentasRango, filtrarVentas } = useReporteVentasStore()
  const [ventas, setVentas] = useState<VentaReporteVentasProps[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [medida, setMedida] = useState<MedidaReporte>('monto')
  /** Barra elegida con click: abre el modal con sus ventas o ingresos */
  const [detalle, setDetalle] = useState<DetalleVentas | null>(null)

  // Ventas del rango (se ignora la respuesta de un rango anterior)
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
  }, [fecha_inicio, fecha_fin, porFechaPago])

  // Programa y origen filtran; el asesor no (se resalta y los demás se comparan contra él)
  const idElegido = idAsesorSeleccionado !== ID_TODOS ? idAsesorSeleccionado : null
  const barras = useMemo(
    () => prepararBarras(agruparVentasPorAsesor(filtrarVentas(ventas, { ignorarAsesor: true }), filtroMembresia), medida, idElegido),
    [ventas, medida, idElegido, filtroMembresia, idOrigenSeleccionado]
  )

  // Click en un asesor: sus ventas/ingresos con los mismos filtros con que se arma su barra
  const abrirDetalle = (barra: BarraComparacion) => setDetalle({
    titulo: `${textos.tituloModal} · ${barra.nombre}`,
    filas: filtrarVentas(ventas, { ignorarAsesor: true }).filter((venta) => venta.id_empl === barra.id),
    filtro: filtroMembresia,
  })

  return (
    <div className="card-mode-actual rounded p-3 h-100 position-relative">
      <LoadingOverlay texto={textos.cargando} show={loading} interno />
      <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
        <h5 className="fw-bold mb-0">{textos.porAsesor}</h5>
        <SelectorMedida medida={medida} onChange={setMedida} />
      </div>

      {error && <div className="text-danger small">{textos.errorCarga}: {error}</div>}
      {!error && !loading && barras.length === 0 && (
        <div className="small opacity-75 py-5 text-center">{textos.sinDatos}</div>
      )}
      {!error && barras.length > 0 && <PanelBarras barras={barras} medida={medida} idElegido={idElegido} etiquetaColumna="Vendedor"
        onClickFila={abrirDetalle} onClickBarra={abrirDetalle} textoTooltip={textos.tooltip} />}
      {detalle && (
        <ModalDetalleVentas detalle={detalle} onHide={() => setDetalle(null)} porFechaPago={porFechaPago} fecha_inicio={fecha_inicio} fecha_fin={fecha_fin} />
      )}
    </div>
  )
}
