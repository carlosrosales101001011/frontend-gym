import { AvatarPorDefecto } from './AvatarPorDefecto'
import { FotoEncuadrada } from './FotoEncuadrada'
import type { AjusteFoto } from './encuadreFoto'

type AvatarCirculoProps = {
  /** URL de la foto; sin foto se muestra la silueta de AvatarPorDefecto */
  src?: string
  alt?: string
  /** Encuadre de la foto; sin ajuste va centrada */
  ajuste?: AjusteFoto | null
  tamano?: number
  className?: string
  /** Click en la foto la abre en pantalla completa (ImageCR); por defecto sí */
  ampliable?: boolean
}

/** Avatar circular de solo lectura (tablas, listas): foto con su encuadre o la silueta si no tiene */
export const AvatarCirculo = ({ src, alt = 'Foto', ajuste, tamano = 32, className = '', ampliable = true }: AvatarCirculoProps) => (
  <span
    className={`d-inline-block flex-shrink-0 overflow-hidden rounded-circle ${className}`}
    style={{ width: tamano, height: tamano }}
  >
    {src ? <FotoEncuadrada src={src} alt={alt} tamano={tamano} ajuste={ajuste} ampliable={ampliable} /> : <AvatarPorDefecto tamano={tamano} />}
  </span>
)
