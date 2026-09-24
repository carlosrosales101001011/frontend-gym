import { useState } from "react"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ButtonCR } from "@/components/Button/ButtonCR"
import type { isOpenModalCustom } from "@/types/props"
import { ModalCustomSeccionXmodulouser } from "@/pages/GestionSeccionXmodulouser/ModalCustomSeccionXmodulouser"
import { DataTableSeccionXmodulouser } from "@/pages/GestionSeccionXmodulouser/DataTableSeccionXmodulouser"
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
      <PageBreadCumb title={'Gestion de secciones por módulo'}/>
          <ModalCustomSeccionXmodulouser id={isOpenModalCustom.id} onHide={onCloseModalCustom} show={isOpenModalCustom.isOpen} />
              <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustom(0)} icon={<IconCR name='plus' size={14}/>}/>
          <div>
              <DataTableSeccionXmodulouser onOpenModalCustom={onOpenModalCustom} />
          </div>
    </div>
  )
}
