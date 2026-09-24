import { useEffect, useState } from "react"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ButtonCR } from "@/components/Button/ButtonCR"
import type { isOpenModalCustom } from "@/types/props"
import IconCR from "@/components/Icons/IconCR"
import { DataTableModulos } from "@/pages/GestionModulos/DataTableModulos"
import { ModalCustomModulo } from "@/pages/GestionModulos/ModalCustomModulo"
import { useQueryParams } from "@/hook/useQueryParams"
import { querys } from "@/types/parametros"
import { useModuloStore } from "@/pages/GestionModulos/useModuloStore"

export const App = () => {
  const [isOpenModalCustom, setisOpenModalCustom] = useState<isOpenModalCustom>({id: 0, isCopy: false,  isOpen: false})
  const { searcher } = useModuloStore()
  const onCloseModalCustomModulo = ()=>{
      setisOpenModalCustom({id:0, isCopy: false, isOpen: false})
  }
  const onOpenModalCustomModulo = (id:number)=>{
      setisOpenModalCustom({id, isCopy: false, isOpen: true})
  }
  
    const {  get } = useQueryParams();
    const querySearch = (get(querys.search)||'')
    const page = Number(get(querys.page))
    const show = Number(get(querys.show))
    useEffect(() => {
    const ctrl = new AbortController();
    searcher(ctrl.signal).catch(e => {
        if (e.name !== 'CanceledError') console.error(e);
    });
    return () => ctrl.abort();
    }, [querySearch, page, show])
  return (
    <div>
      <PageBreadCumb title={'Gestion de modulos'}/>
          <ModalCustomModulo id={isOpenModalCustom.id} onHide={onCloseModalCustomModulo} show={isOpenModalCustom.isOpen} />
          <div>
              <DataTableModulos otrosBotones={
                  <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustomModulo(0)} icon={<IconCR name='plus' size={14}/>}/>
              } onOpenModalCustom={onOpenModalCustomModulo} />
          </div>
    </div>
  )
}
