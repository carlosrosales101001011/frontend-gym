import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { AvatarCirculo } from '@/components/Avatar/AvatarCirculo'
import { ButtonCR } from '@/components/Button/ButtonCR'
import IconCR from '@/components/Icons/IconCR'
import { ajusteAvatarUltimo } from '@/components/Avatar/encuadreFoto'
import { ModalCustomAvatar } from '@/components/ModalCustomAvatar/ModalCustomAvatar'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'
import { getBlobUrl } from '@/helpers/blobUrl'
import { CardActivoDesde } from './components/CardActivoDesde'
import { ModalBuscarCliente } from './components/ModalBuscarCliente'
import { useFotoPerfil } from './hook/useFotoPerfil'
import { useInfoCliente } from './hook/useInfoCliente'

/** Tarjeta del perfil: foto, nombre, racha de membresías, email y teléfono del cliente (carga propia) */
export const CardInfo = () => {
  const { uid_person } = useParams<{ uid_person: string }>()
  const { persona, cargando, obtenerInfo } = useInfoCliente()
  const { subiendo, subirFoto, eliminarFoto } = useFotoPerfil()
  const [showModalAvatar, setShowModalAvatar] = useState(false)
  const [showBuscarCliente, setShowBuscarCliente] = useState(false)
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  /** Abre el perfil del cliente elegido en el buscador: cambia solo el uid; se mantiene el view-tab (y demás parámetros) */
  const irAlCliente = (uid: string) => {
    if (uid_person && uid !== uid_person) navigate({ pathname: pathname.replace(uid_person, uid), search })
  }

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
            {/* Foto con el botón de editar en la esquina inferior derecha: un círculo mitad sobre la foto y mitad afuera (abre el modal para cambiarla) */}
            <div className='card-info__foto position-relative d-flex'>
              {/* Click en la foto: la abre en pantalla completa sobre el overlay del visor (ImageCR); sin foto muestra la silueta */}
              <AvatarCirculo
                src={getBlobUrl(persona.url_avatar_ultimo)}
                alt={nombreCompleto}
                ajuste={ajusteAvatarUltimo(persona)}
                tamano={100}
              />
              <ButtonCR
                variant='light'
                className='position-absolute rounded-circle border shadow-sm'
                // Centro sobre el borde del círculo a 45° (85%); se descuentan los 4px del m-1 de ButtonCR
                style={{ left: 'calc(85% - 4px)', top: 'calc(85% - 4px)', transform: 'translate(-50%, -50%)', width: 34, height: 34, padding: 0 }}
                // El ícono va como label: con icon, ButtonCR deja un hueco (gap) y no queda centrado
                label={<IconCR name='edit' size={15} />}
                title='Editar foto'
                aria-label='Editar foto'
                disabled={subiendo}
                onClick={() => setShowModalAvatar(true)}
              />
            </div>
            <div className='card-info__datos'>
              <span className='card-info__nombre color-mode-actual'>{nombreCompleto}</span>
              <div className='card-info__contacto'>
                <div className='card-info__campo'>
                  <span className='card-info__etiqueta'>{persona.label_tipo_documento?.trim() || 'Documento'}:</span>
                  <span className='text-break'>{persona.numero_documento?.trim() || <span className='opacity-75'>Sin documento</span>}</span>
                  {/* Lupa: abre el buscador de personas (solo clientes) */}
                  <ButtonCR
                    variant='link'
                    className='p-0 lh-1'
                    label={<IconCR name='search' size={14} />}
                    title='Buscar cliente'
                    aria-label='Buscar cliente'
                    onClick={() => setShowBuscarCliente(true)}
                  />
                </div>
                <div className='card-info__campo'>
                  <span className='card-info__etiqueta'>Distrito:</span>
                  <span className='text-break'>{persona.label_distrito?.trim() || <span className='opacity-75'>Sin distrito</span>}</span>
                </div>
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
          <ModalBuscarCliente show={showBuscarCliente} onHide={() => setShowBuscarCliente(false)} onSelect={irAlCliente} />
          <div className='card-info__activo'>
            <CardActivoDesde/>
          </div>
        </>
      )}
      {!cargando && !persona && <p className='small opacity-75 text-center mb-0'>No se encontró el cliente.</p>}
    </div>
  )
}
