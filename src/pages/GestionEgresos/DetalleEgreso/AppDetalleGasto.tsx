import { useState } from "react";
import { ButtonCR } from "@/components/Button/ButtonCR"
import IconCR from "@/components/Icons/IconCR"
import { DataTableDetalleEgreso } from "@/pages/GestionEgresos/DetalleEgreso/DataTableDetalleEgreso";
import { ModalCustomDetalleGasto } from "@/pages/GestionEgresos/DetalleEgreso/ModalCustomDetalleGasto";
import type { isOpenModalCustom } from "@/types/props";

export const AppDetalleGasto = () => {
  const [isOpenModalCustom, setisOpenModalCustom] = useState<isOpenModalCustom>({ isOpen: false, id: 0, isCopy: false });
  const onOpenModalCustomDetalleEgreso = (id:number)=>{
    console.log(id);
    setisOpenModalCustom({id, isCopy: false, isOpen: true})
  }
  return (
    <div>
      <ModalCustomDetalleGasto onHide={()=>setisOpenModalCustom({id:0, isCopy: false, isOpen: false})} show={isOpenModalCustom.isOpen} />
      <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustomDetalleEgreso(0)} icon={<IconCR name='plus' size={14}/>}/>
      <div>
        <DataTableDetalleEgreso/>
      </div>
    </div>
  )
}
