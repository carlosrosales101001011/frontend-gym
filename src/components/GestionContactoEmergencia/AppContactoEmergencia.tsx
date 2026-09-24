import React, { useEffect, useState } from 'react'
import { ButtonCR } from '@/components/Button/ButtonCR'
import DataTableCR from '@/components/DataTable/DataTableCR'
import type { ContactoEmergenciaProps } from '@/components/GestionContactoEmergencia/contactoEmergenciaSlice'
import { useContactoEmergenciaStore } from '@/components/GestionContactoEmergencia/useContactoEmergenciaStore'
import IconCR from '@/components/Icons/IconCR'
import { ModalContactoEmergencia } from '@/components/GestionContactoEmergencia/ModalContactoEmergencia'

export const AppContactoEmergencia = ({uid_location=''}) => {
  
  const [isOpenModalContactoEmergencia, setisOpenModalContactoEmergencia] = useState({isOpen: false, id: 0})
  const { deleteContactoEmergenciaxID, obtenerContactosEmergencia, contactosEmergencia } = useContactoEmergenciaStore(uid_location)
  useEffect(() => {
    obtenerContactosEmergencia()
  }, [uid_location])
  
  const columns = [
    {
      id: 0,
      header: 'id',
      render: (row:ContactoEmergenciaProps)=>{
        return (
          <>
            {row.id}
          </>
        )
      }
    },
    {
      id: 1, 
      header: 'Pariente',
      render: (row:ContactoEmergenciaProps)=>{
        return (
          <>
            {row.tipoPariente.valor}
          </>
        )
      }
    },
    {
      id: 3, 
      header: 'Telefono',
      render: (row:ContactoEmergenciaProps)=>{
        return (
          <>
            {row.telefono}
          </>
        )
      }
    },
    {
      id: 4, 
      header: 'Email',
      render: (row:ContactoEmergenciaProps)=>{
        return (
          <>
            {row.email}
          </>
        )
      }
    },
    {
      id: 5, 
      header: 'Observacion',
      render: (row:ContactoEmergenciaProps)=>{
        return (
          <>
            {row.observacion}
          </>
        )
      }
    },
    {
      id: 6, 
      header: '',
      render: (row:ContactoEmergenciaProps)=>{
        return (
          <>
          <span className='mx-2' onClick={()=>onOpenEditContactoEmergencia(row.id)}>
            <IconCR name='edit'/>
          </span>
          <span className='mx-2' onClick={()=>onDeleteContactoEmergencia(row.id)}>
            <IconCR name='trash' />
          </span>
          </>
        )
      }
    },
  ]
  const onOpenEditContactoEmergencia = (id:number)=>{
    console.log(id);
    onOpenModalContactoEmergencia(id)
  }
  const onDeleteContactoEmergencia = (id:number)=>{
    console.log(id);
    deleteContactoEmergenciaxID(id)
  }
  const onCloseModalContactoEmergencia = ()=>{
    setisOpenModalContactoEmergencia({id: 0, isOpen: false})
  }
  const onOpenModalContactoEmergencia = (id:number)=>{
    setisOpenModalContactoEmergencia({id, isOpen: true})
  }
  return (
    <div>
        <ButtonCR label={'Agregar contactacto emergencia'} onClick={()=>onOpenModalContactoEmergencia(0)}/>
        <DataTableCR
          columns={columns}
          data={contactosEmergencia}
          countTotal={1}
          totalPages={1}
        />
        <ModalContactoEmergencia uid_location={uid_location} id={isOpenModalContactoEmergencia.id} show={isOpenModalContactoEmergencia.isOpen} onHide={onCloseModalContactoEmergencia}/>
    </div>
  )
}
