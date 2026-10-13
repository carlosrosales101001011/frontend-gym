import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AvatarFoto } from '@/components/Avatar/AvatarFoto'
import { ajusteAvatarUltimo } from '@/components/Avatar/encuadreFoto'
import { ModalCustomAvatar } from '@/components/ModalCustomAvatar/ModalCustomAvatar'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'
import { getBlobUrl } from '@/helpers/blobUrl'
import { CardActivoDesde } from './components/CardActivoDesde'
import { useFotoPerfil } from './hook/useFotoPerfil'
import { useInfoCliente } from './hook/useInfoCliente'
import { useEliminarCliente } from './hook/useEliminarCliente'
import { ButtonCR } from '@/components/Button/ButtonCR'
import IconCR from '@/components/Icons/IconCR'

/** Tarjeta del perfil: foto, nombre, racha de membresías, email y teléfono del cliente (carga propia) */
export const CardInfo = () => {
  const { url_modulo, uid_person } = useParams<{ url_modulo: string, uid_person: string }>()
  const navigate = useNavigate()
  const { persona, cargando, obtenerInfo } = useInfoCliente()
  const { eliminando, eliminarCliente } = useEliminarCliente()
  const { subiendo, subirFoto, eliminarFoto } = useFotoPerfil()
  const [showModalAvatar, setShowModalAvatar] = useState(false)

  useEffect(() => {
    if (uid_person) obtenerInfo(uid_person)
  }, [uid_person])

  /** Tras actualizar o eliminar la foto: se vuelve a pedir la persona (para verla) y se cierra el modal */
  const alTerminar = async (ok: boolean) => {
    if (!ok || !uid_person) return
    await obtenerInfo(uid_person)
    setShowModalAvatar(false)
  }

  const nombreCompleto = persona
    ? [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' ')
    : ''

  /** Al eliminarlo, vuelve a la lista de clientes */
  const onEliminar = async () => {
    if (!persona) return
    if (await eliminarCliente(persona.id, nombreCompleto)) navigate(`/${url_modulo}/gestion-clientes`, { replace: true })
  }

  return (
    <div className='card-info d-flex flex-column position-relative' style={{ minHeight: '200px' }}>
      {/* Topbar: "Clientes > Nombres Apellidos" (y el título de la pestaña del navegador) */}
      <PageBreadCumb title={nombreCompleto} />
      {/* Solo la primera vez cubre la tarjeta; al refrescar tras cambiar la foto se mantiene a la vista */}
      <LoadingOverlay show={cargando && !persona} interno texto='Cargando cliente' />
      {persona && (
        <>
          {/* Cabecera: en celular es una fila (foto | nombre, email, teléfono); en escritorio, una columna centrada */}
          <div className='card-info__cabecera'>
            <AvatarFoto
              src={getBlobUrl(persona.url_avatar_ultimo)}
              alt={nombreCompleto}
              ajuste={ajusteAvatarUltimo(persona)}
              tamano={100}
              className='card-info__foto'
              cargando={subiendo}
              onClick={() => setShowModalAvatar(true)}
            />
            <div className='card-info__datos'>
              <span className='card-info__nombre color-mode-actual'>{nombreCompleto}</span>
              <div className='card-info__contacto'>
                <div className='card-info__campo'>
                  <span className='card-info__etiqueta'>Email:</span>
                  <span className='text-break'>{persona.email_personal?.trim() || <span className='opacity-75'>Sin email</span>}</span>
                </div>
                <div className='card-info__campo'>
                  <span className='card-info__etiqueta'>Teléfono:</span>
                  <span className='text-break'>{persona.telefono?.trim() || <span className='opacity-75'>Sin teléfono</span>}</span>
                </div>
              </div>
            </div>
          </div>
          <ModalCustomAvatar
            show={showModalAvatar}
            onHide={() => setShowModalAvatar(false)}
            uid_location={persona.uid_avatar}
            onAjustado={() => alTerminar(true)}
            alt={nombreCompleto}
            cargando={subiendo}
            onActualizar={async (archivo) => alTerminar(await subirFoto(persona, archivo))}
            onEliminar={async () => alTerminar(await eliminarFoto(persona))}
          />
          <div className='card-info__activo'>
            <CardActivoDesde/>
          </div>
          <div className='mt-auto pt-3 d-flex justify-content-center'>
            <ButtonCR
              label={eliminando ? 'Eliminando...' : 'Eliminar cliente'}
              icon={<IconCR name='trash' size={14} />}
              variant='outline-danger'
              disabled={eliminando}
              onClick={onEliminar}
            />
          </div>
        </>
      )}
      {!cargando && !persona && <p className='small opacity-75 text-center mb-0'>No se encontró el cliente.</p>}
    </div>
  )
}
