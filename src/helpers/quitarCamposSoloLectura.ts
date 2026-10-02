/**
 * Campos de la persona que manda el backend pero no están en su DTO: los de la foto (los maneja él al
 * subir, ajustar o quitar la foto) y uid_comentario (lo crea al registrar la persona).
 * Reenviarlos en un PATCH/POST de persona da 400 (forbidNonWhitelisted).
 */
export const CAMPOS_PERSONA_SOLO_LECTURA = [
  'url_avatar',
  'url_avatar_ultimo',
  'avatar_x_ultimo',
  'avatar_y_ultimo',
  'avatar_zoom_ultimo',
  'avatar',
  'uid_comentario',
] as const

type CampoSoloLectura = typeof CAMPOS_PERSONA_SOLO_LECTURA[number]

/** Copia de la persona sin los campos que no se pueden enviar al backend */
export const quitarCamposSoloLectura = <T extends object>(persona: T): Omit<T, CampoSoloLectura> =>
  Object.fromEntries(
    Object.entries(persona).filter(([key]) => !(CAMPOS_PERSONA_SOLO_LECTURA as readonly string[]).includes(key))
  ) as Omit<T, CampoSoloLectura>
