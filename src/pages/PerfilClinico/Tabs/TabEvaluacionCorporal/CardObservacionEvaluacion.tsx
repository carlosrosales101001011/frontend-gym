import { useState } from 'react'
import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { InputCR } from '@/components/TextFields/InputCR'

/** Observación de la evaluación corporal. Por ahora solo en pantalla: todavía no se guarda en la base */
export const CardObservacionEvaluacion = () => {
  const [observacion, setObservacion] = useState('')

  return (
    <CardSeccionCR titulo="Observación de la evaluación corporal" className="mb-3">
      <InputCR type="text-area" label="" value={observacion} onChange={(e) => setObservacion(e.target.value)} />
    </CardSeccionCR>
  )
}
