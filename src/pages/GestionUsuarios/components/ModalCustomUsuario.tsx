import { useState } from "react";
import { Col, Row } from "react-bootstrap"
import ModalCR from "@/components/Modal/ModalCR";
import { Stepper2 } from "@/components/Stepper/Stepper2";
import { useGestionUsuariosStore } from "../hook/useGestionUsuariosStore";
import { StepInformacion } from "../layouts/StepInformacion";
import { StepModulos } from "../layouts/StepModulos";
import { StepEntidades } from "../layouts/StepEntidades";

type ModalCustomUsuarioProps = {
    show: boolean;
    onHide:()=>void;
    id: number;
}

const STEPS = [
  { title: "Información", description: "Datos principales" },
  { title: "Módulos", description: "Secciones a las que accede" },
  { title: "Entidades", description: "Permisos por entidad" },
];

/** Alta / edición de usuario en 3 pasos: pasos a la izquierda y el paso actual a la derecha */
export const ModalCustomUsuario = ({show, onHide, id}:ModalCustomUsuarioProps) => {
  const { resetRegistro } = useGestionUsuariosStore()
  const [step, setStep] = useState(0)

  // Al cerrar (o al guardar) se limpia el registro y vuelve al primer paso
  const onCerrar = () => {
    setStep(0)
    resetRegistro()
    onHide()
  }
  return (
    <ModalCR show={show} onHide={onCerrar} size="xl">
      <ModalCR.Header>
        <span className="fw-bold">{id ? 'Editar usuario' : 'Agregar usuario'}</span>
      </ModalCR.Header>
      <ModalCR.Body>
        <Row className="g-4">
          <Col lg={3} style={{ borderRight: '1px solid var(--cr-card-border)' }}>
            <Stepper2 sinClickear steps={STEPS} orientation="vertical" currentStep={step} onChangeStep={setStep}/>
          </Col>
          <Col lg={9}>
            {step===0 && <StepInformacion setStep={setStep}/>}
            {step===1 && <StepModulos setStep={setStep}/>}
            {step===2 && <StepEntidades setStep={setStep} onGuardado={onCerrar}/>}
          </Col>
        </Row>
      </ModalCR.Body>
    </ModalCR>
  )
}
