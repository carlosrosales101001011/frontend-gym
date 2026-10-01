
import { useEffect, useState } from 'react'
import { ButtonCR } from '@/components/Button/ButtonCR'
import IconCR from '@/components/Icons/IconCR'
import { ModalCustomUsuario } from '@/pages/GestionUsuarios/components/ModalCustomUsuario'
import { useGestionUsuariosStore } from '@/pages/GestionUsuarios/hook/useGestionUsuariosStore'
import { DataTableUsuarios } from '@/pages/GestionUsuarios/components/DataTableUsuarios'
import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'
import { useQueryParams } from '@/hook/useQueryParams'
import { querys } from '@/types/parametros'
type propStateModalCustom = {
    id: number;
    show: boolean;
}
export const App = () => {
    const [isOpenModalCustom, setisOpenModalCustom] = useState<propStateModalCustom>({id: 0, show: false})
    const { searcher } = useGestionUsuariosStore()
    const onCloseModalCustom = ()=>{
        setisOpenModalCustom({id: 0, show: false})
    }
    const onOpenModalCustom = (id:number)=>{
        setisOpenModalCustom({id, show: true})
    }
      const {  get } = useQueryParams();
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
    <div className=''>
        <PageBreadCumb title={'Gestion usuario'}/>
        <ModalCustomUsuario onHide={()=>onCloseModalCustom()} id={isOpenModalCustom.id} show={isOpenModalCustom.show} />
        <DataTableUsuarios otrosBotones={
            <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustom(0)} icon={<IconCR name='plus' size={14}/>}/>
        }/>
    </div>
  )
}
