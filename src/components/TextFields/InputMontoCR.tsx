import { useState } from 'react'
import { InputCR } from './InputCR'

type InputMontoCRProps = {
  label: string
  value: number
  onChange: (valor: number) => void
  /** Cantidad máxima de decimales. 0 = solo enteros. */
  decimales?: number
  required?: boolean
  disabled?: boolean
  messageErrors?: string
}

// Input numérico que conserva el texto mientras se escribe ("12.", "0.0") y emite un number.
export const InputMontoCR = ({ label, value, onChange, decimales = 2, required, disabled, messageErrors = '' }: InputMontoCRProps) => {
  const [texto, setTexto] = useState(String(value ?? 0))
  const [valorPrevio, setValorPrevio] = useState(value)

  // Sincroniza cuando el valor cambia desde afuera (ej. al elegir un plan o producto).
  if (value !== valorPrevio) {
    setValorPrevio(value)
    if (Number(texto || 0) !== value) setTexto(String(value ?? 0))
  }

  const patron = decimales > 0 ? new RegExp(`^\\d*(\\.\\d{0,${decimales}})?$`) : /^\d*$/

  return (
    <InputCR
      label={label}
      inputMode={decimales > 0 ? 'decimal' : 'numeric'}
      required={required}
      disabled={disabled}
      value={texto}
      messageErrors={messageErrors}
      onChange={(e) => {
        const nuevo = e.target.value.replace(',', '.')
        if (!patron.test(nuevo)) return
        setTexto(nuevo)
        onChange(Number(nuevo || 0))
      }}
    />
  )
}
