import { useEffect, useState } from "react"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ButtonCR } from "@/components/Button/ButtonCR"
import type { isOpenModalCustom } from "@/types/props"
import IconCR from "@/components/Icons/IconCR"
import { ModalCustomSeccion } from "@/pages/GestionSecciones/ModalCustomSeccion"
import { DataTableSecciones } from "@/pages/GestionSecciones/DataTableSecciones"
import { useQueryParams } from "@/hook/useQueryParams"
import { querys } from "@/types/parametros"
import { useSeccionesStore } from "@/pages/GestionSecciones/useSeccionesStore"

export const App = () => {
  const [isOpenModalCustom, setisOpenModalCustom] = useState<isOpenModalCustom>({id: 0, isCopy: false,  isOpen: false})
  const { searcher } = useSeccionesStore()
  const onCloseModalCustomImpuesto = ()=>{
      setisOpenModalCustom({id:0, isCopy: false, isOpen: false})
  }
  const onOpenModalCustomImpuesto = (id:number)=>{
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
      <PageBreadCumb title={'Gestion de secciones'}/>
          <ModalCustomSeccion id={isOpenModalCustom.id} onHide={onCloseModalCustomImpuesto} show={isOpenModalCustom.isOpen} />
          <div>
              <DataTableSecciones otrosBotones={
                  <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustomImpuesto(0)} icon={<IconCR name='plus' size={14}/>}/>
              } onOpenModalCustom={onOpenModalCustomImpuesto} />
          </div>
    </div>
  )
}
