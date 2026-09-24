import { useEffect, useState } from "react"
import { ButtonCR } from "@/components/Button/ButtonCR"
import IconCR from "@/components/Icons/IconCR"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ModalCustomColaborador } from "@/pages/GestionColaboradores/ModalCustomColaborador"
import { DataTableColaborador } from "@/pages/GestionColaboradores/DataTableColaborador"
import { useColaboradorStore } from "@/pages/GestionColaboradores/useColaboradorStore"
import { useQueryParams } from "@/hook/useQueryParams"
import { querys } from "@/types/parametros"

type isOpenModalCustomColaborador = {
    id:number;
    isOpen: boolean;
    isCopy: boolean;
}
export const App = () => {
    const [isOpenModalCustomColaborador, setisOpenModalCustomColaborador] = useState<isOpenModalCustomColaborador>({id: 0, isCopy: false,  isOpen: false})
        const { searcher } = useColaboradorStore()
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
    const onCloseModalCustomColaborador = ()=>{
        setisOpenModalCustomColaborador({id:0, isCopy: false, isOpen: false})
    }
    const onOpenModalCustomColaborador = (id:number)=>{
        setisOpenModalCustomColaborador({id, isCopy: false, isOpen: true})
    }
  return (
    <div className="m-1">
        <PageBreadCumb title={'Gestion de colaboradores'}/>
        <ModalCustomColaborador id={isOpenModalCustomColaborador.id} onHide={onCloseModalCustomColaborador} show={isOpenModalCustomColaborador.isOpen} />
        <div>
            <DataTableColaborador 
            otrosBotones={
                <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustomColaborador(0)} icon={<IconCR name='plus' size={14}/>}/>
            }/>
        </div>
    </div>
  )
}
