import { useEffect, useState } from 'react'
import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'
import { useQueryParams } from '@/hook/useQueryParams'
import { querys } from '@/types/parametros'
import { DataTableSeccionesModuloUsuario } from './components/DataTableSeccionesModuloUsuario'
import { ModalSeccionesModuloUsuario } from './components/ModalSeccionesModuloUsuario'
import { useSeccionesModuloUsuario } from './hook/useSeccionesModuloUsuario'

/**
 * Secciones por módulo de usuario: tabla de los usuarios que administra quien está logueado (super usuario:
 * todos; los demás: los que registraron) con sus módulos; el ícono de un módulo abre el modal de sus secciones.
 */
export const App = () => {
  const { searcher } = useSeccionesModuloUsuario()
  // Módulo del usuario (id de modulo_x_user) del modal; null = cerrado
  const [idModuloUser, setIdModuloUser] = useState<number | null>(null)

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
      <PageBreadCumb title="Secciones por módulo" />
      {idModuloUser !== null && <ModalSeccionesModuloUsuario idModuloUser={idModuloUser} onHide={() => setIdModuloUser(null)} />}
      <DataTableSeccionesModuloUsuario onAbrirModulo={setIdModuloUser} />
    </div>
  )
}
