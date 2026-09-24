import { useEffect, useState } from "react"
import type { isOpenModalCustom } from "@/types/props"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ModalCustomEgreso } from "@/pages/GestionEgresos/ModalCustomEgreso"
import { ButtonCR } from "@/components/Button/ButtonCR"
import IconCR from "@/components/Icons/IconCR"
import { DataTableEgreso } from "@/pages/GestionEgresos/DataTableEgreso"
import { useEgresosStore } from "@/pages/GestionEgresos/useEgresosStore"
import { useQueryParams } from "@/hook/useQueryParams"
import { querys } from "@/types/parametros"

export const App = () => {
  const [isOpenModalCustom, setisOpenModalCustom] = useState<isOpenModalCustom>({id: 0, isCopy: false,  isOpen: false})
  const { obtenerGastos } = useEgresosStore()
  const onCloseModalCustomEgreso = ()=>{
      setisOpenModalCustom({id:0, isCopy: false, isOpen: false})
  }
  const onOpenModalCustomEgreso = (id:number)=>{
      setisOpenModalCustom({id, isCopy: false, isOpen: true})
  }
  
  const {  get } = useQueryParams();
  const querySearch = (get(querys.search)||'')
  const page = Number(get(querys.page))
  const show = Number(get(querys.show))
  useEffect(() => {
    const ctrl = new AbortController();
    obtenerGastos(ctrl.signal).catch(e => {
      if (e.name !== 'CanceledError') console.error(e);
    });
    return () => ctrl.abort();
  }, [querySearch, page, show])
  return (
    <div>
      <PageBreadCumb title={'Gestion de egresos'}/>
          <ModalCustomEgreso id={isOpenModalCustom.id} onHide={onCloseModalCustomEgreso} show={isOpenModalCustom.isOpen} />
          <div>
              <DataTableEgreso onOpenModalCustomEgreso={onOpenModalCustomEgreso} 
              otrosBotones={
                <div>
                  <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustomEgreso(0)} icon={<IconCR name='plus' size={14}/>}/>
                </div>
                }/>
          </div>
    </div>
  )
}
