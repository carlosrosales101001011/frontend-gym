import { useEffect, useState } from "react"
import type { isOpenModalCustom } from "@/types/props"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ModalCustomTC } from "@/pages/GestionTipoCambio/ModalCustomTC"
import { ButtonCR } from "@/components/Button/ButtonCR"
import IconCR from "@/components/Icons/IconCR"
import { DataTableTC } from "@/pages/GestionTipoCambio/DataTableTC"
import { useQueryParams } from "@/hook/useQueryParams"
import { querys } from "@/types/parametros"
import { useTCStore } from "@/pages/GestionTipoCambio/useTCStore"
export const App = () => {
  const [isOpenModalCustom, setisOpenModalCustom] = useState<isOpenModalCustom>({id: 0, isCopy: false,  isOpen: false})
  const { searcher } = useTCStore()
  const onCloseModalCustom = ()=>{
      setisOpenModalCustom({id:0, isCopy: false, isOpen: false})
  }
  const onOpenModalCustom = (id:number)=>{
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
      <PageBreadCumb title={'Tipo de cambio'}/>
          <ModalCustomTC id={isOpenModalCustom.id} onHide={onCloseModalCustom} show={isOpenModalCustom.isOpen} />
          <div>
              <DataTableTC otrosBotones={
                <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustom(0)} icon={<IconCR name='plus' size={14}/>}/>
              } onOpenModalCustom={onOpenModalCustom}/>
          </div>
    </div>
  )
}
