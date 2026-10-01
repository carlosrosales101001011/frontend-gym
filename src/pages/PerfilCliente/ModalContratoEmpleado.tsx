import React from 'react'
import ModalCR from '@/components/Modal/ModalCR';
import { TabsCR } from '@/components/Tabs/TabsCR'
import { TabCR } from '@/components/Tabs/TabCR'
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
        <TabsCR>
          <TabCR eventKey="info-contrato" title="Informacion del contrato">
              <InfoContrato/>
          </TabCR>
          <TabCR eventKey="jornada-contrato" title="Jornada del contrato">
              
          </TabCR>
          <TabCR eventKey="documentos-contrato" title="Documentos">
              
          </TabCR>
        </TabsCR>
      </ModalCR.Body>
    </ModalCR>
  )
}
