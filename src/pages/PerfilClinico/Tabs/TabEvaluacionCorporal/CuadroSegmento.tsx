import type { ComponentProps } from 'react'
import { InputBordeAbajoCR } from '@/components/Inputs/InputBordeAbajoCR'

/** Props del campo (value, onChange, onBlur, disabled…) */
type PropsCampo = ComponentProps<typeof InputBordeAbajoCR>

type CuadroSegmentoProps = {
  /** Ej. "Brazo derecho" */
  nombre: string
  /** Ej. "Masa magra (kg)": se ve como placeholder y al pasar el mouse */
  label: string
  /** Props del campo editable */
  campo: PropsCampo
}

/** Cuadro de un segmento del cuerpo con su dato (masa magra o grasa), editable */
export const CuadroSegmento = ({ nombre, label, campo }: CuadroSegmentoProps) => (
  <div className="border rounded overflow-hidden" style={{ width: 170 }}>
    {/* Título en franja negra con texto blanco (bg-black ya pone el texto blanco en app.scss) */}
    <div className="bg-black text-white fw-semibold small px-2 py-1 text-center">{nombre}</div>
    <div className="px-2 py-2">
      <InputBordeAbajoCR className="text-center" placeholder={label} title={label} aria-label={`${nombre}: ${label}`} {...campo} />
    </div>
  </div>
)
