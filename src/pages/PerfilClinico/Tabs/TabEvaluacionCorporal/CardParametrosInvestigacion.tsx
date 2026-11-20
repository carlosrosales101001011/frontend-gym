import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { InputLabel } from '@/components/TextFields/InputLabel'
import { usePerfilNutricional } from '../../hook/usePerfilNutricional'

/** Ancho de los labels: el más largo ("IME - índice de masa esquelética (kg/m²)") entra en una línea y los campos quedan alineados */
const ANCHO_LABEL = 270

/** Parámetros de investigación del paciente en la fecha elegida: uno por fila, label a la izquierda; se guardan al salir de cada campo */
export const CardParametrosInvestigacion = () => {
  const { propsDecimal } = usePerfilNutricional()

  return (
    <CardSeccionCR titulo="Parámetros de investigación" className="mb-3">
      <InputLabel anchoLabel={ANCHO_LABEL} label="Tasa metabólica basal (kcal)" {...propsDecimal('tasa_metabolica_basal')} />
      <InputLabel anchoLabel={ANCHO_LABEL} label="Nivel de grasa visceral" {...propsDecimal('nivel_grasa_viceral')} />
      <InputLabel anchoLabel={ANCHO_LABEL} label="Grado de obesidad (%)" {...propsDecimal('porcentaje_obesidad')} />
      <InputLabel anchoLabel={ANCHO_LABEL} label="Contenido mineral óseo (kg)" {...propsDecimal('mineral_oseo')} />
      <InputLabel anchoLabel={ANCHO_LABEL} label="IME - índice de masa esquelética (kg/m²)" {...propsDecimal('masa_esqueletica')} />
    </CardSeccionCR>
  )
}
