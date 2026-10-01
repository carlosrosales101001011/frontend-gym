import { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import ModalCR from '@/components/Modal/ModalCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { AvatarPorDefecto } from '@/components/Avatar/AvatarPorDefecto'
import { FotoEncuadrada } from '@/components/Avatar/FotoEncuadrada'
import type { AjusteFoto } from '@/components/Avatar/encuadreFoto'
import { useBlobStorage, type BlobStorageProps } from '@/hook/useBlobStorage'
import { getBlobStorageUrl } from '@/helpers/blobUrl'
import { mensajeError } from '@/helpers/mensajeError'
import { AjustarFoto } from './AjustarFoto'

/** Lado de la foto grande del modal */
const LADO_FOTO = 260

type ModalCustomAvatarProps = {
  show: boolean
  onHide: () => void
  /**
   * Foto guardada: con uid_location el modal trae la imagen vigente y su encuadre de blob_storage
   * (useBlobStorage) y guarda el ajuste él mismo. Sin foto se muestra la silueta.
   */
  uid_location?: string
  /** Se llama después de guardar el ajuste de una foto de uid_location (ej. para refrescar la pantalla) */
  onAjustado?: () => void
  /** Foto local que aún no se guardó (ej. elegida en un formulario); tiene prioridad sobre uid_location */
  src?: string
  alt?: string
  /** Encuadre de la foto local */
  ajuste?: AjusteFoto | null
  /** Se llama con la imagen elegida en "Actualizar foto" */
  onActualizar: (archivo: File) => void
  /** Encuadre elegido para la foto local (quien lo usa lo guarda); la foto no se modifica */
  onAjustar?: (ajuste: AjusteFoto) => void
  /** "Eliminar foto" (solo se habilita si hay foto) */
  onEliminar: () => void
  /** Mientras se guarda: los botones quedan deshabilitados */
  cargando?: boolean
}

/**
 * Ver la foto de una persona en grande y actualizarla, ajustar el círculo (encuadre y zoom), eliminarla o cancelar.
 * - Foto guardada (uid_location): la trae y guarda su ajuste con useBlobStorage.
 * - Foto local (src): el ajuste se devuelve con onAjustar.
 * Subir y eliminar siempre los decide quien lo usa (onActualizar / onEliminar).
 */
export const ModalCustomAvatar = ({ show, onHide, uid_location, onAjustado, src, alt = 'Foto', ajuste, onActualizar, onAjustar, onEliminar, cargando = false }: ModalCustomAvatarProps) => {
  const inputFoto = useRef<HTMLInputElement>(null)
  const blobStorage = useBlobStorage()
  const [ajustando, setAjustando] = useState(false)
  const [imagen, setImagen] = useState<BlobStorageProps | null>(null)
  const [guardandoAjuste, setGuardandoAjuste] = useState(false)
  const usaServidor = !src && Boolean(uid_location)

  // Al abrir: la imagen vigente del uid_location con su encuadre
  const cargarImagen = async () => {
    if (!uid_location) return
    try {
      setImagen(await blobStorage.getUltimoxUidLocation(uid_location))
    } catch (error) {
      console.log(error)
      setImagen(null)
    }
  }
  useEffect(() => {
    if (show && usaServidor) cargarImagen()
  }, [show, usaServidor, uid_location])

  const srcMostrado = src ?? (usaServidor ? getBlobStorageUrl(imagen) : undefined)
  const ajusteMostrado = usaServidor ? imagen : ajuste
  const ocupado = cargando || guardandoAjuste

  /** Foto guardada: se guarda el encuadre en su registro; foto local: se devuelve a quien lo usa */
  const guardarAjuste = async (nuevo: AjusteFoto) => {
    if (!usaServidor || !imagen) {
      onAjustar?.(nuevo)
      return
    }
    setGuardandoAjuste(true)
    try {
      await blobStorage.put(imagen.id, nuevo)
      setImagen({ ...imagen, ...nuevo })
      setAjustando(false)
      onAjustado?.()
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'No se pudo guardar el ajuste', html: mensajeError(error) })
    } finally {
      setGuardandoAjuste(false)
    }
  }
  // Si quien lo usa lo cierra (ej. tras guardar), la próxima vez abre viendo la foto, no ajustando
  if (!show && ajustando) setAjustando(false)

  const cerrar = () => {
    setAjustando(false)
    onHide()
  }

  return (
    <ModalCR show={show} onHide={cerrar} size="md" position="center">
      <ModalCR.Header>
        <span className="fw-bold">{ajustando ? 'Ajustar foto' : 'Foto de perfil'}</span>
      </ModalCR.Header>
      <ModalCR.Body>
        {ajustando && srcMostrado ? (
          <AjustarFoto
            src={srcMostrado}
            ajusteInicial={ajusteMostrado}
            guardando={ocupado}
            onCancelar={() => setAjustando(false)}
            onGuardar={guardarAjuste}
          />
        ) : (
          <>
            <div className="modal-avatar__foto">
              {srcMostrado
                ? <FotoEncuadrada src={srcMostrado} alt={alt} tamano={LADO_FOTO} ajuste={ajusteMostrado} className="rounded-circle" />
                : <AvatarPorDefecto tamano={LADO_FOTO} />}
            </div>
            <div className="d-flex flex-wrap justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: '1px solid var(--cr-card-border)' }}>
              <ButtonCR label="Cancelar" variant="link" onClick={cerrar} disabled={ocupado} />
              {/* Sin foto no hay nada que eliminar ni ajustar: solo "Cargar foto" */}
              {srcMostrado && (
                <>
                  <ButtonCR label="Eliminar foto" variant="outline-primary" onClick={onEliminar} disabled={ocupado} />
                  <ButtonCR label="Ajustar foto" variant="outline-primary" onClick={() => setAjustando(true)} disabled={ocupado} />
                </>
              )}
              <ButtonCR label={ocupado ? 'Guardando...' : srcMostrado ? 'Actualizar foto' : 'Cargar foto'} onClick={() => inputFoto.current?.click()} disabled={ocupado} />
            </div>
            <input
              ref={inputFoto}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const archivo = e.target.files?.[0]
                if (archivo) onActualizar(archivo)
                e.target.value = '' // permite volver a elegir el mismo archivo
              }}
            />
          </>
        )}
      </ModalCR.Body>
    </ModalCR>
  )
}
