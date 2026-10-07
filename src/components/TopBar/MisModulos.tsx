import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIrAModulo } from '@/hook/useIrAModulo'
import IconCR from '@/components/Icons/IconCR'
import { NubeCR } from '@/components/NubeCR/NubeCR'
import { usePermisosStore } from '@/hook/usePermisosStore'
import { useAppSelector } from '@/stores/Store'
import { ID_TIPO_MODULO_EMPRESARIAL, type moduloProp } from '@/stores/permisos/permisoSlice'

/**
 * Botón "Mis módulos" del Topbar: al pasar el mouse abre una nube con los mismos módulos del Home
 * (se piden al servidor cada vez que se abre) para saltar de un módulo a otro sin pasar por /home.
 */
export const MisModulos = () => {
  const navigate = useNavigate()
  const entrarAModulo = useIrAModulo()
  const { obtenerModulos, loadingModulos } = usePermisosStore()
  const { modulos } = useAppSelector((state) => state.PERMISO)
  const empresariales = useMemo(() => modulos.filter((m) => m.modulo?.id_tipo === ID_TIPO_MODULO_EMPRESARIAL), [modulos])

  /** Igual que en el Home: ProtectedRoutes valida el acceso y lleva a la primera sección */
  const irAModulo = (modulo: moduloProp, cerrar: () => void) => {
    if (entrarAModulo(modulo)) cerrar()
  }

  return (
    <NubeCR
      titulo="Mis módulos"
      ancho={300}
      onAbrir={obtenerModulos}
      cargando={loadingModulos}
      textoCargando="Cargando módulos"
      trigger={({ ariaProps }) => (
        <button type="button" className="topbar__modulos" title="Mis módulos" {...ariaProps}>
          <IconCR name='modulos' size={16} className='topbar__modulos-icon' />
          <span className="topbar__modulos-texto">Mis módulos</span>
        </button>
      )}
    >
      {(cerrar) => (
        <>
          <div className="mis-modulos__grid">
            {empresariales.map((modulo) => (
              <button key={modulo.id} type="button" className="mis-modulos__item" onClick={() => irAModulo(modulo, cerrar)}>
                <span className="mis-modulos__icono icono-modulo">
                  <IconCR name={modulo.modulo.icono || 'no-icon'} size={16} className="" />
                </span>
                <span className="mis-modulos__label">{modulo.modulo.label}</span>
              </button>
            ))}
          </div>
          {!loadingModulos && empresariales.length === 0 && (
            <p className="small opacity-75 mb-0 text-center">No tienes módulos asignados.</p>
          )}
          <button type="button" className="btn btn-link btn-sm w-100 mt-2 mis-modulos__home" onClick={() => { cerrar(); navigate('/home') }}>
            Ir al inicio
          </button>
        </>
      )}
    </NubeCR>
  )
}
