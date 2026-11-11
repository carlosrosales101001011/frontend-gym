import type { ComponentProps, FormEvent } from 'react'
import IconCR from '@/components/Icons/IconCR'
import { ButtonCR } from './ButtonCR'

type BtnCrudProps = Omit<ComponentProps<typeof ButtonCR>, 'onSubmit'> & {
  /**
   * Se ejecuta al hacer click, dentro o fuera de un <form> (ej. onSubmit={handleSubmit(guardar)}).
   * Para que envíe el <form> que lo contiene, usar type="submit" sin esta propiedad.
   */
  onSubmit?: (e: FormEvent<HTMLButtonElement>) => void | Promise<void>
}

const BtnCrud = ({ onSubmit, onClick, ...props }: BtnCrudProps) => (
  <ButtonCR
    {...props}
    onClick={onSubmit ? (e) => { onClick?.(e); onSubmit(e) } : onClick}
  />
)

/** Agregar: fondo primario e ícono "+". Acepta todas las propiedades de ButtonCR (label, variant, disabled, etc.) */
export const BtnAdd = (props: BtnCrudProps) => (
  <BtnCrud label="Agregar" icon={<IconCR name="plus" size={14} />} {...props} />
)

/** Actualizar: fondo rojo e ícono de editar. Acepta todas las propiedades de ButtonCR */
export const BtnUpdate = ({ variant = 'danger', ...props }: BtnCrudProps) => (
  <BtnCrud label="Actualizar" variant={variant} icon={<IconCR name="edit" size={14} />} {...props} />
)

/** Eliminar: blanco con texto, ícono y borde rojos. Acepta todas las propiedades de ButtonCR */
export const BtnDelete = ({ variant = 'light', className = '', ...props }: BtnCrudProps) => (
  <BtnCrud label="Eliminar" variant={variant} className={`btn-delete-cr ${className}`} icon={<IconCR name="delete" size={14} />} {...props} />
)
