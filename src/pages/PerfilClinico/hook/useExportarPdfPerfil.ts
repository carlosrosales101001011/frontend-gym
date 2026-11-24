import { useState } from 'react'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import type { RootState } from '@/stores/Store'
import { getBlobStorageUrl } from '@/helpers/blobUrl'
import { mensajeError } from '@/helpers/mensajeError'
import { useBlobStorage } from '@/hook/useBlobStorage'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import type { OpcionesSelect } from '@/types/props'
import { idsDeTexto, usePerfilNutricional } from './usePerfilNutricional'

/** Lado máximo (px) de las fotos en el PDF: se reducen para que el archivo no pese de más */
const LADO_MAX_FOTO = 900

/** Imagen como JPEG (data url): el PDF no acepta webp. null si no se pudo cargar */
const imagenJpeg = async (url: string) => {
  try {
    const respuesta = await fetch(url, { cache: 'no-store' })
    if (!respuesta.ok) return null
    const imagen = await createImageBitmap(await respuesta.blob())
    const escala = Math.min(1, LADO_MAX_FOTO / Math.max(imagen.width, imagen.height))
    const lienzo = document.createElement('canvas')
    lienzo.width = Math.round(imagen.width * escala)
    lienzo.height = Math.round(imagen.height * escala)
    const contexto = lienzo.getContext('2d')
    if (!contexto) return null
    // Las transparencias (png) quedarían negras en JPEG
    contexto.fillStyle = '#fff'
    contexto.fillRect(0, 0, lienzo.width, lienzo.height)
    contexto.drawImage(imagen, 0, 0, lienzo.width, lienzo.height)
    return lienzo.toDataURL('image/jpeg', 0.85)
  } catch {
    return null
  }
}

/** Textos de los ids marcados, en el orden en que se registraron, y lo escrito en "¿Cuáles?" */
const textoMarcados = (opciones: OpcionesSelect[] | undefined, ids: string | null, cuales: string | null) => {
  const marcados = idsDeTexto(ids)
  const textos = (opciones ?? []).filter((o) => marcados.includes(o.value)).sort((a, b) => a.value - b.value).map((o) => o.label)
  return textos.join(', ') + (cuales ? ` (${cuales})` : '')
}

/** Descarga en PDF el perfil nutricional de la fecha elegida (FormatoPdf/PdfPerfilNutricional) */
export const useExportarPdfPerfil = () => {
  const { colaborador: paciente } = useSelector((state: RootState) => state.PERFIL_COLABORADOR)
  const { registro, registros } = usePerfilNutricional()
  const { getUltimoxUidLocation } = useBlobStorage()
  const { cargar: cargarGeneros } = useTerminologiaPersona('GeneroPersona')
  const { cargar: cargarObjetivos } = useTerminologiaPersona('objetivosPrincipales')
  const { cargar: cargarPersonales } = useTerminologiaPersona('antecedentesPersonales')
  const { cargar: cargarFamiliares } = useTerminologiaPersona('antecedentesFamiliares')
  const { cargar: cargarLesiones } = useTerminologiaPersona('lesionesPaciente')
  const { cargar: cargarAlergias } = useTerminologiaPersona('alergiasIntoleranciasPaciente')
  const [exportando, setExportando] = useState(false)

  const cargarFoto = async (uid: string | null) => {
    if (!uid) return null
    const url = getBlobStorageUrl(await getUltimoxUidLocation(uid).catch(() => null))
    return url ? imagenJpeg(url) : null
  }

  const exportarPdf = async () => {
    if (!registro || exportando) return
    setExportando(true)
    try {
      // La librería pesa: se descarga recién al exportar
      const [{ pdf }, { PdfPerfilNutricional }, generos, objetivos, personales, familiares, lesiones, alergias, perfil, frente] = await Promise.all([
        import('@react-pdf/renderer'),
        import('../FormatoPdf/PdfPerfilNutricional'),
        cargarGeneros(),
        cargarObjetivos(),
        cargarPersonales(),
        cargarFamiliares(),
        cargarLesiones(),
        cargarAlergias(),
        cargarFoto(registro.uid_image_fotoPerfil),
        cargarFoto(registro.uid_image_fotoFrente),
      ])
      // cargar() devuelve undefined si falló: sin las listas saldrían vacíos datos que sí están marcados
      if ([generos, objetivos, personales, familiares, lesiones, alergias].some((lista) => !lista)) {
        throw 'No se pudieron cargar las listas del perfil.'
      }
      const documento = PdfPerfilNutricional({
        paciente,
        registro,
        registros,
        sexo: (generos as OpcionesSelect[]).find((g) => g.value === Number(paciente.id_genero))?.label,
        fotos: { perfil, frente },
        marcados: {
          objetivos: textoMarcados(objetivos, registro.objetivo_principal, registro.objetivo_principal_cuales),
          personales: textoMarcados(personales, registro.antecedentes_personales, registro.antecedentes_personales_cuales),
          familiares: textoMarcados(familiares, registro.antecedentes_familiares, registro.antecedentes_familiares_cuales),
          lesiones: textoMarcados(lesiones, registro.lesiones, registro.lesiones_cuales),
          alergias: textoMarcados(alergias, registro.alergias, registro.alergias_cuales),
        },
      })
      const url = URL.createObjectURL(await pdf(documento).toBlob())
      const enlace = document.createElement('a')
      enlace.href = url
      enlace.download = `perfil-nutricional-${paciente.nombres} ${paciente.apellido_paterno}-${registro.fecha.slice(0, 10)}.pdf`
      enlace.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      await Swal.fire({ icon: 'error', title: 'No se pudo exportar el PDF', html: mensajeError(e) })
    } finally {
      setExportando(false)
    }
  }

  return { exportarPdf, exportando }
}
