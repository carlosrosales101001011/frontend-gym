import IconCR, { type IconName } from '@/components/Icons/IconCR'
import type { SeccionProps } from '../store/modulosUsuarioSlice'

type ChecklistSeccionesProps = {
  /** Secciones que puede dar quien administra (las suyas en el módulo) */
  permitidas: SeccionProps[]
  /** Ids marcados: las que tendrá el usuario */
  marcadas: number[]
  /** Secciones del usuario que quien administra no tiene: se ven marcadas y bloqueadas */
  ajenas: SeccionProps[]
  onAlternar: (idSeccion: number) => void
}

/** Secciones de un módulo del usuario con checkbox: marcar = dársela, desmarcar = quitársela */
export const ChecklistSecciones = ({ permitidas, marcadas, ajenas, onAlternar }: ChecklistSeccionesProps) => {
  if (!permitidas.length && !ajenas.length) {
    return <p className="modulos-usuario__secciones-vacio">No tienes secciones en este módulo para darle</p>
  }
  return (
    <ul className="modulos-usuario__secciones">
      {permitidas.map((seccion) => {
        const marcada = marcadas.includes(seccion.id)
        return (
          <li key={seccion.id}>
            <label className={`modulos-usuario__seccion modulos-usuario__seccion--check ${marcada ? 'modulos-usuario__seccion--marcada' : ''}`}>
              <input type="checkbox" className="form-check-input m-0" checked={marcada} onChange={() => onAlternar(seccion.id)} />
              <IconCR name={(seccion.icon || 'no-icon') as IconName} size={14} className="" />
              {seccion.label}
            </label>
          </li>
        )
      })}
      {ajenas.map((seccion) => (
        <li key={seccion.id}>
          <label className="modulos-usuario__seccion modulos-usuario__seccion--bloqueada" title="No tienes esta sección: no puedes quitarla">
            <input type="checkbox" className="form-check-input m-0" checked disabled readOnly />
            <IconCR name={(seccion.icon || 'no-icon') as IconName} size={14} className="" />
            {seccion.label}
            <IconCR name="lock" size={10} className="" />
          </label>
        </li>
      ))}
    </ul>
  )
}
