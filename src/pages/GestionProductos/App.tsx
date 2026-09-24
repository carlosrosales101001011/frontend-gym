import { useEffect, useState } from "react"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ButtonCR } from "@/components/Button/ButtonCR"
import type { isOpenModalCustom } from "@/types/props"
import { ModalCustomProducto } from "@/pages/GestionProductos/ModalCustomProducto"
import { DataTableProductos } from "@/pages/GestionProductos/DataTableProductos"
import IconCR from "@/components/Icons/IconCR"
import { useQueryParams } from "@/hook/useQueryParams"
import { querys } from "@/types/parametros"
import { useProductoStore } from "@/pages/GestionProductos/useProductoStore"

export const App = () => {
    const { searcher } = useProductoStore()
  const [isOpenModalCustom, setisOpenModalCustom] = useState<isOpenModalCustom>({id: 0, isCopy: false,  isOpen: false})
  const onCloseModalCustomProducto = ()=>{
      setisOpenModalCustom({id:0, isCopy: false, isOpen: false})
  }
  const onOpenModalCustomProducto = (id:number)=>{
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
      <PageBreadCumb title={'Gestion de productos'}/>
          <ModalCustomProducto id={isOpenModalCustom.id} onHide={onCloseModalCustomProducto} show={isOpenModalCustom.isOpen} />
          <div>
              <DataTableProductos otrosBotones={
                  <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustomProducto(0)} icon={<IconCR name='plus' size={14}/>}/>
              } onOpenModalCustom={onOpenModalCustomProducto} />
          </div>
    </div>
  )
}
