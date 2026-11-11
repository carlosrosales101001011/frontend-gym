import { useMemo } from 'react'
import { ModalSearching, type ItemResultado } from '@/components/ModalSearching/ModalSearching'
import { useBuscarPersona } from '@/components/BuscadorPersona/useBuscarPersona'
import { ajusteAvatarUltimo } from '@/components/Avatar/encuadreFoto'
import { getBlobUrl } from '@/helpers/blobUrl'

/** Id de tipo de persona "cliente" */
const ID_TIPO_CLIENTE = 2

type ModalBuscarClienteProps = {
  show: boolean
  onHide: () => void
  /** uid del cliente elegido (para abrir su perfil) */
  onSelect: (uid: string) => void
}

/** Modal de búsqueda de personas, solo clientes (por nombre, DNI o teléfono) */
export const ModalBuscarCliente = ({ show, onHide, onSelect }: ModalBuscarClienteProps) => {
  const { personas, cargando, buscarPersona } = useBuscarPersona(ID_TIPO_CLIENTE)

  const items: ItemResultado[] = useMemo(() => personas.map((persona) => ({
    id: persona.id,
    nombre: `${persona.nombres} ${persona.apellido_paterno} ${persona.apellido_materno}`.trim(),
    dni: persona.numero_documento,
    avatar: getBlobUrl(persona.url_avatar_ultimo),
    ajusteAvatar: ajusteAvatarUltimo(persona),
    email_personal: persona.email_personal,
    telefono: persona.telefono,
    idTipo: persona.id_tipo,
  })), [personas])

  const elegir = (id: number) => {
    const uid = personas.find((persona) => persona.id === id)?.uid
    if (!uid) return
    onHide()
    onSelect(uid)
  }

  return (
    <ModalSearching
      isOpen={show}
      id={0}
      onHide={onHide}
      items={items}
      onSearch={buscarPersona}
      cargando={cargando}
      onSelect={elegir}
      autoFocus
    />
  )
}
