import React, { useState } from 'react'
import type { isOpenModalCustom } from '@/types/props';
import { DataTableDetalleGastoPago } from '@/pages/GestionEgresos/DetallePago/DataTableDetalleGastoPago';
import { ButtonCR } from '@/components/Button/ButtonCR';
import IconCR from '@/components/Icons/IconCR';
import { ModalCustomDetalleGastoPago } from '@/pages/GestionEgresos/DetallePago/ModalCustomDetalleGastoPago';

export const AppDetalleGastoPago = () => {
    const [isOpenModalCustom, setisOpenModalCustom] = useState<isOpenModalCustom>({ isOpen: false, id: 0, isCopy: false });
        const onOpenModalCustom = (id:number)=>{
        console.log(id);
        setisOpenModalCustom({id, isCopy: false, isOpen: true})
        }
  return (
    <div>
        <ModalCustomDetalleGastoPago id={isOpenModalCustom.id} onHide={()=>setisOpenModalCustom({id:0, isCopy: false, isOpen: false})} show={isOpenModalCustom.isOpen} />
        <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustom(0)} icon={<IconCR name='plus' size={14}/>}/>
        <div>
            <DataTableDetalleGastoPago/>
        </div>
    </div>
  )
}
