import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { InputLabel } from '@/components/TextFields/InputLabel'
import { usePerfilNutricional } from '../../hook/usePerfilNutricional'

/** Mismo ancho de label que Parámetros de investigación: así los campos de los dos cards quedan alineados */
const ANCHO_LABEL = 270

/** Análisis de composición corporal del paciente en la fecha elegida: uno por fila, label a la izquierda; se guardan al salir de cada campo */
export const CardComposicionCorporal = () => {
  const { propsDecimal } = usePerfilNutricional()

  return (
    <CardSeccionCR titulo="Análisis de composición corporal" className="mb-3">
      <InputLabel anchoLabel={ANCHO_LABEL} label="Agua corporal total (L)" {...propsDecimal('agua_corporal_total')} />
      <InputLabel anchoLabel={ANCHO_LABEL} label="Proteínas (kg)" {...propsDecimal('proteinas')} />
      <InputLabel anchoLabel={ANCHO_LABEL} label="Minerales (kg)" {...propsDecimal('minerales')} />
      <InputLabel anchoLabel={ANCHO_LABEL} label="MME - masa músculo esquelética (kg)" {...propsDecimal('masa_musculo_esqueletica')} />
      <InputLabel anchoLabel={ANCHO_LABEL} label="Masa grasa corporal (kg)" {...propsDecimal('masa_grasa_corporal')} />
    </CardSeccionCR>
  )
}
