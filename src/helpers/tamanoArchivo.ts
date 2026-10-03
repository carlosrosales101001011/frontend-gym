/** Tamaño legible de un archivo: 512 B, 34.5 KB, 2.1 MB */
export const tamanoArchivo = (bytes: number | string) => {
  const valor = Number(bytes) || 0
  if (valor < 1024) return `${valor} B`
  if (valor < 1024 * 1024) return `${(valor / 1024).toFixed(1)} KB`
  return `${(valor / (1024 * 1024)).toFixed(1)} MB`
}
