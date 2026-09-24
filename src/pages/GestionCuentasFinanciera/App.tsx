import { useEffect, useState } from "react"
import type { isOpenModalCustom } from "@/types/props"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ModalCustomCuentasFinanciera } from "@/pages/GestionCuentasFinanciera/ModalCustomCuentasFinanciera"
import { ButtonCR } from "@/components/Button/ButtonCR"
import IconCR from "@/components/Icons/IconCR"
import { DataTableCuentasFinanciera } from "@/pages/GestionCuentasFinanciera/DataTableCuentasFinanciera"
import { useQueryParams } from "@/hook/useQueryParams"
import { querys } from "@/types/parametros"
import { useCuentasFinancieraStore } from "@/pages/GestionCuentasFinanciera/useCuentasFinancieraStore"
export const App = () => {
  const { searcher } = useCuentasFinancieraStore();
  const [isOpenModalCustom, setisOpenModalCustom] = useState<isOpenModalCustom>({id: 0, isCopy: false,  isOpen: false})
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
      <PageBreadCumb title={'Gestion de cuentas financieras'}/>
          <ModalCustomCuentasFinanciera id={isOpenModalCustom.id} onHide={onCloseModalCustom} show={isOpenModalCustom.isOpen} />
          <div>
              <DataTableCuentasFinanciera otrosBotones={
                <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustom(0)} icon={<IconCR name='plus' size={14}/>}/>
              } onOpenModalCustom={onOpenModalCustom}/>
          </div>
    </div>
  )
}
