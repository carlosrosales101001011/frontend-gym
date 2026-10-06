import { useEffect, useState } from 'react'
import IconCR, { type IconName } from '@/components/Icons/IconCR'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { ListaSecciones } from '@/pages/GestionModuloxUsuario/components/ListaSecciones'
import type { ModuloUsuarioProps } from '@/pages/GestionModuloxUsuario/store/modulosUsuarioSlice'
import { usePerfilUsuarioContexto } from '../hook/perfilUsuarioContexto'
import { usePerfilUsuario } from '../hook/usePerfilUsuario'

/** Módulos del usuario y las secciones que tiene en cada uno (solo lectura) */
export const TabModulosUsuario = () => {
  const { perfil } = usePerfilUsuarioContexto()
  const { obtenerModulos } = usePerfilUsuario()
  // undefined = cargando; null = sin permiso o error
  const [modulos, setModulos] = useState<ModuloUsuarioProps[] | null | undefined>(undefined)
  const idUsuario = perfil!.usuario.id

  useEffect(() => {
    obtenerModulos(idUsuario).then(setModulos).catch(() => setModulos(null))
  }, [idUsuario])

  if (modulos === undefined) {
    return <div className="position-relative" style={{ minHeight: 120 }}><LoadingOverlay show interno texto="Cargando módulos" /></div>
  }
  if (modulos === null) {
    return <p className="small opacity-75 m-3">Solo quien registró a este usuario o un super usuario puede ver sus módulos.</p>
  }
  if (!modulos.length) return <p className="small opacity-75 m-3">Este usuario no tiene módulos.</p>

  return (
    <div className="m-3 d-flex flex-column gap-2">
      {modulos.map((m) => (
        <div key={m.id} className="modulos-usuario__panel mt-0">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="modulos-usuario__icono icono-modulo">
              <IconCR name={(m.modulo.icono || 'no-icon') as IconName} size={16} className="" />
            </span>
            <span className="modulos-usuario__panel-titulo mb-0">{m.modulo.label}</span>
            {m.is_fijado && <IconCR name="fijado" size={13} className="" />}
            {m.is_favorito && <IconCR name="estrella" size={13} className="" />}
            <span className="modulos-usuario__contador ms-auto">{m.secciones.length} secciones</span>
          </div>
          <ListaSecciones secciones={m.secciones} vacio="No tiene secciones en este módulo" />
        </div>
      ))}
    </div>
  )
}
