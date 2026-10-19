import type { ReactNode } from 'react'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'

type CardCitasProps = {
  titulo: string
  loading: boolean
  error: string
  /** Sin datos con los filtros actuales: muestra el aviso en lugar del contenido */
  vacio: boolean
  children: ReactNode
}

/** Card de un layout del reporte de citas: título, loading interno, error y aviso de vacío */
export const CardCitas = ({ titulo, loading, error, vacio, children }: CardCitasProps) => (
  <div className="card-mode-actual rounded p-3 h-100 position-relative">
    <LoadingOverlay texto="Cargando citas" show={loading} interno />
    <h5 className="fw-bold mb-3">{titulo}</h5>

    {error && <div className="text-danger small">No se pudieron cargar las citas: {error}</div>}
    {!error && !loading && vacio && (
      <div className="small opacity-75 py-5 text-center">No hay citas con estos filtros.</div>
    )}
    {!error && !vacio && children}
  </div>
)
