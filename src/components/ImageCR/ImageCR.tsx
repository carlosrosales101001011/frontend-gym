import { useEffect, useState, type ImgHTMLAttributes, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import IconCR from '@/components/Icons/IconCR'

type ImageCRProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  /** false = imagen normal (logos, editores de foto...); true = lupa al pasar el mouse y click para verla en pantalla completa */
  ampliable?: boolean
  /** Clases del contenedor de la imagen ampliable (ej. 'w-100 h-100' si la imagen ocupa todo su espacio) */
  classNameContenedor?: string
}

/**
 * Imagen del sistema. Con `ampliable`, al pasar el mouse muestra una lupa y el click la abre en pantalla
 * completa sobre un overlay (se cierra con click fuera, la X o ESC); el click no llega al contenedor
 * (p. ej. no selecciona la fila). Estilos en _ImageCR.scss.
 */
export const ImageCR = ({ src, alt = 'Imagen', ampliable = true, classNameContenedor = '', ...props }: ImageCRProps) => {
  const [abierta, setAbierta] = useState(false)

  if (!ampliable) return <img src={src} alt={alt} {...props} />

  // El click va en el contenedor: así funciona aunque la imagen no reciba eventos (ej. FotoEncuadrada)
  const abrir = (e: MouseEvent) => {
    e.stopPropagation()
    setAbierta(true)
  }

  return (
    <>
      <span className={`image-cr ${classNameContenedor}`} onClick={abrir} title="Ver imagen">
        <img src={src} alt={alt} {...props} />
        <span className="image-cr__lupa" aria-hidden="true">
          <IconCR name="search" />
        </span>
      </span>
      {abierta && <VisorImagen src={src} alt={alt} onCerrar={() => setAbierta(false)} />}
    </>
  )
}

type VisorImagenProps = { src: string, alt: string, onCerrar: () => void }

const ZOOM_MIN = 0.5
const ZOOM_MAX = 4
const PASO_ZOOM = 0.25

/** Imagen a pantalla completa sobre un overlay oscuro, con zoom y giro (botones en columna junto a la X) */
const VisorImagen = ({ src, alt, onCerrar }: VisorImagenProps) => {
  const [zoom, setZoom] = useState(1)
  const [giro, setGiro] = useState(0)
  // Girada de costado (90° / 270°) el alto y el ancho máximos se intercambian para que siga entrando
  const deCostado = Math.abs(giro / 90) % 2 === 1

  // ESC cierra solo el visor: va en captura y no deja pasar el evento a los modales de abajo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      onCerrar()
    }
    document.addEventListener('keydown', handler, true)
    const overflowOriginal = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler, true)
      document.body.style.overflow = overflowOriginal
    }
  }, [onCerrar])

  // Los clicks no salen del visor (el portal sigue el árbol de React: llegarían a la fila o tarjeta)
  const cerrar = (e: MouseEvent) => {
    e.stopPropagation()
    onCerrar()
  }

  // Botón de la barra: hace su acción sin cerrar el visor
  const accion = (fn: () => void) => (e: MouseEvent) => {
    e.stopPropagation()
    fn()
  }
  const botones = [
    { icono: 'zoomIn', titulo: 'Acercar', deshabilitado: zoom >= ZOOM_MAX, fn: () => setZoom((z) => Math.min(ZOOM_MAX, z + PASO_ZOOM)) },
    { icono: 'zoomOut', titulo: 'Alejar', deshabilitado: zoom <= ZOOM_MIN, fn: () => setZoom((z) => Math.max(ZOOM_MIN, z - PASO_ZOOM)) },
    { icono: 'rotateLeft', titulo: 'Girar a la izquierda', deshabilitado: false, fn: () => setGiro((g) => g - 90) },
    { icono: 'rotateRight', titulo: 'Girar a la derecha', deshabilitado: false, fn: () => setGiro((g) => g + 90) },
  ] as const

  return createPortal(
    <div className="image-cr-visor" role="dialog" aria-modal="true" aria-label={alt} onClick={cerrar}>
      <div className="image-cr-visor__barra">
        <button type="button" className="image-cr-visor__boton" onClick={cerrar} aria-label="Cerrar" title="Cerrar">
          <IconCR name="times" size={20} className="image-cr-visor__icono" />
        </button>
        {botones.map(({ icono, titulo, deshabilitado, fn }) => (
          <button key={icono} type="button" className="image-cr-visor__boton" onClick={accion(fn)}
            disabled={deshabilitado} aria-label={titulo} title={titulo}>
            <IconCR name={icono} size={22} className="image-cr-visor__icono" />
          </button>
        ))}
      </div>
      <img
        src={src}
        alt={alt}
        className={`image-cr-visor__img ${deCostado ? 'image-cr-visor__img--de-costado' : ''}`}
        style={{ transform: `scale(${zoom}) rotate(${giro}deg)` }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  )
}
