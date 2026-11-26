import { Col, Row } from 'react-bootstrap'
import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { CuerpoAtletico } from './CuerpoAtletico'
import { CuadroSegmento } from './CuadroSegmento'
import { CardEvaluacionAntropometrica } from './CardEvaluacionAntropometrica'
import { CardAnalisisObesidad } from './CardAnalisisObesidad'
import { CardObservacionEvaluacion } from './CardObservacionEvaluacion'
import { CardParametrosInvestigacion } from './CardParametrosInvestigacion'
import { CardComposicionCorporal } from './CardComposicionCorporal'
import { usePerfilNutricional } from '../../hook/usePerfilNutricional'

/** Segmentos del cuerpo: nombre y sufijo de sus campos (masa_magra_X y grasa_X) */
const SEGMENTOS = {
  brazoDerecho: 'Brazo derecho',
  piernaDerecha: 'Pierna derecha',
  brazoIzquierdo: 'Brazo izquierdo',
  tronco: 'Tronco',
  piernaIzquierda: 'Pierna izquierda',
} as const
type Segmento = keyof typeof SEGMENTOS

/** Los dos análisis segmentales: mismo cuerpo y cuadros, distinto dato */
const ANALISIS = [
  { titulo: 'Análisis de MASA MAGRA segmental', label: 'Masa magra (kg)', prefijo: 'masa_magra_' },
  { titulo: 'Análisis de GRASA segmental', label: 'Grasa (kg)', prefijo: 'grasa_' },
] as const

/** Evaluación corporal del paciente en la fecha elegida: lo escrito se guarda al salir de cada campo */
export const TabEvaluacionCorporal = () => {
  const { propsDecimal } = usePerfilNutricional()

  return (
  <Row>
      <Col lg={12}>
      <Row>
        <Col lg={6}>
          <CardComposicionCorporal />
        </Col>
        <Col lg={6}>
        <CardParametrosInvestigacion />
        </Col>
        <Col lg={8}>
            <CardEvaluacionAntropometrica />
        </Col>
        <Col lg={4}>
          <CardAnalisisObesidad />
        </Col>
      </Row>
      </Col>
    <Col lg={12}>
    <Row>
      {ANALISIS.map(({ titulo, label, prefijo }) => {
        const cuadro = (segmento: Segmento) => (
          <CuadroSegmento nombre={SEGMENTOS[segmento]} label={label} campo={propsDecimal(`${prefijo}${segmento}` as `${typeof prefijo}${Segmento}`)} />
        )
        return (
              <Col lg={6}>
                <CardSeccionCR key={titulo} titulo={titulo} className="mb-3">
                  {/* Lado derecho del paciente a la izquierda de la pantalla (como si estuviera de frente); brazo arriba, pierna abajo */}
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <div className="d-flex flex-column justify-content-between gap-3 align-self-stretch">
                      {cuadro('brazoDerecho')}
                      {cuadro('piernaDerecha')}
                    </div>
                    <CuerpoAtletico />
                    <div className="d-flex flex-column justify-content-between gap-3 align-self-stretch">
                      {cuadro('brazoIzquierdo')}
                      {/* Tronco: al medio, entre brazo y pierna izquierda */}
                      {cuadro('tronco')}
                      {cuadro('piernaIzquierda')}
                    </div>
                  </div>
                </CardSeccionCR>
              </Col>
        )
      })}
      </Row>
        <CardObservacionEvaluacion />
    </Col>
  </Row>
  )
}
