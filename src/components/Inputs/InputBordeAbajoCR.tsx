import type { CSSProperties, InputHTMLAttributes } from 'react'

/** Estilo de la línea de abajo */
export type TipoBorderBottom = 'linea' | 'puntos' | 'rayas'

const ESTILO_BORDE: Record<TipoBorderBottom, CSSProperties['borderBottomStyle']> = {
  linea: 'solid',
  puntos: 'dotted',
  rayas: 'dashed',
}

type InputBordeAbajoCRProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  /** Línea de abajo: continua, de puntos o de rayas (por defecto 'linea') */
  tipoBorderBottom?: TipoBorderBottom
  /** Tamaño de la letra en px (por defecto 14) */
  sizeNumber?: number
}

/**
 * Input sin borde, solo con la línea de abajo (continua, de puntos o de rayas). Sin etiqueta: usa placeholder.
 * Acepta las props de un input (value, onChange, onBlur, disabled…).
 * @example <InputBordeAbajoCR tipoBorderBottom="puntos" sizeNumber={18} placeholder="Escribe..." />
 */
export const InputBordeAbajoCR = ({ tipoBorderBottom = 'linea', sizeNumber = 14, className = '', style, ...props }: InputBordeAbajoCRProps) => (
  <input
    type="text"
    {...props}
    className={`w-100 bg-transparent ${className}`}
    style={{
      border: 'none',
      borderBottom: `1px ${ESTILO_BORDE[tipoBorderBottom]} currentColor`,
      borderRadius: 0,
      outline: 'none',
      color: 'inherit',
      padding: '2px 0',
      fontSize: sizeNumber,
      ...style,
    }}
  />
)
