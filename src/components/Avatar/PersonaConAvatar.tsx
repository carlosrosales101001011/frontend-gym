import type { ReactNode } from 'react'
import { getBlobUrl } from '@/helpers/blobUrl'
import { AvatarCirculo } from './AvatarCirculo'
import { ajusteAvatarUltimo } from './encuadreFoto'

/** Foto de una persona como la devuelve el backend (avatar_persona, avatar_cli, ...); null si no tiene */
export type AvatarPersonaApi = {
  url_avatar_ultimo: string
  avatar_x_ultimo: number | null
  avatar_y_ultimo: number | null
  avatar_zoom_ultimo: number | null
} | null

type PersonaConAvatarProps = {
  nombre: ReactNode
  avatar?: AvatarPersonaApi
  /** Tamaño del círculo en px (default: 28) */
  tamano?: number
}

/** Nombre de una persona con su foto al lado (o la silueta si no tiene), para celdas de tablas */
export const PersonaConAvatar = ({ nombre, avatar, tamano = 28 }: PersonaConAvatarProps) => (
  <span className="d-inline-flex align-items-center gap-2">
    <AvatarCirculo src={getBlobUrl(avatar?.url_avatar_ultimo)} ajuste={ajusteAvatarUltimo(avatar)} tamano={tamano} />
    <span>{nombre}</span>
  </span>
)
