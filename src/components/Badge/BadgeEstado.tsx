import { Badge } from 'react-bootstrap'

type BadgeEstadoProps = {
  activo: boolean
  /** Texto cuando está activo (por defecto "Activo") */
  textoActivo?: string
  /** Texto cuando no lo está (por defecto "Inactivo") */
  textoInactivo?: string
  className?: string
}

/**
 * Estado de un registro en tablas y fichas: verde si está activo, rojo si no.
 * Es el badge común para todas las pantallas que muestran un estado.
 */
export const BadgeEstado = ({ activo, textoActivo = 'Activo', textoInactivo = 'Inactivo', className = '' }: BadgeEstadoProps) => (
  <Badge className={`p-2 fs-6 ${activo ? 'bg-success' : 'bg-danger'} ${className}`}>
    {activo ? textoActivo : textoInactivo}
  </Badge>
)
