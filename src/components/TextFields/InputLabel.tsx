import { useEffect, useId, useState, type ComponentProps } from 'react'
import { InputCR } from './InputCR'

type InputLabelProps = ComponentProps<typeof InputCR> & {
  /** Ancho del label en px (por defecto 140): así los campos de un formulario quedan alineados */
  anchoLabel?: number
  /** Ancho mínimo del campo en px (por defecto 120): si al lado del label no entra, el label pasa arriba */
  anchoMinimoInput?: number
}

/**
 * Igual que InputCR (mismas props, tipos y estilo), pero con el label fijo a la izquierda y el campo al lado
 * en vez del label flotante. Si no hay espacio para los dos (según el ancho del contenedor, no de la pantalla),
 * el label pasa arriba del campo. Click en el label enfoca el campo.
 */
export const InputLabel = ({
  label,
  anchoLabel = 140,
  anchoMinimoInput = 120,
  required = false,
  LabelColor,
  messageErrors = '',
  id,
  ...props
}: InputLabelProps) => {
  const idAuto = useId()
  const idCampo = id ?? idAuto
  const conError = messageErrors.trim().length !== 0

  // Ancho disponible: se mide el contenedor para saber si el label entra a la izquierda
  const [contenedor, setContenedor] = useState<HTMLDivElement | null>(null)
  const [ancho, setAncho] = useState<number | null>(null)
  useEffect(() => {
    if (!contenedor) return
    const observador = new ResizeObserver(([entrada]) => setAncho(entrada.contentRect.width))
    observador.observe(contenedor)
    return () => observador.disconnect()
  }, [contenedor])
  const arriba = ancho !== null && ancho < anchoLabel + anchoMinimoInput

  return (
    <div ref={setContenedor} className={`input-label d-flex ${arriba ? 'flex-column input-label--arriba' : 'align-items-start'}`}>
      <label
        htmlFor={idCampo}
        className={`input-label__texto ${conError ? 'text-danger' : LabelColor ?? ''}`}
        style={arriba ? undefined : { width: anchoLabel }}
      >
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {/* El campo es un InputCR: su label flotante se oculta (ver _TextFields.scss) */}
      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <InputCR {...props} id={idCampo} label="" required={required} LabelColor={LabelColor} messageErrors={messageErrors} />
      </div>
    </div>
  )
}
