import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { usePerfilNutricional } from '../../hook/usePerfilNutricional'

/** Observación de la evaluación corporal de la fecha elegida: se guarda al salir del campo */
export const CardObservacionEvaluacion = () => {
  const { propsTexto } = usePerfilNutricional()

  return (
    <CardSeccionCR titulo="Observación de la evaluación corporal" className="mb-3">
      <InputCR type="text-area" label="" {...propsTexto('observacion_corporal')} />
    </CardSeccionCR>
  )
}
