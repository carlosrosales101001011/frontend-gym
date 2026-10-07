import { capitalizeWords } from './strings'

/**
 * Campos de las respuestas del backend que se muestran con capitalizeWords ("Juan Pérez"):
 * nombres de personas y usuarios, direcciones y nombres de catálogo. No entran emails, usuario (login),
 * códigos ni name_image (nombre real del archivo en el storage).
 */
const CAMPOS_NOMBRE = new Set([
  'nombres', 'apellidos', 'apellido_paterno', 'apellido_materno',
  'nombre', 'nombre_comercial', 'nombre_articulo', 'razon_social',
  'direccion', 'direccion_fiscal',
  'label_sucursal', 'label_programa', 'label_plan', 'label_producto', 'label_proveedor',
])
/** label_nombres_apellidos_cli, _empl, _persona, _userParent... */
const PREFIJO_LABEL_NOMBRES = 'label_nombres_apellidos'

const esCampoNombre = (campo: string) => CAMPOS_NOMBRE.has(campo) || campo.startsWith(PREFIJO_LABEL_NOMBRES)

const esObjetoPlano = (valor: unknown): valor is Record<string, unknown> =>
  typeof valor === 'object' && valor !== null && Object.getPrototypeOf(valor) === Object.prototype

/**
 * Devuelve la data con los campos de nombre en formato "Nombre Apellido" (recorre objetos y arreglos anidados).
 * Solo cambia textos; lo demás (números, fechas, archivos) queda igual.
 */
export const formatearNombres = <T,>(data: T): T => {
  if (Array.isArray(data)) return data.map(formatearNombres) as T
  if (!esObjetoPlano(data)) return data
  return Object.fromEntries(
    Object.entries(data).map(([campo, valor]) => [
      campo,
      typeof valor === 'string' && esCampoNombre(campo) ? capitalizeWords(valor) : formatearNombres(valor),
    ]),
  ) as T
}
