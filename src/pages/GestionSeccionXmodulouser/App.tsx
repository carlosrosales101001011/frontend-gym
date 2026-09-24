import { useState } from "react"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ButtonCR } from "@/components/Button/ButtonCR"
import type { isOpenModalCustom } from "@/types/props"
import { ModalCustomImpuesto } from "@/pages/GestionSeccionXmodulouser/ModalCustomSeccionXmodulouser"
import { DataTableImpuestos } from "@/pages/GestionSeccionXmodulouser/DataTableSeccionXmodulouser"
import IconCR from "@/components/Icons/IconCR"

export const App = () => {
  const [isOpenModalCustom, setisOpenModalCustom] = useState<isOpenModalCustom>({id: 0, isCopy: false,  isOpen: false})
  const onCloseModalCustomImpuesto = ()=>{
      setisOpenModalCustom({id:0, isCopy: false, isOpen: false})
  }
  const onOpenModalCustomImpuesto = (id:number)=>{
      setisOpenModalCustom({id, isCopy: false, isOpen: true})
  }
  return (
    <div>
      <PageBreadCumb title={'Gestion de impuestos'}/>
          <ModalCustomImpuesto id={isOpenModalCustom.id} onHide={onCloseModalCustomImpuesto} show={isOpenModalCustom.isOpen} />
              <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustomImpuesto(0)} icon={<IconCR name='plus' size={14}/>}/>
          <div>
              <DataTableImpuestos onOpenModalCustom={onOpenModalCustomImpuesto} />
          </div>
    </div>
  )
}
