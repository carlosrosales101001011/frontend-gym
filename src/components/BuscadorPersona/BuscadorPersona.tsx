import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { ModalSearching, type ItemResultado } from '@/components/ModalSearching/ModalSearching'
import { ItemSearching } from '@/components/ModalSearching/ItemSearching'
import { useBuscarPersona } from './useBuscarPersona'
import { personaAItem } from './personaAItem'

type BuscadorPersonaProps = {
  /** Tipo de persona a buscar (1 colaborador, 2 cliente, ...); sin él busca en todas y muestra el tipo junto al nombre */
  idTipo?: number;
  label: string;
  placeholder?: string;
  value: ItemResultado | null;
  onSelect: (persona: ItemResultado) => void;
  required?: boolean;
  onChange?: (e: ChangeEvent<HTMLElement>) => void;
  /** Oculta id, dni, email y telefono del item seleccionado; muestra solo el nombre. */
  soloNombre?: boolean;
  /** Abre el buscador apenas se muestra, con el cursor listo para escribir (default: false) */
  abrirAlMontar?: boolean;
}

export const BuscadorPersona = ({ idTipo, label, placeholder = 'Buscar por nombre, DNI o Telefono', value, onSelect, required = false, onChange, soloNombre = false, abrirAlMontar = false }: BuscadorPersonaProps) => {
  const [isOpen, setIsOpen] = useState(false)

  // Se abre después de montar: si va dentro de otro modal, así queda encima de él (los modales se apilan en orden)
  useEffect(() => {
    if (!abrirAlMontar) return
    const espera = setTimeout(() => setIsOpen(true), 0)
    return () => clearTimeout(espera)
  }, [])
  const { personas, cargando, buscarPersona } = useBuscarPersona(idTipo)

  const items: ItemResultado[] = useMemo(() => personas.map((persona) => personaAItem(persona, idTipo)), [personas, idTipo])

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
              ajusteAvatar={value.ajusteAvatar}
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
        cargando={cargando}
        onSelect={onSelectPersona}
        // Siempre con el cursor en el campo de búsqueda al abrir
        autoFocus
      />
    </div>
  )
}
