import { useState } from "react"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ButtonCR } from "@/components/Button/ButtonCR"
import type { isOpenModalCustom } from "@/types/props"
import { DataTableEntidadxUser } from "@/pages/GestionEntidadxUser/DataTableEntidadxUser"
import IconCR from "@/components/Icons/IconCR"
import { ModalCustomEntidadxUser } from "@/pages/GestionEntidadxUser/ModalCustomEntidadxUser"

export const App = () => {
  const [isOpenModalCustom, setisOpenModalCustom] = useState<isOpenModalCustom>({id: 0, isCopy: false,  isOpen: false})
  const onCloseModalCustomEntidadxUser = ()=>{
      setisOpenModalCustom({id:0, isCopy: false, isOpen: false})
  }
  const onOpenModalCustomEntidadxUser = (id:number)=>{
      setisOpenModalCustom({id, isCopy: false, isOpen: true})
  }
  return (
    <div>
      <PageBreadCumb title={'Gestion de EntidadxUser'}/>
          <ModalCustomEntidadxUser id={isOpenModalCustom.id} onHide={onCloseModalCustomEntidadxUser} show={isOpenModalCustom.isOpen} />
              <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustomEntidadxUser(0)} icon={<IconCR name='plus' size={14}/>}/>
          <div>
              <DataTableEntidadxUser onOpenModalCustom={onOpenModalCustomEntidadxUser} />
          </div>
    </div>
  )
}
