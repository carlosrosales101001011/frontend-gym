import { Col, Row } from 'react-bootstrap'
import { CardAntecedentes } from './CardAntecedentes'
import { CardCirugiasPrevias } from './CardCirugiasPrevias'

/** Antecedentes del paciente (pestaña "Antecedentes"): personales, familiares, lesiones, cirugías previas y alergias e intolerancias */
export const TabHistoriaAlimentaria = () => (
  <Row>
    <Col lg={6}>
      <CardAntecedentes titulo="Antecedentes personales" terminologia="antecedentesPersonales" campo="antecedentes_personales" />
    </Col>
    <Col lg={6}>
      <CardAntecedentes titulo="Antecedentes familiares" terminologia="antecedentesFamiliares" campo="antecedentes_familiares" />
    </Col>
    <Col lg={4}>
      <CardAntecedentes titulo="Lesiones" terminologia="lesionesPaciente" campo="lesiones" />
    </Col>
    <Col lg={4}>
      <CardAntecedentes titulo="Alergias e intolerancias" terminologia="alergiasIntoleranciasPaciente" campo="alergias" />
    </Col>
    <Col lg={4}>
      <CardCirugiasPrevias />
    </Col>
  </Row>
)
