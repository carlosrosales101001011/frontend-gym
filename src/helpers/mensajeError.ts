/**
 * Texto para mostrar un error de httpClient en Swal: el backend (class-validator) puede devolver
 * varios mensajes en un arreglo; se muestran uno por línea (usar con `html`).
 */
export const mensajeError = (error: unknown) =>
  Array.isArray(error) ? error.join('<br/>') : String(error)
