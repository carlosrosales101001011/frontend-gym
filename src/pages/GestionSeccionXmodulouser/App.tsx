import { useEffect, useState } from 'react'
import { ButtonCR } from '@/components/Button/ButtonCR'
import IconCR from '@/components/Icons/IconCR'
import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'
import { useSesionStore } from '@/hook/useSesionStore'
import { ModalModulosUsuario } from '@/pages/GestionModuloxUsuario/components/ModalModulosUsuario'
import { useQueryParams } from '@/hook/useQueryParams'
import { querys } from '@/types/parametros'
import { DataTableSeccionesModuloUsuario } from './components/DataTableSeccionesModuloUsuario'
import { ModalSeccionesModuloUsuario } from './components/ModalSeccionesModuloUsuario'
import { useSeccionesModuloUsuario } from './hook/useSeccionesModuloUsuario'

/**
 * Secciones por módulo de usuario: tabla de los usuarios que administra quien está logueado (super usuario:
 * todos, también a sí mismo; los demás: los que registraron) con sus módulos; el ícono de un módulo abre el modal
 * de sus secciones. El super usuario además tiene "Mis módulos" para asignarse módulos.
 */
export const App = () => {
  const { searcher } = useSeccionesModuloUsuario()
  const { usuario, obtenerUsuarioSesion } = useSesionStore()
  // Módulo del usuario (id de modulo_x_user) del modal; null = cerrado
  const [idModuloUser, setIdModuloUser] = useState<number | null>(null)
  const [verMisModulos, setVerMisModulos] = useState(false)

  useEffect(() => {
    if (!usuario) obtenerUsuarioSesion()
  }, [])

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
      {verMisModulos && usuario && (
        <ModalModulosUsuario idUsuario={usuario.id} onHide={() => setVerMisModulos(false)} onGuardado={() => searcher()} />
      )}
      <DataTableSeccionesModuloUsuario
        onAbrirModulo={setIdModuloUser}
        otrosBotones={usuario?.is_super_user && (
          <ButtonCR label="Mis módulos" onClick={() => setVerMisModulos(true)} icon={<IconCR name="plus" size={14} />} />
        )}
      />
    </div>
  )
}
