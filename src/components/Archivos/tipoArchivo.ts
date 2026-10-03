import type { IconName } from '@/components/Icons/IconCR'

/** Tipos de archivo permitidos (por extensión): imágenes, PDF, Word y Excel */
const TIPOS = {
  imagen: { extensiones: ['.jpg', '.jpeg', '.png', '.gif', '.webp'], icono: 'archivoImagen', color: '#0d6efd' },
  pdf: { extensiones: ['.pdf'], icono: 'archivoPdf', color: '#dc3545' },
  word: { extensiones: ['.doc', '.docx'], icono: 'archivoWord', color: '#2b579a' },
  excel: { extensiones: ['.xls', '.xlsx'], icono: 'archivoExcel', color: '#198754' },
} as const satisfies Record<string, { extensiones: readonly string[], icono: IconName, color: string }>

export type TipoArchivo = keyof typeof TIPOS | 'otro'

/** Tamaño máximo por archivo (10 MB) */
export const TAMANO_MAXIMO_ARCHIVO = 10 * 1024 * 1024

/** Para el <input type="file" accept>: todas las extensiones permitidas */
export const EXTENSIONES_PERMITIDAS = Object.values(TIPOS).flatMap((tipo) => tipo.extensiones).join(',')

/** ".pdf" de "contrato.final.PDF" ('' si no tiene) */
export const extensionDe = (nombre: string) => nombre.includes('.') ? `.${nombre.split('.').pop()!.toLowerCase()}` : ''

export const tipoArchivo = (extension: string): TipoArchivo => {
  const ext = extension.toLowerCase()
  const encontrado = Object.entries(TIPOS).find(([, tipo]) => (tipo.extensiones as readonly string[]).includes(ext))
  return (encontrado?.[0] as TipoArchivo) ?? 'otro'
}

/** Ícono y color de un tipo de archivo */
export const estiloTipo = (tipo: TipoArchivo): { icono: IconName, color: string } =>
  tipo === 'otro' ? { icono: 'archivo', color: '#6c757d' } : TIPOS[tipo]

/**
 * Nombre original del archivo: el backend guarda "nombre-<marca de tiempo>.ext" (name_image).
 * Ej. "contrato-1790784210225.pdf" → "contrato.pdf"
 */
export const nombreOriginal = (nameImage: string, extension: string) =>
  `${nameImage.slice(0, nameImage.length - extension.length).replace(/-\d{13}$/, '')}${extension}`

/** Motivo por el que no se puede subir un archivo ('' si se puede) */
export const errorArchivo = (archivo: File) => {
  if (tipoArchivo(extensionDe(archivo.name)) === 'otro') return `"${archivo.name}": solo se permiten imágenes, PDF, Word y Excel`
  if (archivo.size > TAMANO_MAXIMO_ARCHIVO) return `"${archivo.name}": supera los 10 MB`
  return ''
}
