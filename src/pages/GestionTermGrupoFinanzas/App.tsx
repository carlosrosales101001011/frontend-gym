import { useState } from "react"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ButtonCR } from "@/components/Button/ButtonCR"
import type { isOpenModalCustom } from "@/types/props"
import { ModalCustomGrupoFinanzas } from "@/pages/GestionTermGrupoFinanzas/ModalCustomGrupoFinanzas"
import { DataTableGrupoFinanzas } from "@/pages/GestionTermGrupoFinanzas/DataTableGrupoFinanzas"
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
      <PageBreadCumb title={'Gestion de grupo de terminologias de finanzas'}/>
          <ModalCustomGrupoFinanzas id={isOpenModalCustom.id} onHide={onCloseModalCustomImpuesto} show={isOpenModalCustom.isOpen} />
          <div>
              <DataTableGrupoFinanzas otrosBotones={
                <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustomImpuesto(0)} icon={<IconCR name='plus' size={14}/>}/>
              } onOpenModalCustom={onOpenModalCustomImpuesto} />
          </div>
    </div>
  )
}
