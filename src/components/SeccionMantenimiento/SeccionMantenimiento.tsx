import { Link } from 'react-router-dom'
import IconCR from '@/components/Icons/IconCR'

type SeccionMantenimientoProps = {
  /** Nombre de la sección (ej. "Punto de venta") */
  nombre?: string
}

/** Aviso en lugar de la página cuando la sección está marcada en mantenimiento (is_seccion_mantenimiento) */
export const SeccionMantenimiento = ({ nombre }: SeccionMantenimientoProps) => (
  <div className="seccion-mantenimiento" role="status">
    <span className="seccion-mantenimiento__icono">
      <IconCR name="settings" size={32} />
    </span>
    <h2 className="seccion-mantenimiento__titulo">Sección en mantenimiento</h2>
    <p className="seccion-mantenimiento__texto">
      {nombre ? <><b>{nombre}</b> está en mantenimiento.</> : 'Esta sección está en mantenimiento.'} Vuelve a intentarlo más tarde.
    </p>
    <Link to="/home" className="btn btn-primary btn-sm">Ir al inicio</Link>
  </div>
)
