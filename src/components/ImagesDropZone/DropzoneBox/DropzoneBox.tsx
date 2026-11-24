import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ClipboardEvent, type DragEvent, type KeyboardEvent, type SyntheticEvent } from 'react'
import classNames from 'classnames'
import IconCR from '@/components/Icons/IconCR'
import { ImageCR } from '@/components/ImageCR/ImageCR'

type DropzoneBoxProps = {
  /** Imagen a mostrar: un File recién elegido o la url de una ya guardada; null/undefined = cuadro vacío */
  imagen?: File | string | null
  /** Se llama con la imagen elegida (arrastrada, pegada con Ctrl+V o elegida con click) */
  onCargar: (archivo: File) => void
  /** Quitar la imagen; si no se pasa, no se muestra el botón de quitar */
  onQuitar?: () => void
  ancho?: number
  alto?: number
  /** Texto del cuadro vacío */
  texto?: string
  /** Url de una imagen de ejemplo (ej. cómo tomar la foto): se ve tenue de fondo mientras el cuadro está vacío */
  imageReferencia?: string
  disabled?: boolean
  className?: string
}

const esImagen = (archivo?: File | null): archivo is File => !!archivo && archivo.type.startsWith('image/')

/**
 * Cuadro para 1 imagen: se arrastra, se pega (Ctrl+V con el cuadro enfocado) o se elige con click / Enter.
 * Con imagen, el click la abre en pantalla completa (ImageCR) y un botón permite cambiarla; con onQuitar, otro la quita.
 * Solo acepta imágenes.
 * Con imageReferencia, el cuadro vacío muestra esa imagen tenue de fondo como guía.
 */
export const DropzoneBox = ({
  imagen,
  onCargar,
  onQuitar,
  ancho = 200,
  alto = 200,
  texto = 'Arrastra, pega o haz click para elegir una imagen',
  imageReferencia,
  disabled = false,
  className,
}: DropzoneBoxProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [arrastrando, setArrastrando] = useState(false)

  // Vista previa: un File necesita su url temporal (se libera al cambiar o desmontar)
  const urlArchivo = useMemo(() => (imagen instanceof File ? URL.createObjectURL(imagen) : null), [imagen])
  useEffect(() => () => {
    if (urlArchivo) URL.revokeObjectURL(urlArchivo)
  }, [urlArchivo])
  const vistaPrevia = typeof imagen === 'string' ? imagen || null : urlArchivo

  const cargar = (archivo?: File | null) => {
    if (!disabled && esImagen(archivo)) onCargar(archivo)
  }
  const elegir = () => {
    if (!disabled) inputRef.current?.click()
  }

  // El visor de ImageCR es un portal: sus eventos también llegan aquí y no son del cuadro
  const esDelCuadro = (e: SyntheticEvent<HTMLDivElement>) => e.currentTarget.contains(e.target as Node)

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setArrastrando(false)
    if (!esDelCuadro(e)) return
    cargar(e.dataTransfer.files[0])
  }
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled && esDelCuadro(e)) setArrastrando(true)
  }
  const onPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    if (!esDelCuadro(e)) return
    const archivo = Array.from(e.clipboardData.files).find(esImagen)
    if (!archivo) return
    e.preventDefault()
    cargar(archivo)
  }
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Enter / espacio en los botones (cambiar, quitar, visor) es de ellos
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      elegir()
    }
  }
  const onCambiarInput = (e: ChangeEvent<HTMLInputElement>) => {
    cargar(e.target.files?.[0])
    e.target.value = '' // para poder volver a elegir la misma imagen
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={vistaPrevia ? 'Cambiar imagen' : texto}
      aria-disabled={disabled}
      title={vistaPrevia ? 'Arrastra o pega para cambiar la imagen' : undefined}
      className={classNames(
        'position-relative overflow-hidden rounded-3 d-flex align-items-center justify-content-center flex-shrink-0',
        { 'opacity-50': disabled },
        className,
      )}
      style={{
        width: ancho,
        height: alto,
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: `${arrastrando ? 2 : 1.5}px ${vistaPrevia && !arrastrando ? 'solid' : 'dashed'} ${arrastrando ? 'var(--bs-primary)' : 'var(--bs-border-color)'}`,
        background: arrastrando ? 'var(--bs-primary-bg-subtle)' : vistaPrevia ? 'transparent' : 'var(--bs-tertiary-bg)',
      }}
      onClick={elegir}
      onKeyDown={onKeyDown}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={() => setArrastrando(false)}
      onPaste={onPaste}
    >
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onCambiarInput} />

      {vistaPrevia ? (
        <ImageCR src={vistaPrevia} alt="Vista previa" className="w-100 h-100" classNameContenedor="d-block w-100 h-100" style={{ objectFit: 'cover' }} />
      ) : (
        <>
          {/* Guía: imagen de ejemplo tenue detrás del texto; no recibe clicks */}
          {imageReferencia && (
            <img src={imageReferencia} alt="" aria-hidden className="position-absolute top-0 start-0 w-100 h-100 pe-none" style={{ objectFit: 'contain', opacity: 0.2 }} />
          )}
          <div className="position-relative d-flex flex-column align-items-center gap-2 text-center px-3 opacity-75 small">
            <IconCR name="subir" size={28} />
            <span>{texto}</span>
          </div>
        </>
      )}

      {/* Cambiar: abre el selector de archivos (el click en la foto la amplía) */}
      {vistaPrevia && !disabled && (
        <button
          type="button"
          className="btn btn-light btn-sm rounded-circle position-absolute z-2 top-0 start-0 m-2 d-flex align-items-center justify-content-center shadow-sm"
          style={{ width: 30, height: 30, padding: 0 }}
          title="Cambiar imagen"
          aria-label="Cambiar imagen"
          onClick={(e) => {
            e.stopPropagation()
            elegir()
          }}
        >
          <IconCR name="edit" size={14} />
        </button>
      )}

      {/* Quitar: no abre el selector de archivos */}
      {vistaPrevia && onQuitar && !disabled && (
        <button
          type="button"
          className="btn btn-light btn-sm rounded-circle position-absolute z-2 top-0 end-0 m-2 d-flex align-items-center justify-content-center shadow-sm"
          style={{ width: 30, height: 30, padding: 0 }}
          title="Quitar imagen"
          aria-label="Quitar imagen"
          onClick={(e) => {
            e.stopPropagation()
            onQuitar()
          }}
        >
          <IconCR name="times" size={14} />
        </button>
      )}
    </div>
  )
}
