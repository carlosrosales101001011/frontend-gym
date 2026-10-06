import { useEffect, useState } from 'react'
import { ButtonCR } from '@/components/Button/ButtonCR'
import IconCR from '@/components/Icons/IconCR'
import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'
import { useQueryParams } from '@/hook/useQueryParams'
import { querys } from '@/types/parametros'
import { DataTableModulosUsuario } from './components/DataTableModulosUsuario'
import { ModalModulosUsuario } from './components/ModalModulosUsuario'
import { useModulosUsuario } from './hook/useModulosUsuario'

/**
 * Módulos por usuario: tabla de los usuarios que administra quien está logueado (super usuario: todos;
 * los demás: los que registraron) y un modal para asignarles módulos.
 */
export const App = () => {
  const { searcher } = useModulosUsuario()
  // Usuario del modal: null = cerrado, 0 = Agregar
  const [idUsuarioModal, setIdUsuarioModal] = useState<number | null>(null)

  const { get } = useQueryParams()
  const querySearch = get(querys.search) || ''
  const queryColumnas = get(querys.columnas)
  const page = Number(get(querys.page))
  const show = Number(get(querys.show))
  useEffect(() => {
    const ctrl = new AbortController()
    searcher(ctrl.signal).catch((e) => {
      if (e.name !== 'CanceledError') console.error(e)
    })
    return () => ctrl.abort()
  }, [querySearch, queryColumnas, page, show])

  return (
    <div>
      <PageBreadCumb title="Módulos por usuario" />
      {idUsuarioModal !== null && <ModalModulosUsuario idUsuario={idUsuarioModal} onHide={() => setIdUsuarioModal(null)} />}
      <DataTableModulosUsuario
        onEditar={setIdUsuarioModal}
        otrosBotones={<ButtonCR label="Agregar" onClick={() => setIdUsuarioModal(0)} icon={<IconCR name="plus" size={14} />} />}
      />
    </div>
  )
}
