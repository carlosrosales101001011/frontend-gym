import type { ReactNode } from 'react'
import { Dropdown } from 'react-bootstrap'

type DropdownCRProps = {
  id: string
  /** Texto del botón */
  label: string
  icono?: ReactNode
  /** Cantidad de opciones elegidas: si es mayor a 0 el botón se marca activo y muestra la cantidad */
  contador?: number
  /** Título dentro del menú */
  titulo?: string
  /** Acción al pie del menú (ej. "Quitar todas"); solo se muestra si hay contador */
  pie?: { label: string, onClick: () => void }
  /** Lado hacia el que se alinea el menú */
  align?: 'start' | 'end'
  children: ReactNode
}

/**
 * Botón con menú desplegable (react-bootstrap): no se cierra al tocar dentro del menú, para marcar
 * varias opciones (ver DropdownCheckCR). Estilos en _DropdownCR.scss.
 */
export const DropdownCR = ({ id, label, icono, contador = 0, titulo, pie, align = 'end', children }: DropdownCRProps) => {
  const activo = contador > 0
  return (
    <Dropdown autoClose="outside" align={align} className="dropdown-cr">
      {/* as="button": sin las clases btn / btn-primary que pone react-bootstrap */}
      <Dropdown.Toggle
        as="button"
        type="button"
        id={id}
        bsPrefix="dropdown-cr__toggle"
        className={activo ? 'dropdown-cr__toggle--activo' : ''}
      >
        {icono && <span className="dropdown-cr__icono">{icono}</span>}
        <span className="dropdown-cr__label">{label}</span>
        {activo && <span className="dropdown-cr__contador">{contador}</span>}
        <svg className="dropdown-cr__chevron" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-cr__menu" popperConfig={{ strategy: 'fixed' }}>
        {titulo && <div className="dropdown-cr__titulo">{titulo}</div>}
        <div className="dropdown-cr__opciones">{children}</div>
        {pie && activo && (
          <div className="dropdown-cr__pie">
            <button type="button" className="dropdown-cr__pie-boton" onClick={pie.onClick}>{pie.label}</button>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
}

type DropdownCheckCRProps = {
  id: string
  label: ReactNode
  checked: boolean
  disabled?: boolean
  onChange: () => void
}

/** Opción con checkbox de DropdownCR: toda la fila es clickeable */
export const DropdownCheckCR = ({ id, label, checked, disabled = false, onChange }: DropdownCheckCRProps) => (
  <label
    htmlFor={id}
    className={`dropdown-cr__opcion ${checked ? 'dropdown-cr__opcion--marcada' : ''} ${disabled ? 'dropdown-cr__opcion--deshabilitada' : ''}`}
  >
    <input id={id} type="checkbox" className="dropdown-cr__check" checked={checked} disabled={disabled} onChange={onChange} />
    <span className="dropdown-cr__opcion-texto">{label}</span>
  </label>
)
