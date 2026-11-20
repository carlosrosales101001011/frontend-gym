import { Col, Row } from 'react-bootstrap'
import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { calcularCinturaCadera, calcularImc, clasificarImc } from './medidasAntropometricas'
import { usePerfilNutricional } from '../../hook/usePerfilNutricional'

/** Perímetros en cm, de a dos por fila (derecho a la izquierda, izquierdo a la derecha) */
const PERIMETROS = [
  { campo: 'medida_cuello', label: 'Cuello (cm)' },
  { campo: 'medida_pecho', label: 'Pecho (cm)' },
  { campo: 'medida_brazoDerecho', label: 'Brazo derecho (cm)' },
  { campo: 'medida_brazoIzquierdo', label: 'Brazo izquierdo (cm)' },
  { campo: 'medida_musloDerecho', label: 'Muslo derecho (cm)' },
  { campo: 'medida_musloIzquierdo', label: 'Muslo izquierdo (cm)' },
] as const

/** Medidas del paciente en la fecha elegida: se guardan al salir de cada campo; IMC y cintura/cadera se calculan solos */
export const CardEvaluacionAntropometrica = () => {
  const { valor, propsDecimal } = usePerfilNutricional()
  const imc = calcularImc(valor('peso'), valor('talla'))
  const clasificacionImc = clasificarImc(imc)

  return (
    <CardSeccionCR titulo="Evaluación antropométrica" className="mb-3">
      <Row>
        <Col xs={6}><InputCR label="Peso (kg)" {...propsDecimal('peso')} /></Col>
        <Col xs={6}><InputCR label="Talla (m)" {...propsDecimal('talla')} /></Col>
        {/* IMC a lado de la talla: se calcula solo; en negrita con el color de su clasificación */}
        <Col xs={4}>
          <div className="m-2">
            <div className="small opacity-75">IMC</div>
            {clasificacionImc ? (
              <div className={`fw-bold text-${clasificacionImc.color}`}>{imc} · {clasificacionImc.texto}</div>
            ) : (
              <div className="fw-bold opacity-50">—</div>
            )}
          </div>
        </Col>
        <Col xs={6}><InputCR label="Cintura (cm)" {...propsDecimal('cintura')} /></Col>
        <Col xs={6}><InputCR label="Cadera (cm)" {...propsDecimal('cadera')} /></Col>
        {/* Relación cintura-cadera debajo del IMC: se calcula sola, no se edita */}
        <Col xs={4}><InputCR label="Cintura / cadera" value={calcularCinturaCadera(valor('cintura'), valor('cadera'))} readOnly disabled /></Col>
        {PERIMETROS.map(({ campo, label }) => <Col xs={6} key={campo}><InputCR label={label} {...propsDecimal(campo)} /></Col>)}
      </Row>
    </CardSeccionCR>
  )
}
