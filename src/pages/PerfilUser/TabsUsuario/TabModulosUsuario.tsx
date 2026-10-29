import { useEffect, useState } from 'react'
import IconCR, { type IconName } from '@/components/Icons/IconCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { ListaSecciones } from '@/pages/GestionModuloxUsuario/components/ListaSecciones'
import { ModalModulosUsuario } from '@/pages/GestionModuloxUsuario/components/ModalModulosUsuario'
import type { ModuloUsuarioProps } from '@/pages/GestionModuloxUsuario/store/modulosUsuarioSlice'
import { usePerfilUsuarioContexto } from '../hook/perfilUsuarioContexto'
import { usePerfilUsuario } from '../hook/usePerfilUsuario'

/**
 * Módulos del usuario y las secciones que tiene en cada uno. Quien puede editarlo (quien lo registró o un
 * super usuario) tiene "Agregar módulos": abre el modal de asignación de módulos y secciones de este usuario.
 */
export const TabModulosUsuario = () => {
  const { perfil } = usePerfilUsuarioContexto()
  const { obtenerModulos } = usePerfilUsuario()
  // undefined = cargando; null = sin permiso o error
  const [modulos, setModulos] = useState<ModuloUsuarioProps[] | null | undefined>(undefined)
  const [verModal, setVerModal] = useState(false)
  const idUsuario = perfil!.usuario.id

  const cargarModulos = () => obtenerModulos(idUsuario).then(setModulos).catch(() => setModulos(null))

  useEffect(() => {
    cargarModulos()
  }, [idUsuario])

  if (modulos === undefined) {
    return <div className="position-relative" style={{ minHeight: 120 }}><LoadingOverlay show interno texto="Cargando módulos" /></div>
  }
  if (modulos === null) {
    return <p className="small opacity-75 m-3">Solo quien registró a este usuario o un super usuario puede ver sus módulos.</p>
  }

  return (
    <div className="m-3 d-flex flex-column gap-2">
      {verModal && <ModalModulosUsuario idUsuario={idUsuario} onHide={() => setVerModal(false)} onGuardado={cargarModulos} />}
      {perfil!.puedeEditar && (
        <div>
          <ButtonCR label="Agregar módulos" onClick={() => setVerModal(true)} icon={<IconCR name="plus" size={14} />} />
        </div>
      )}
      {!modulos.length && <p className="small opacity-75 mb-0">Este usuario no tiene módulos.</p>}
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
