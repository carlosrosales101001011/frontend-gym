import { useEffect, useState } from "react"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ButtonCR } from "@/components/Button/ButtonCR"
import type { isOpenModalCustom } from "@/types/props"
import IconCR from "@/components/Icons/IconCR"
import { useQueryParams } from "@/hook/useQueryParams"
import { querys } from "@/types/parametros"
import { useIngredienteStore } from "@/pages/GestionIngredientes/useIngredienteStore"
import { ModalCustomIngrediente } from "@/pages/GestionIngredientes/ModalCustomIngrediente"
import { DataTableIngredientes } from "@/pages/GestionIngredientes/DataTableIngredientes"

export const App = () => {
  const { searcher } = useIngredienteStore()
  const [isOpenModalCustom, setisOpenModalCustom] = useState<isOpenModalCustom>({id: 0, isCopy: false, isOpen: false})
  const onCloseModalCustom = ()=>{
      setisOpenModalCustom({id: 0, isCopy: false, isOpen: false})
  }
  const onOpenModalCustom = (id:number)=>{
      setisOpenModalCustom({id, isCopy: false, isOpen: true})
  }

    const { get } = useQueryParams();
    const querySearch = (get(querys.search)||'')
    const queryColumnas = get(querys.columnas)
    const page = Number(get(querys.page))
    const show = Number(get(querys.show))
    useEffect(() => {
      const ctrl = new AbortController();
      searcher(ctrl.signal).catch(e => {
        if (e.name !== 'CanceledError') console.error(e);
      });
      return () => ctrl.abort();
    }, [querySearch, queryColumnas, page, show])
  return (
    <div>
      <PageBreadCumb title={'Ingredientes'}/>
          {/* Se monta solo al abrir para que el form arranque limpio o con los datos a editar */}
          {isOpenModalCustom.isOpen && (
            <ModalCustomIngrediente id={isOpenModalCustom.id} onHide={onCloseModalCustom} show={isOpenModalCustom.isOpen} />
          )}
          <div>
              <DataTableIngredientes otrosBotones={
                  <ButtonCR label={'Agregar ingrediente'} onClick={()=>onOpenModalCustom(0)} icon={<IconCR name='plus' size={14}/>}/>
              } onOpenModalCustom={onOpenModalCustom} />
          </div>
    </div>
  )
}
