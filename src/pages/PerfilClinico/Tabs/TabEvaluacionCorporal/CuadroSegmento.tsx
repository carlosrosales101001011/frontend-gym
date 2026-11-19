import type { ComponentProps } from 'react'
import { InputCR } from '@/components/TextFields/InputCR'

/** Props del campo (value, onChange, onBlur, disabled…), sin la etiqueta */
type PropsCampo = Omit<ComponentProps<typeof InputCR>, 'label'>

type CuadroSegmentoProps = {
  /** Ej. "Brazo derecho" */
  nombre: string
  /** Masa magra en kg */
  masaMagra: PropsCampo
  /** Grasa en kg */
  grasa: PropsCampo
}

/** Cuadro de un segmento del cuerpo: masa magra y grasa en kg, editables */
export const CuadroSegmento = ({ nombre, masaMagra, grasa }: CuadroSegmentoProps) => (
  <div className="border rounded overflow-hidden" style={{ width: 170 }}>
    {/* Título en franja negra con texto blanco (bg-black ya pone el texto blanco en app.scss) */}
    <div className="bg-black text-white fw-semibold small px-2 py-1 text-center">{nombre}</div>
    <div className="px-1">
      <InputCR label="Masa magra (kg)" {...masaMagra} />
      <InputCR label="Grasa (kg)" {...grasa} />
    </div>
  </div>
)
