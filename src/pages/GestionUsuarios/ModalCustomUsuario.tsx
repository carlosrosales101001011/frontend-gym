import { Col, Modal, Row } from "react-bootstrap"
import { useState } from "react";
import { StepInformacionPersonal } from "@/pages/GestionUsuarios/ModalCustomComponents/StepInformacionPersonal";
import { StepModulos } from "@/pages/GestionUsuarios/ModalCustomComponents/StepModulos/StepModulos";
import { StepEntidades } from "@/pages/GestionUsuarios/ModalCustomComponents/StepEntidades";
import { Stepper2 } from "@/components/Stepper/Stepper2";

type props = {
    show: boolean;
    onHide:()=>void;
    id: number;
}

export const ModalCustomUsuario = ({show, onHide, id}:props) => {
      const steps = [
        {
          title: "Información",
          description: "Datos principales",
        },
        {
          title: "Modulos",
          description: "Niveles de acceso para el usuario",
        },
        {
          title: "Entidades",
          description: "Niveles de acceso para el usuario",
        },
      ];
  const [step, setstep] = useState(0)
  const onLastStep = (step:number)=>{
    setstep(step)
  }
  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header className="fw-bold"  style={{fontSize: '17px'}}>
          Agregar usuario {id}
      </Modal.Header>
      <Modal.Body className="overflow-auto"  style={{height: '80vh'}}>
        <Row>
          <Col lg={2}>
          <div  style={{ height: '100%'}}>
              <Stepper2 sinClickear steps={steps} orientation="vertical"  currentStep={step} onChangeStep={onLastStep}/>
          </div>
          </Col>
          <Col lg={10}>
          {
            step===0 && (
              <div className="px-5" style={{height: '100%'}}>
                <StepInformacionPersonal setStep={onLastStep}/>
              </div>
            )
          }
          {
            step===1 && (
              <StepModulos setStep={onLastStep}/>
            )
          }
          {
            step===2 && (
              <StepEntidades setStep={onLastStep}/>
            )
          }
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}
