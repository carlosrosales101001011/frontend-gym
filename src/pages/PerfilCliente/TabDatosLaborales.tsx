import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { usePerfilColaboradorStore } from '@/pages/PerfilCliente/usePerfilColaboradorStore';
import { ButtonCR } from '@/components/Button/ButtonCR';
import { DataTableContratoLaboral } from '@/pages/PerfilCliente/DataTableContratoLaboral';
import { ModalCustomContratoEmpleado } from '@/pages/PerfilCliente/ModalCustomContratoEmpleado';

export const TabDatosLaborales = () => {
  const { uid_cliente } = useParams<{ uid_cliente: string }>();
  const { obtenerContratoxEmpleado } = usePerfilColaboradorStore()
  const [isOpenModalContratoLaboral, setisOpenModalContratoLaboral] = useState({id: 0, isOpen: false})
  const onOpenModalContratoLaboral = (id:number)=>{
    setisOpenModalContratoLaboral({id, isOpen: true})
  }
  const onCloseModalContratoLaboral = ()=>{
    setisOpenModalContratoLaboral({id:0, isOpen: false})
  }
  useEffect(() => {
    obtenerContratoxEmpleado(uid_cliente || '')
  }, [uid_cliente])
  return (
    <div>
      {uid_cliente}
      <ButtonCR label={'Agregar contrato'} onClick={()=>onOpenModalContratoLaboral(0)}/>
        <div className='m-4'>
          <DataTableContratoLaboral/>
          {/* <ItemContratoLaboral/> */}
        </div>
        <ModalCustomContratoEmpleado id={isOpenModalContratoLaboral.id} show={isOpenModalContratoLaboral.isOpen} onHide={onCloseModalContratoLaboral}/>
        </div>
  )
}
