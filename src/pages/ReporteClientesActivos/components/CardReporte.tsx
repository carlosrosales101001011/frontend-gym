import type { ReactNode } from 'react'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'

type CardReporteProps = {
  titulo: string
  loading: boolean
  error: string
  /** Sin datos: muestra el aviso en lugar del contenido */
  vacio: boolean
  children: ReactNode
}

/** Card de un layout del reporte de clientes activos: título, loading interno, error y aviso de vacío */
export const CardReporte = ({ titulo, loading, error, vacio, children }: CardReporteProps) => (
  <div className="card-mode-actual rounded p-3 h-100 position-relative">
    <LoadingOverlay texto="Cargando clientes" show={loading} interno />
    <h5 className="fw-bold mb-3">{titulo}</h5>

    {error && <div className="text-danger small">No se pudieron cargar los clientes activos: {error}</div>}
    {!error && !loading && vacio && (
      <div className="small opacity-75 py-5 text-center">No hay clientes activos.</div>
    )}
    {!error && !vacio && children}
  </div>
)
