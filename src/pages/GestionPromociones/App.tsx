import { useEffect, useState } from "react"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ButtonCR } from "@/components/Button/ButtonCR"
import type { isOpenModalCustom } from "@/types/props"
import IconCR from "@/components/Icons/IconCR"
import { useQueryParams } from "@/hook/useQueryParams"
import { querys } from "@/types/parametros"
import { usePromocionesStore } from "@/pages/GestionPromociones/usePromocionesStore"
import { ModalCustomPromocion } from "@/pages/GestionPromociones/ModalCustomPromocion"
import { DataTablePromociones } from "@/pages/GestionPromociones/DataTablePromociones"

export const App = () => {
    const { searcher } = usePromocionesStore()
  const [isOpenModalCustom, setisOpenModalCustom] = useState<isOpenModalCustom>({id: 0, isCopy: false,  isOpen: false})
  const onCloseModalCustomPromocion = ()=>{
      setisOpenModalCustom({id:0, isCopy: false, isOpen: false})
  }
  const onOpenModalCustomPromocion = (id:number)=>{
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
      <PageBreadCumb title={'Gestión de Promociones'}/>
          <ModalCustomPromocion id={isOpenModalCustom.id} onHide={onCloseModalCustomPromocion} show={isOpenModalCustom.isOpen} />
          <div>
              <DataTablePromociones otrosBotones={
                  <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustomPromocion(0)} icon={<IconCR name='plus' size={14}/>}/>
              } onOpenModalCustom={onOpenModalCustomPromocion} />
          </div>
    </div>
  )
}
