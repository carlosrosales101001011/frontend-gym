import { useEffect, useMemo, useState } from 'react'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { useReporteVentasStore } from '../hook/useReporteVentasStore'
import { agruparVentasPorPrograma } from '../helpers/ventasPorPrograma'
import { prepararBarras } from '@/components/ReporteBarras/barrasComparacion'
import type { MedidaReporte } from '@/components/ReporteBarras/medidaReporte'
import { SelectorMedida } from '@/components/ReporteBarras/SelectorMedida'
import { PanelBarras } from '@/components/ReporteBarras/PanelBarras'
import { ID_TODOS, type VentaReporteVentasProps } from '../store/reporteVentasSlice'
import type { BarraComparacion } from '@/components/ReporteBarras/barrasComparacion'
import { ModalDetalleVentas, type DetalleVentas } from '../components/ModalDetalleVentas'
import { ventaCumpleFiltroMembresia } from '../helpers/resumenVentas'

type VentasPorProgramaProps = {
  /** yyyy-MM-dd */
  fecha_inicio: string
  /** yyyy-MM-dd */
  fecha_fin: string
}

/**
 * Card "Ventas por programa": igual que "Ventas por asesor" pero por programa (monto de sus membresías
 * o cantidad de membresías vendidas). Muestra todos los programas; si se eligió uno en el header,
 * su barra se resalta y las de los programas que vendieron más muestran el % de alcance.
 */
export const VentasPorPrograma = ({ fecha_inicio, fecha_fin }: VentasPorProgramaProps) => {
  const { opcionesProgramas, idAsesorSeleccionado, idProgramaSeleccionado, idPlanSeleccionado, idOrigenSeleccionado, porFechaPago, textos, obtenerVentasRango, filtrarVentas } = useReporteVentasStore()
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

  // Asesor y origen filtran; el programa no (se resalta y los demás se comparan contra él)
  const idElegido = idProgramaSeleccionado !== ID_TODOS ? idProgramaSeleccionado : null
  const barras = useMemo(
    () => prepararBarras(agruparVentasPorPrograma(filtrarVentas(ventas, { ignorarPrograma: true }), opcionesProgramas, idPlanSeleccionado), medida, idElegido),
    [ventas, medida, idElegido, opcionesProgramas, idPlanSeleccionado, idAsesorSeleccionado, idOrigenSeleccionado]
  )

  // Click en un programa: las ventas/ingresos con membresías de ese programa (y del plan elegido);
  // cada fila suma solo la parte de esas membresías, igual que la barra
  const abrirDetalle = (barra: BarraComparacion) => {
    const filtro = { idPrograma: barra.id, idPlan: idPlanSeleccionado }
    setDetalle({
      titulo: `${textos.tituloModal} · ${barra.nombre}`,
      filas: filtrarVentas(ventas, { ignorarPrograma: true }).filter((venta) => ventaCumpleFiltroMembresia(venta, filtro)),
      filtro,
    })
  }

  return (
    <div className="card-mode-actual rounded p-3 h-100 position-relative">
      <LoadingOverlay texto={textos.cargando} show={loading} interno />
      <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
        <h5 className="fw-bold mb-0">{textos.porPrograma}</h5>
        <SelectorMedida medida={medida} onChange={setMedida} />
      </div>

      {error && <div className="text-danger small">{textos.errorCarga}: {error}</div>}
      {!error && !loading && barras.length === 0 && (
        <div className="small opacity-75 py-5 text-center">{textos.sinDatos}</div>
      )}
      {!error && barras.length > 0 && <PanelBarras barras={barras} medida={medida} idElegido={idElegido} etiquetaColumna="Programa"
        onClickFila={abrirDetalle} onClickBarra={abrirDetalle} textoTooltip={textos.tooltip} />}
      {detalle && (
        <ModalDetalleVentas detalle={detalle} onHide={() => setDetalle(null)} porFechaPago={porFechaPago} fecha_inicio={fecha_inicio} fecha_fin={fecha_fin} />
      )}
    </div>
  )
}
