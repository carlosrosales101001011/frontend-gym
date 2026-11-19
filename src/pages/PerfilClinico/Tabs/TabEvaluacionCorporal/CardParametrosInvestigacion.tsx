import { Col, Row } from 'react-bootstrap'
import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { usePerfilNutricional } from '../../hook/usePerfilNutricional'

/** Parámetros de investigación del paciente en la fecha elegida: se guardan al salir de cada campo */
export const CardParametrosInvestigacion = () => {
  const { propsDecimal } = usePerfilNutricional()

  return (
    <CardSeccionCR titulo="Parámetros de investigación" className="mb-3">
      <Row>
        <Col xs={6}><InputCR label="Tasa metabólica basal (kcal)" {...propsDecimal('tasa_metabolica_basal')} /></Col>
        <Col xs={6}><InputCR label="Nivel de grasa visceral" {...propsDecimal('nivel_grasa_viceral')} /></Col>
        <Col xs={6}><InputCR label="Grado de obesidad (%)" {...propsDecimal('porcentaje_obesidad')} /></Col>
        <Col xs={6}><InputCR label="Contenido mineral óseo (kg)" {...propsDecimal('mineral_oseo')} /></Col>
        <Col xs={12}><InputCR label="IME - índice de masa esquelética (kg/m²)" {...propsDecimal('masa_esqueletica')} /></Col>
      </Row>
    </CardSeccionCR>
  )
}
