import { Col, Row } from 'react-bootstrap'
import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { CuerpoAtletico } from './CuerpoAtletico'
import { CuadroSegmento } from './CuadroSegmento'
import { CardEvaluacionAntropometrica } from './CardEvaluacionAntropometrica'
import { CardObservacionEvaluacion } from './CardObservacionEvaluacion'
import { CardParametrosInvestigacion } from './CardParametrosInvestigacion'
import { usePerfilNutricional } from '../../hook/usePerfilNutricional'

/** Evaluación corporal del paciente en la fecha elegida: lo escrito se guarda al salir de cada campo */
export const TabEvaluacionCorporal = () => {
  const { propsDecimal } = usePerfilNutricional()

  return (
  <Row>
    <Col lg={6}>
      <CardSeccionCR titulo="Análisis segmental" className="mb-3">
        {/* Lado derecho del paciente a la izquierda de la pantalla (como si estuviera de frente); brazo arriba, pierna abajo */}
        <div className="d-flex justify-content-center align-items-center gap-2">
          <div className="d-flex flex-column justify-content-between gap-3 align-self-stretch">
            <CuadroSegmento nombre="Brazo derecho" masaMagra={propsDecimal('masa_magra_brazoDerecho')} grasa={propsDecimal('grasa_brazoDerecho')} />
            <CuadroSegmento nombre="Pierna derecha" masaMagra={propsDecimal('masa_magra_piernaDerecha')} grasa={propsDecimal('grasa_piernaDerecha')} />
          </div>
          <CuerpoAtletico />
          <div className="d-flex flex-column justify-content-between gap-3 align-self-stretch">
            <CuadroSegmento nombre="Brazo izquierdo" masaMagra={propsDecimal('masa_magra_brazoIzquierdo')} grasa={propsDecimal('grasa_brazoIzquierdo')} />
            {/* Tronco: al medio, entre brazo y pierna izquierda */}
            <CuadroSegmento nombre="Tronco" masaMagra={propsDecimal('masa_magra_tronco')} grasa={propsDecimal('grasa_tronco')} />
            <CuadroSegmento nombre="Pierna izquierda" masaMagra={propsDecimal('masa_magra_piernaIzquierda')} grasa={propsDecimal('grasa_piernaIzquierda')} />
          </div>
        </div>
      </CardSeccionCR>
        <CardObservacionEvaluacion />
    </Col>
    <Col lg={6}>
      <Col lg={12}>
        <CardEvaluacionAntropometrica />
      </Col>
      <Col lg={12}>
      <CardParametrosInvestigacion />
      </Col>
    </Col>
  </Row>
  )
}
