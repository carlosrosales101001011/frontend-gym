import { useState } from 'react'
import { AvatarFoto } from '@/components/Avatar/AvatarFoto'
import { ajusteAvatarUltimo } from '@/components/Avatar/encuadreFoto'
import { ModalCustomAvatar } from '@/components/ModalCustomAvatar/ModalCustomAvatar'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'
import { getBlobUrl } from '@/helpers/blobUrl'
import { useFotoPerfil } from '@/pages/perfil/hook/useFotoPerfil'
import { usePerfilUsuarioContexto } from './hook/perfilUsuarioContexto'
import { ID_TIPO_COLABORADOR } from './hook/usePerfilUsuario'

/**
 * Tarjeta del perfil del usuario: foto, nombre, email y teléfono de su colaborador (si no tiene, los del usuario),
 * además de @usuario, rol y si es super usuario. La foto solo la cambia quien puede editar.
 */
export const CardInfo = () => {
  const { perfil, cargando, recargar } = usePerfilUsuarioContexto()
  const { subiendo, subirFoto, eliminarFoto } = useFotoPerfil(ID_TIPO_COLABORADOR)
  const [showModalAvatar, setShowModalAvatar] = useState(false)

  const usuario = perfil?.usuario
  const colaborador = perfil?.colaborador
  const nombreCompleto = colaborador
    ? [colaborador.nombres, colaborador.apellido_paterno, colaborador.apellido_materno].filter(Boolean).join(' ')
    : usuario ? `${usuario.nombres} ${usuario.apellidos}`.trim() : ''
  const email = colaborador?.email_personal || usuario?.email
  const telefono = colaborador?.telefono || usuario?.telefono

  /** Tras actualizar o eliminar la foto: se vuelve a pedir el perfil y se cierra el modal */
  const alTerminar = async (ok: boolean) => {
    if (!ok) return
    await recargar()
    setShowModalAvatar(false)
  }

  return (
    <div className='card-info d-flex flex-column position-relative' style={{ minHeight: '200px' }}>
      <PageBreadCumb title={nombreCompleto} />
      <LoadingOverlay show={cargando && !perfil} interno texto='Cargando usuario' />
      {usuario && (
        <>
          <div className='card-info__cabecera'>
            <AvatarFoto
              src={getBlobUrl(colaborador?.url_avatar_ultimo)}
              alt={nombreCompleto}
              ajuste={colaborador ? ajusteAvatarUltimo(colaborador) : null}
              tamano={100}
              className='card-info__foto'
              cargando={subiendo}
              // Sin colaborador no hay persona a la cual ponerle foto
              onClick={colaborador && perfil.puedeEditar ? () => setShowModalAvatar(true) : undefined}
            />
            <div className='card-info__datos'>
              <span className='card-info__nombre color-mode-actual'>
                {nombreCompleto}
                {usuario.usuario && <span className='d-block small fw-normal opacity-75'>@{usuario.usuario}</span>}
              </span>
              <div className='card-info__contacto'>
                <div className='card-info__campo'>
                  <span className='card-info__etiqueta'>Rol:</span>
                  <span>
                    {usuario.label_rol || <span className='opacity-75'>Sin rol</span>}
                    {usuario.is_super_user && <span className='badge bg-primary ms-2'>Super usuario</span>}
                  </span>
                </div>
                <div className='card-info__campo'>
                  <span className='card-info__etiqueta'>Email:</span>
                  <span className='text-break'>{email?.trim() || <span className='opacity-75'>Sin email</span>}</span>
                </div>
                <div className='card-info__campo'>
                  <span className='card-info__etiqueta'>Teléfono:</span>
                  <span className='text-break'>{telefono?.trim() || <span className='opacity-75'>Sin teléfono</span>}</span>
                </div>
              </div>
            </div>
          </div>
          {colaborador && (
            <ModalCustomAvatar
              show={showModalAvatar}
              onHide={() => setShowModalAvatar(false)}
              uid_location={colaborador.uid_avatar}
              onAjustado={() => alTerminar(true)}
              alt={nombreCompleto}
              cargando={subiendo}
              onActualizar={async (archivo) => alTerminar(await subirFoto(colaborador, archivo))}
              onEliminar={async () => alTerminar(await eliminarFoto(colaborador))}
            />
          )}
        </>
      )}
      {!cargando && !perfil && <p className='small opacity-75 text-center mb-0'>No se encontró el usuario.</p>}
    </div>
  )
}
