import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import Swal from 'sweetalert2'
import IconCR from '@/components/Icons/IconCR'
import { ImageCR } from '@/components/ImageCR/ImageCR'
import { getBlobStorageUrl } from '@/helpers/blobUrl'
import { formatDate } from '@/helpers/FormatDate'
import { tamanoArchivo } from '@/helpers/tamanoArchivo'
import { EXTENSIONES_PERMITIDAS, errorArchivo, estiloTipo, nombreOriginal, tipoArchivo } from './tipoArchivo'
import { useArchivos, type ArchivoProps } from './useArchivos'

type AppArchivosProps = {
  /** A quién pertenecen los archivos (ej. el uid_archivos de una persona) */
  uid_location: string
}

/**
 * Archivos de una persona en tarjetas: una tarjeta para subir (click o arrastrar) y una por archivo
 * con su ícono (o miniatura si es imagen), nombre, tamaño, fecha, descargar y eliminar.
 * Se guardan en el Azure Blob Storage (contenedor perfilpersonaarchivo). Estilos en _Archivos.scss.
 */
export const AppArchivos = ({ uid_location }: AppArchivosProps) => {
  const { archivos, cargando, subiendo, obtenerArchivos, subirArchivos, eliminarArchivo } = useArchivos(uid_location)
  const inputRef = useRef<HTMLInputElement>(null)
  const [arrastrando, setArrastrando] = useState(false)

  useEffect(() => {
    obtenerArchivos()
  }, [uid_location])

  /** Valida tipo y tamaño; sube los válidos y avisa de los que no */
  const recibirArchivos = async (lista: File[]) => {
    if (!lista.length) return
    const errores = lista.map(errorArchivo).filter(Boolean)
    const validos = lista.filter((archivo) => !errorArchivo(archivo))
    if (errores.length) await Swal.fire({ icon: 'warning', title: 'Algunos archivos no se pueden subir', html: errores.join('<br/>') })
    if (validos.length) await subirArchivos(validos)
  }

  const onElegir = (e: ChangeEvent<HTMLInputElement>) => {
    recibirArchivos(Array.from(e.target.files ?? []))
    e.target.value = '' // permite volver a elegir el mismo archivo
  }

  const onSoltar = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setArrastrando(false)
    recibirArchivos(Array.from(e.dataTransfer.files))
  }

  return (
    <div className="archivos-cr">
      <button
        type="button"
        className={`archivos-cr__subir ${arrastrando ? 'archivos-cr__subir--arrastrando' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setArrastrando(true) }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={onSoltar}
        disabled={subiendo > 0}
      >
        <IconCR name="subir" size={28} className="" />
        <span className="archivos-cr__subir-titulo">
          {subiendo > 0 ? `Subiendo ${subiendo} archivo${subiendo > 1 ? 's' : ''}...` : 'Subir archivos'}
        </span>
        <span className="archivos-cr__subir-detalle">Haz click o arrastra aquí · Imágenes, PDF, Word o Excel · Máx. 10 MB</span>
      </button>
      <input ref={inputRef} type="file" multiple accept={EXTENSIONES_PERMITIDAS} hidden onChange={onElegir} />

      {cargando ? (
        Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="archivos-cr__card" aria-hidden="true">
            <span className="skeleton-cr" style={{ width: 44, height: 44 }} />
            <span className="skeleton-cr mt-3" style={{ width: '70%', height: 12 }} />
            <span className="skeleton-cr mt-2" style={{ width: '45%', height: 10 }} />
          </div>
        ))
      ) : (
        archivos.map((archivo) => <CardArchivo key={archivo.id} archivo={archivo} onEliminar={eliminarArchivo} />)
      )}
    </div>
  )
}

type CardArchivoProps = {
  archivo: ArchivoProps
  onEliminar: (id: number, nombre: string) => void
}

/** Tarjeta de un archivo: miniatura (imágenes) o ícono por tipo, nombre, tamaño, fecha y acciones */
const CardArchivo = ({ archivo, onEliminar }: CardArchivoProps) => {
  const tipo = tipoArchivo(archivo.extension)
  const { icono, color } = estiloTipo(tipo)
  const nombre = nombreOriginal(archivo.name_image, archivo.extension)
  const url = getBlobStorageUrl(archivo)

  return (
    <div className="archivos-cr__card">
      <div className="archivos-cr__vista">
        {tipo === 'imagen' && url
          ? <ImageCR src={url} alt={nombre} className="archivos-cr__miniatura" classNameContenedor="d-block w-100 h-100" />
          : <span className="archivos-cr__icono" style={{ color, backgroundColor: `${color}1f` }}><IconCR name={icono} size={26} className="" /></span>}
      </div>
      <div className="archivos-cr__nombre" title={nombre}>{nombre}</div>
      <div className="archivos-cr__meta">
        {tamanoArchivo(archivo.size)}
        {archivo.createdAt && ` · ${formatDate(new Date(archivo.createdAt), 'yyyy-mm-dd', 'dd/mm/yyyy')}`}
      </div>
      <div className="archivos-cr__acciones">
        <a className="archivos-cr__accion" href={url} target="_blank" rel="noreferrer" download={nombre} title="Descargar">
          <IconCR name="descargar" size={16} className="" /> Descargar
        </a>
        <button type="button" className="archivos-cr__accion archivos-cr__accion--eliminar" onClick={() => onEliminar(archivo.id, nombre)} title="Eliminar">
          <IconCR name="trash" size={13} className="" />
        </button>
      </div>
    </div>
  )
}
