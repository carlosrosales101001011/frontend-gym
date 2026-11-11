import { Col, Row } from 'react-bootstrap'
import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { CuerpoAtletico } from './CuerpoAtletico'
import { CuadroSegmento, type SegmentoProps } from './CuadroSegmento'
import { CardEvaluacionAntropometrica } from './CardEvaluacionAntropometrica'
import { CardObservacionEvaluacion } from './CardObservacionEvaluacion'

/** Datos de prueba (fake) hasta tener la evaluación real del paciente */
const SEGMENTOS_FAKE: Record<'brazoDerecho' | 'brazoIzquierdo' | 'tronco' | 'piernaDerecha' | 'piernaIzquierda', SegmentoProps> = {
  brazoDerecho: { nombre: 'Brazo derecho', masaMagra: 3.4, grasa: 0.9 },
  brazoIzquierdo: { nombre: 'Brazo izquierdo', masaMagra: 3.2, grasa: 1.0 },
  tronco: { nombre: 'Tronco', masaMagra: 26.1, grasa: 8.4 },
  piernaDerecha: { nombre: 'Pierna derecha', masaMagra: 9.8, grasa: 2.6 },
  piernaIzquierda: { nombre: 'Pierna izquierda', masaMagra: 9.6, grasa: 2.7 },
}

/** Evaluación corporal del paciente */
export const TabEvaluacionCorporal = () => (
  <Row>
    <Col lg={6}>
      <CardSeccionCR titulo="Análisis segmental" className="mb-3">
        {/* Lado derecho del paciente a la izquierda de la pantalla (como si estuviera de frente); brazo arriba, pierna abajo */}
        <div className="d-flex justify-content-center align-items-center gap-2">
          <div className="d-flex flex-column justify-content-between gap-3 align-self-stretch">
            <CuadroSegmento {...SEGMENTOS_FAKE.brazoDerecho} />
            <CuadroSegmento {...SEGMENTOS_FAKE.piernaDerecha} />
          </div>
          <CuerpoAtletico />
          <div className="d-flex flex-column justify-content-between gap-3 align-self-stretch">
            <CuadroSegmento {...SEGMENTOS_FAKE.brazoIzquierdo} />
            {/* Tronco: al medio, entre brazo y pierna izquierda */}
            <CuadroSegmento {...SEGMENTOS_FAKE.tronco} />
            <CuadroSegmento {...SEGMENTOS_FAKE.piernaIzquierda} />
          </div>
        </div>
      </CardSeccionCR>
    </Col>
    <Col lg={6}>
      <Col lg={12}>
        <CardEvaluacionAntropometrica />
      </Col>
      <Col lg={12}>
        <CardObservacionEvaluacion />
      </Col>
    </Col>
  </Row>
)
