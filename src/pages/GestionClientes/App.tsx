import { useEffect, useState } from "react"
import { ButtonCR } from "@/components/Button/ButtonCR"
import IconCR from "@/components/Icons/IconCR"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ModalCustomClientes } from "@/pages/GestionClientes/ModalCustomClientes"
import { DataTableClientes } from "@/pages/GestionClientes/DataTableClientes"
import { useClientesStore } from "@/pages/GestionClientes/useClientesStore"
import { useQueryParams } from "@/hook/useQueryParams"
import { querys } from "@/types/parametros"
import type { isOpenModalCustom } from "@/types/props"

export const App = () => {
    const [isOpenModalCustom, setisOpenModalCustom] = useState<isOpenModalCustom>({id: 0, isCopy: false,  isOpen: false})
    const { searcher } = useClientesStore()
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
    const onCloseModalCustom = ()=>{
        setisOpenModalCustom({id:0, isCopy: false, isOpen: false})
    }
    const onOpenModalCustom = (id:number)=>{
        setisOpenModalCustom({id, isCopy: false, isOpen: true})
    }
  return (
    <div className="m-1">
        <PageBreadCumb title={'Gestion de clientes'}/>
        <ModalCustomClientes id={isOpenModalCustom.id} onHide={onCloseModalCustom} show={isOpenModalCustom.isOpen} />
        <div>
            <DataTableClientes
            onOpenModalCustom={onOpenModalCustom}
            otrosBotones={
                <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustom(0)} icon={<IconCR name='plus' size={14}/>}/>
            }/>
        </div>
    </div>
  )
}
