import { useState } from "react"
import type { isOpenModalCustom } from "@/types/props"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ModalCustomProveedores } from "@/pages/GestionProveedores/ModalCustomProveedores"
import { ButtonCR } from "@/components/Button/ButtonCR"
import { DataTableProveedores } from "@/pages/GestionProveedores/DataTableProveedores"
import IconCR from "@/components/Icons/IconCR"

export const App = () => {
    const [isOpenModalCustom, setisOpenModalCustom] = useState<isOpenModalCustom>({id: 0, isCopy: false,  isOpen: false})
    const onCloseModalCustom = ()=>{
        setisOpenModalCustom({id:0, isCopy: false, isOpen: false})
    }
    const onOpenModalCustom = (id:number)=>{
        setisOpenModalCustom({id, isCopy: false, isOpen: true})
    }
  return (
    <div>
      <PageBreadCumb title={'Gestion de proveedores'}/>
          <ModalCustomProveedores id={isOpenModalCustom.id} onHide={onCloseModalCustom} show={isOpenModalCustom.isOpen} />
              <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustom(0)} icon={<IconCR name='plus' size={14}/>}/>
          <div>
              <DataTableProveedores onOpenModalCustom={onOpenModalCustom} />
          </div>
    </div>
  )
}
