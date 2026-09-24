import React from 'react'
import ModalCR from '@/components/Modal/ModalCR';
import { Tab, Tabs } from 'react-bootstrap';
import { InfoContrato } from '@/pages/PerfilCliente/InfoContrato';

type props ={
    onHide: ()=>void;
    show: boolean;
    id: number;
}
export const ModalContratoEmpleado = ({onHide, show, id}:props) => {
  return (
    <ModalCR show={show} onHide={onHide} position='right' size='xl'>
      <ModalCR.Header>
        <span className='fw-bold' style={{fontSize: '16px'}}>
          Contrato de CHARS123 ROSALES MORALES {id}
        </span>
      </ModalCR.Header>
      <ModalCR.Body>
        <Tabs>
          <Tab eventKey="info-contrato" title="Informacion del contrato">
              <InfoContrato/>
          </Tab>
          <Tab eventKey="jornada-contrato" title="Jornada del contrato">
              
          </Tab>
          <Tab eventKey="documentos-contrato" title="Documentos">
              
          </Tab>
        </Tabs>
      </ModalCR.Body>
    </ModalCR>
  )
}
