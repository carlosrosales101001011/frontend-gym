/**
 * Encuadre de una imagen dentro de un cuadrado (se guarda en blob_storage: x, y, zoom).
 * x / y: desplazamiento del centro de la imagen como fracción del lado del cuadrado; zoom: 1 = sin acercar.
 */
export type AjusteFoto = { x: number, y: number, zoom: number }

export const AJUSTE_CENTRADO: AjusteFoto = { x: 0, y: 0, zoom: 1 }

/** Encuadre del avatar guardado en la persona (avatar_x/y/zoom_ultimo); null si no tiene */
export const ajusteAvatarUltimo = (persona?: {
  avatar_x_ultimo?: number | null, avatar_y_ultimo?: number | null, avatar_zoom_ultimo?: number | null,
} | null): AjusteFoto | null =>
  persona && persona.avatar_x_ultimo != null && persona.avatar_y_ultimo != null && persona.avatar_zoom_ultimo != null
    ? { x: persona.avatar_x_ultimo, y: persona.avatar_y_ultimo, zoom: persona.avatar_zoom_ultimo }
    : null

export type TamanoImagen = { ancho: number, alto: number }

/**
 * Tamaño y posición de la imagen para mostrarla con un encuadre en un cuadrado de `lado` px.
 * Con zoom 1 la imagen cubre justo el cuadrado (como object-fit: cover).
 */
export const calcularEncuadre = (natural: TamanoImagen, lado: number, { x, y, zoom }: AjusteFoto) => {
  const escala = Math.max(lado / natural.ancho, lado / natural.alto) * zoom
  return {
    ancho: natural.ancho * escala,
    alto: natural.alto * escala,
    desplazamientoX: x * lado,
    desplazamientoY: y * lado,
  }
}
