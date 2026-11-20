import type { ItemResultado } from '@/components/ModalSearching/ModalSearching'
import { getBlobUrl } from '@/helpers/blobUrl'
import { ajusteAvatarUltimo } from '@/components/Avatar/encuadreFoto'
import type { PersonaBuscada } from './useBuscarPersona'

/** Nombre del tipo de persona (persona.id_tipo); label_tipo de la base no es confiable */
const NOMBRE_TIPO_PERSONA: Record<number, string> = { 1: 'Colaborador', 2: 'Cliente' }

/** Persona del buscador -> item del ModalSearching. Sin idTipo (se busca en todas) agrega el tipo junto al nombre */
export const personaAItem = (persona: PersonaBuscada, idTipo?: number): ItemResultado => ({
  id: persona.id,
  nombre: [
    `${persona.nombres} ${persona.apellido_paterno} ${persona.apellido_materno}`.trim(),
    !idTipo && persona.id_tipo && NOMBRE_TIPO_PERSONA[persona.id_tipo] ? `(${NOMBRE_TIPO_PERSONA[persona.id_tipo]})` : '',
  ].filter(Boolean).join(' '),
  dni: persona.numero_documento,
  avatar: getBlobUrl(persona.url_avatar_ultimo),
  ajusteAvatar: ajusteAvatarUltimo(persona),
  email_personal: persona.email_personal,
  telefono: persona.telefono,
  idTipo: persona.id_tipo,
})
