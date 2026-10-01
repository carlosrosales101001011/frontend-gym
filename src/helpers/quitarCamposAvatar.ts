/**
 * Campos de la foto de la persona que manda el backend pero no están en su DTO (los maneja él al subir,
 * ajustar o quitar la foto). Reenviarlos en un PATCH/POST de persona da 400 (forbidNonWhitelisted).
 */
export const CAMPOS_AVATAR_SOLO_LECTURA = [
  'url_avatar',
  'url_avatar_ultimo',
  'avatar_x_ultimo',
  'avatar_y_ultimo',
  'avatar_zoom_ultimo',
  'avatar',
] as const

type CampoAvatar = typeof CAMPOS_AVATAR_SOLO_LECTURA[number]

/** Copia de la persona sin los campos de la foto que no se pueden enviar al backend */
export const quitarCamposAvatar = <T extends object>(persona: T): Omit<T, CampoAvatar> =>
  Object.fromEntries(
    Object.entries(persona).filter(([key]) => !(CAMPOS_AVATAR_SOLO_LECTURA as readonly string[]).includes(key))
  ) as Omit<T, CampoAvatar>
