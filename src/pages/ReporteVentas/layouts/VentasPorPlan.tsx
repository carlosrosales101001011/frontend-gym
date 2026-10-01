import { useEffect, useMemo, useState } from 'react'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { useReporteVentasStore } from '../hook/useReporteVentasStore'
import { agruparVentasPorPlan } from '../helpers/ventasPorPlan'
import { prepararBarras } from '../helpers/barrasComparacion'
import type { MedidaReporte } from '../helpers/medidaReporte'
import { SelectorMedida } from '../components/SelectorMedida'
import { PanelBarras } from '../components/PanelBarras'
import { ID_TODOS, type VentaReporteVentasProps } from '../store/reporteVentasSlice'

type VentasPorPlanProps = {
  /** yyyy-MM-dd */
  fecha_inicio: string
  /** yyyy-MM-dd */
  fecha_fin: string
}

/**
 * Card "Ventas por planes": igual que "Ventas por programa" pero por plan (monto de sus membresías
 * o cantidad de membresías vendidas). Muestra todos los planes; si se eligió uno en el header,
 * su barra se resalta y las de los planes que vendieron más muestran el % de alcance.
 */
export const VentasPorPlan = ({ fecha_inicio, fecha_fin }: VentasPorPlanProps) => {
  const { planes, idAsesorSeleccionado, idSucursalSeleccionada, idProgramaSeleccionado, idPlanSeleccionado, idOrigenSeleccionado, obtenerVentasRango, filtrarVentas } = useReporteVentasStore()
  const [ventas, setVentas] = useState<VentaReporteVentasProps[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [medida, setMedida] = useState<MedidaReporte>('monto')

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
  }, [fecha_inicio, fecha_fin])

  // Asesor, sucursal, origen y programa filtran; el plan no (se resalta y los demás se comparan contra él)
  const idElegido = idPlanSeleccionado !== ID_TODOS ? idPlanSeleccionado : null
  const barras = useMemo(
    () => prepararBarras(agruparVentasPorPlan(filtrarVentas(ventas, { ignorarPlan: true }), planes, idProgramaSeleccionado), medida, idElegido),
    [ventas, medida, idElegido, planes, idProgramaSeleccionado, idAsesorSeleccionado, idSucursalSeleccionada, idOrigenSeleccionado]
  )

  return (
    <div className="card-mode-actual rounded p-3 h-100 position-relative">
      <LoadingOverlay texto="Cargando ventas" show={loading} interno />
      <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
        <h5 className="fw-bold mb-0">Ventas por planes</h5>
        <SelectorMedida medida={medida} onChange={setMedida} />
      </div>

      {error && <div className="text-danger small">No se pudieron cargar las ventas: {error}</div>}
      {!error && !loading && barras.length === 0 && (
        <div className="small opacity-75 py-5 text-center">No hay ventas con estos filtros.</div>
      )}
      {!error && barras.length > 0 && <PanelBarras barras={barras} medida={medida} idElegido={idElegido} etiquetaColumna="Plan" />}
    </div>
  )
}
