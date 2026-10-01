import { AvatarPorDefecto } from './AvatarPorDefecto'
import { FotoEncuadrada } from './FotoEncuadrada'
import type { AjusteFoto } from './encuadreFoto'

type AvatarFotoProps = {
  /** URL de la foto; sin foto se muestra la silueta de AvatarPorDefecto */
  src?: string
  /** Texto alternativo de la foto (ej. el nombre de la persona) */
  alt?: string
  /** Encuadre de la foto (dónde está el círculo); sin ajuste va centrada */
  ajuste?: AjusteFoto | null
  tamano?: number
  className?: string
  /** Al hacer click (ej. abrir el selector de archivo) */
  onClick?: () => void
  /** Mientras se sube la foto: la sombra queda fija con "Subiendo..." y no se puede hacer click */
  cargando?: boolean
}

/**
 * Avatar circular con foto o silueta. Al pasar el mouse (o enfocarlo con Tab) se oscurece y muestra
 * "Actualizar foto" si ya tiene una, o "Cargar foto" si no. Estilos en _AvatarPorDefecto.scss.
 */
export const AvatarFoto = ({ src, alt = 'Foto', ajuste, tamano = 80, className = '', onClick, cargando = false }: AvatarFotoProps) => {
  const texto = cargando ? 'Subiendo...' : src ? 'Actualizar foto' : 'Cargar foto'
  return (
    <button
      type="button"
      className={`avatar-foto ${cargando ? 'avatar-foto--cargando' : ''} ${className}`}
      style={{ width: tamano, height: tamano }}
      onClick={onClick}
      disabled={cargando}
      title={texto}
      aria-label={texto}
    >
      {src ? <FotoEncuadrada src={src} alt={alt} tamano={tamano} ajuste={ajuste} /> : <AvatarPorDefecto tamano={tamano} />}
      <span className="avatar-foto__sombra">{texto}</span>
    </button>
  )
}
