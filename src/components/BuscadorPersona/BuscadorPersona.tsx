import { useMemo, useState, type ChangeEvent } from 'react'
import { ModalSearching, type ItemResultado } from '@/components/ModalSearching/ModalSearching'
import { ItemSearching } from '@/components/ModalSearching/ItemSearching'
import { useBuscarPersona } from './useBuscarPersona'

type BuscadorPersonaProps = {
  idTipo: number;
  label: string;
  placeholder?: string;
  value: ItemResultado | null;
  onSelect: (persona: ItemResultado) => void;
  required?: boolean;
  onChange?: (e: ChangeEvent<HTMLElement>) => void;
  /** Oculta id, dni, email y telefono del item seleccionado; muestra solo el nombre. */
  soloNombre?: boolean;
}

export const BuscadorPersona = ({ idTipo, label, placeholder = 'Buscar por nombre, DNI o Telefono', value, onSelect, required = false, onChange, soloNombre = false }: BuscadorPersonaProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { personas, buscarPersona } = useBuscarPersona(idTipo)

  const items: ItemResultado[] = useMemo(() => personas.map((persona) => ({
    id: persona.id,
    nombre: `${persona.nombres} ${persona.apellido_paterno} ${persona.apellido_materno}`.trim(),
    dni: persona.numero_documento,
    avatar: persona.url_avatar,
    email_personal: persona.email_personal,
    telefono: persona.telefono,
  })), [personas])

  const onSelectPersona = (id: number) => {
    const persona = items.find((item) => item.id === id)
    if (!persona) return

    onSelect(persona)
    onChange?.({
      target: { value: String(persona.id), type: 'number' },
      currentTarget: { value: String(persona.id), type: 'number' },
      type: 'number',
    } as unknown as ChangeEvent<HTMLElement>)
  }

  return (
    <div className="bg-actual">
      <label>{label}{required && <span className="text-danger"> *</span>}</label>
      <div>
        {value ? (
          <div className="input-mode-actual w-100 p-0">
            <ItemSearching
              id={value.id}
              nombre={value.nombre}
              dni={value.dni}
              avatar={value.avatar}
              email={value.email_personal}
              telefono={value.telefono}
              onClick={() => setIsOpen(true)}
              soloNombre={soloNombre}
            />
          </div>
        ) : (
          <button
            type='button'
            className="textfield-input input-mode-actual w-100 text-start"
            style={{ cursor: 'pointer', height: '40px' }}
            onClick={() => setIsOpen(true)}
          >
            {placeholder}
          </button>
        )}
      </div>
      <ModalSearching
        isOpen={isOpen}
        id={0}
        onHide={() => setIsOpen(false)}
        items={items}
        onSearch={buscarPersona}
        onSelect={onSelectPersona}
      />
    </div>
  )
}
