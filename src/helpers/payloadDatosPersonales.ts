/** Campos del formulario "Datos personales" que se envían (el backend rechaza los label_*, fecha_registro, etc.) */
const CAMPOS_EDITABLES = [
  'nombres', 'apellido_paterno', 'apellido_materno', 'fecha_nacimiento', 'telefono', 'numero_documento',
  'direccion', 'email_personal', 'email_corporativo',
  'id_genero', 'id_estado_civil', 'id_tipo_documento', 'id_nacionalidad', 'id_distrito',
] as const

/** Los selects devuelven texto ("3"): el backend los pide como número */
const CAMPOS_NUMERICOS: readonly string[] = ['id_genero', 'id_estado_civil', 'id_tipo_documento', 'id_nacionalidad', 'id_distrito']

/** Solo los campos editables de una persona; los ids como número (un select vacío no se envía) */
export const payloadDatosPersonales = (datos: Record<string, unknown>) =>
  Object.fromEntries(
    CAMPOS_EDITABLES
      .filter((campo) => datos[campo] !== undefined)
      .filter((campo) => !CAMPOS_NUMERICOS.includes(campo) || (datos[campo] !== '' && datos[campo] !== null))
      .map((campo) => [campo, CAMPOS_NUMERICOS.includes(campo) ? Number(datos[campo]) : datos[campo]])
  )
