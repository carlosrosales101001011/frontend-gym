import { useEffect, useState } from 'react'
import { alertaError } from '@/components/Alerta/alertas'
import { useBlobStorage, type BlobStorageProps } from '@/hook/useBlobStorage'
import { getBlobStorageUrl } from '@/helpers/blobUrl'
import { usePerfilNutricional } from './usePerfilNutricional'

/** Contenedor de Azure Blob Storage de las fotos del perfil nutricional (de perfil y de frente) */
const CONTENEDOR_FOTOS = 'clientesperfildefrente'

export type FotoPaciente = 'fotoPerfil' | 'fotoFrente'

/** Columna de perfil_nutricional con el uid_location de cada foto en blob_storage */
const CAMPO = { fotoPerfil: 'uid_image_fotoPerfil', fotoFrente: 'uid_image_fotoFrente' } as const

/**
 * Fotos de perfil y de frente de la fecha elegida, en Azure Blob Storage (contenedor clientesperfildefrente).
 * Cada foto se agrupa por un uid_location guardado en perfil_nutricional; se muestra la imagen vigente más reciente.
 */
export const useFotosPerfilNutricional = () => {
  const { registro, guardar } = usePerfilNutricional()
  const { post, getUltimoxUidLocation, delete: eliminar } = useBlobStorage()
  /** Imagen vigente de cada uid_location ya consultado (null = no tiene) */
  const [imagenes, setImagenes] = useState<Record<string, BlobStorageProps | null>>({})
  /** Archivo que se está subiendo en cada foto (se muestra mientras tanto) */
  const [subiendo, setSubiendo] = useState<Partial<Record<FotoPaciente, File>>>({})

  const uidPerfil = registro?.uid_image_fotoPerfil ?? null
  const uidFrente = registro?.uid_image_fotoFrente ?? null

  // Trae las imágenes de los uid que todavía no se consultaron
  useEffect(() => {
    let cancelado = false
    const pendientes = [uidPerfil, uidFrente].filter((uid): uid is string => !!uid && !(uid in imagenes))
    pendientes.forEach((uid) =>
      getUltimoxUidLocation(uid)
        .then((imagen) => !cancelado && setImagenes((actual) => ({ ...actual, [uid]: imagen })))
        .catch(() => !cancelado && setImagenes((actual) => ({ ...actual, [uid]: null }))),
    )
    return () => {
      cancelado = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uidPerfil, uidFrente])

  /** Lo que muestra el cuadro: el archivo que se está subiendo o la url de la imagen guardada */
  const imagen = (foto: FotoPaciente): File | string | null => {
    const uid = registro?.[CAMPO[foto]]
    return subiendo[foto] ?? (uid ? getBlobStorageUrl(imagenes[uid]) ?? null : null)
  }

  /** Sube la foto; si la fecha todavía no tenía uid para esa foto, lo crea y lo guarda en perfil_nutricional */
  const subir = async (foto: FotoPaciente, archivo: File) => {
    if (!registro) return
    const uidGuardado = registro[CAMPO[foto]]
    const uid = uidGuardado ?? crypto.randomUUID().toUpperCase()
    setSubiendo((actual) => ({ ...actual, [foto]: archivo }))
    try {
      const subida = await post({ archivo, uid_location: uid, contenedor: CONTENEDOR_FOTOS })
      setImagenes((actual) => ({ ...actual, [uid]: subida }))
      if (!uidGuardado) await guardar({ [CAMPO[foto]]: uid })
    } catch {
      alertaError()
    } finally {
      setSubiendo((actual) => ({ ...actual, [foto]: undefined }))
    }
  }

  /** Quita la foto: la da de baja en blob_storage y borra su uid de la fecha */
  const quitar = async (foto: FotoPaciente) => {
    const uid = registro?.[CAMPO[foto]]
    if (!uid) return
    const actual = imagenes[uid]
    await guardar({ [CAMPO[foto]]: null })
    if (actual) eliminar(actual.id).catch(() => alertaError())
  }

  return {
    imagen,
    subir,
    quitar,
    /** Sin fecha elegida o mientras sube, el cuadro queda deshabilitado */
    deshabilitada: (foto: FotoPaciente) => !registro || !!subiendo[foto],
  }
}
