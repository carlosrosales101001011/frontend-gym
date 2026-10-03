import { useState } from 'react'
import Swal from 'sweetalert2'
import { useBlobStorage, type BlobStorageProps } from '@/hook/useBlobStorage'
import { mensajeError } from '@/helpers/mensajeError'

/** Contenedor de Azure de los archivos de las personas */
export const CONTENEDOR_ARCHIVOS = 'perfilpersonaarchivo'

/** Archivo guardado (registro de blob_storage con su fecha de subida) */
export type ArchivoProps = BlobStorageProps & { createdAt?: string }

/**
 * Archivos de un uid_location (ej. el uid_archivos de una persona) en el Azure Blob Storage:
 * listar, subir y dar de baja. Si algo falla, avisa con el motivo.
 */
export const useArchivos = (uid_location: string) => {
  const blobStorage = useBlobStorage()
  const [archivos, setArchivos] = useState<ArchivoProps[]>([])
  const [cargando, setCargando] = useState(true)
  const [subiendo, setSubiendo] = useState(0)

  const obtenerArchivos = async () => {
    try {
      setArchivos(await blobStorage.getxUidLocation(uid_location) as ArchivoProps[])
    } catch (error) {
      console.log(error)
    } finally {
      setCargando(false)
    }
  }

  /** Sube los archivos uno por uno (muestra cuántos faltan) y refresca la lista */
  const subirArchivos = async (lista: File[]) => {
    const fallidos: string[] = []
    setSubiendo(lista.length)
    for (const archivo of lista) {
      try {
        await blobStorage.post({ archivo, uid_location, contenedor: CONTENEDOR_ARCHIVOS })
      } catch (error) {
        fallidos.push(`${archivo.name}: ${mensajeError(error)}`)
      } finally {
        setSubiendo((faltan) => faltan - 1)
      }
    }
    await obtenerArchivos()
    if (fallidos.length) await Swal.fire({ icon: 'error', title: 'No se pudieron subir algunos archivos', html: fallidos.join('<br/>') })
  }

  /** Pide confirmación y da de baja el archivo (sigue en Azure, pero ya no se lista) */
  const eliminarArchivo = async (id: number, nombre: string) => {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar el archivo?',
      text: nombre,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    })
    if (!isConfirmed) return
    try {
      await blobStorage.delete(id)
      await obtenerArchivos()
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'No se pudo eliminar el archivo', html: mensajeError(error) })
    }
  }

  return { archivos, cargando, subiendo, obtenerArchivos, subirArchivos, eliminarArchivo }
}
