import IconCR, { type IconName } from '@/components/Icons/IconCR'
import type { SeccionProps } from '../store/modulosUsuarioSlice'

type ListaSeccionesProps = {
  secciones: SeccionProps[]
  /** Mensaje si no hay secciones */
  vacio: string
}

/** Secciones de un módulo, solo lectura: ícono y nombre de cada una */
export const ListaSecciones = ({ secciones, vacio }: ListaSeccionesProps) => {
  if (!secciones.length) return <p className="modulos-usuario__secciones-vacio">{vacio}</p>
  return (
    <ul className="modulos-usuario__secciones">
      {secciones.map((seccion) => (
        <li key={seccion.id} className="modulos-usuario__seccion">
          <IconCR name={(seccion.icon || 'no-icon') as IconName} size={14} className="" />
          {seccion.label}
          {seccion.is_seccion_mantenimiento && <span className="modulos-usuario__mantenimiento">En mantenimiento</span>}
        </li>
      ))}
    </ul>
  )
}
