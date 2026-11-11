import { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { InputCR } from '@/components/TextFields/InputCR'

type Medidas = {
  peso: string, talla: string, cintura: string, cadera: string
  cuello: string, pecho: string, brazoDerecho: string, brazoIzquierdo: string, musloDerecho: string, musloIzquierdo: string
}

const MEDIDAS_VACIAS: Medidas = {
  peso: '', talla: '', cintura: '', cadera: '',
  cuello: '', pecho: '', brazoDerecho: '', brazoIzquierdo: '', musloDerecho: '', musloIzquierdo: '',
}

/** Perímetros en cm, de a dos por fila (derecho a la izquierda, izquierdo a la derecha) */
const PERIMETROS: { nombre: keyof Medidas, label: string }[] = [
  { nombre: 'cuello', label: 'Cuello (cm)' },
  { nombre: 'pecho', label: 'Pecho (cm)' },
  { nombre: 'brazoDerecho', label: 'Brazo derecho (cm)' },
  { nombre: 'brazoIzquierdo', label: 'Brazo izquierdo (cm)' },
  { nombre: 'musloDerecho', label: 'Muslo derecho (cm)' },
  { nombre: 'musloIzquierdo', label: 'Muslo izquierdo (cm)' },
]

/** Número escrito por el usuario (acepta coma decimal); null si está vacío o no es válido */
const aNumero = (texto: string) => {
  const numero = Number(texto.replace(',', '.'))
  return texto.trim() && Number.isFinite(numero) ? numero : null
}

/** IMC = peso (kg) / talla² (m), con 1 decimal; vacío si falta un dato */
const calcularImc = (peso: string, talla: string) => {
  const kg = aNumero(peso)
  const m = aNumero(talla)
  return kg && m ? (kg / (m * m)).toFixed(1) : ''
}

/** Relación cintura-cadera = cintura (cm) / cadera (cm), con 2 decimales; vacío si falta un dato */
const calcularCinturaCadera = (cintura: string, cadera: string) => {
  const cmCintura = aNumero(cintura)
  const cmCadera = aNumero(cadera)
  return cmCintura && cmCadera ? (cmCintura / cmCadera).toFixed(2) : ''
}

/** Medidas del paciente. Por ahora solo en pantalla: todavía no se guardan en la base */
export const CardEvaluacionAntropometrica = () => {
  const [medidas, setMedidas] = useState<Medidas>(MEDIDAS_VACIAS)

  const campo = (nombre: keyof Medidas, label: string) => (
    <InputCR
      label={label}
      inputMode="decimal"
      value={medidas[nombre]}
      onChange={(e) => setMedidas((actual) => ({ ...actual, [nombre]: e.target.value }))}
    />
  )

  return (
    <CardSeccionCR titulo="Evaluación antropométrica" className="mb-3">
      <Row>
        <Col xs={4}>{campo('peso', 'Peso (kg)')}</Col>
        <Col xs={4}>{campo('talla', 'Talla (m)')}</Col>
        {/* IMC a lado de la talla: se calcula solo, no se edita */}
        <Col xs={4}><InputCR label="IMC" value={calcularImc(medidas.peso, medidas.talla)} readOnly disabled /></Col>
        <Col xs={4}>{campo('cintura', 'Cintura (cm)')}</Col>
        <Col xs={4}>{campo('cadera', 'Cadera (cm)')}</Col>
        {/* Relación cintura-cadera debajo del IMC: se calcula sola, no se edita */}
        <Col xs={4}><InputCR label="Cintura / cadera" value={calcularCinturaCadera(medidas.cintura, medidas.cadera)} readOnly disabled /></Col>
        {PERIMETROS.map(({ nombre, label }) => <Col xs={6} key={nombre}>{campo(nombre, label)}</Col>)}
      </Row>
    </CardSeccionCR>
  )
}
