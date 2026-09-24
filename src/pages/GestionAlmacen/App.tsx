import { useEffect, useState } from "react"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ButtonCR } from "@/components/Button/ButtonCR"
import type { isOpenModalCustom } from "@/types/props"
import IconCR from "@/components/Icons/IconCR"
import { useQueryParams } from "@/hook/useQueryParams"
import { querys } from "@/types/parametros"
import { useAlmacenStore } from "@/pages/GestionAlmacen/useAlmacenStore"
import { ModalCustomAlmacen } from "@/pages/GestionAlmacen/ModalCustomAlmacen"
import { DataTableAlmacen } from "@/pages/GestionAlmacen/DataTableAlmacen"

export const App = () => {
    const { searcher } = useAlmacenStore()
  const [isOpenModalCustom, setisOpenModalCustom] = useState<isOpenModalCustom>({id: 0, isCopy: false,  isOpen: false})
  const onCloseModalCustomSucursal = ()=>{
      setisOpenModalCustom({id:0, isCopy: false, isOpen: false})
  }
  const onOpenModalCustomSucursal = (id:number)=>{
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
      <PageBreadCumb title={'Gestion de Almacenes'}/>
          <ModalCustomAlmacen id={isOpenModalCustom.id} onHide={onCloseModalCustomSucursal} show={isOpenModalCustom.isOpen} />
          <div>
              <DataTableAlmacen otrosBotones={
                  <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustomSucursal(0)} icon={<IconCR name='plus' size={14}/>}/>
              } onOpenModalCustom={onOpenModalCustomSucursal} />
          </div>
    </div>
  )
}
