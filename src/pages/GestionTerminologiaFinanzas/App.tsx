import { useState } from 'react'
import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { ModalCustomTermFinanzas } from '@/pages/GestionTerminologiaFinanzas/ModalCustomTermFinanzas'
import IconCR from '@/components/Icons/IconCR'
import { DataTableTermFinanzas } from '@/pages/GestionTerminologiaFinanzas/DataTableTermFinanzas'
export const App = () => {
  const [isOpenModalCustom, setisOpenModalCustom] = useState<{id:number, parentId:number, isCopy:boolean, isOpen:boolean}>({id: 0, parentId: 0, isCopy: false,  isOpen: false})
  const onCloseModalCustomTermFinanzas = ()=>{
      setisOpenModalCustom({id:0, parentId: 0, isCopy: false, isOpen: false})
  }
  const onOpenModalCustomTermFinanzas = (id:number, parentId:number, isCopy=false)=>{
      setisOpenModalCustom({id, parentId, isCopy, isOpen: true})
  }
  return (
    <div>
      <PageBreadCumb title={'Terminologias financieras'}/>
          <ModalCustomTermFinanzas id={isOpenModalCustom.id} parentId={isOpenModalCustom.parentId} onHide={onCloseModalCustomTermFinanzas} show={isOpenModalCustom.isOpen} />
              <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustomTermFinanzas(0, 0)} icon={<IconCR name='plus' size={14}/>}/>
          <div>
              <DataTableTermFinanzas onOpenModalCustom={onOpenModalCustomTermFinanzas} />
          </div>
    </div>
  )
}
