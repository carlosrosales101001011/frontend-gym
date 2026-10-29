import { differenceInYears, parseISO } from 'date-fns'
import { diasVencidos } from '@/helpers/diasMembresia'
import { sumBy } from '@/helpers/reports'
import type { OpcionesSelect } from '@/types/props'
import type { ItemBarra } from '@/components/ReporteBarras/barrasComparacion'
import type { ClienteActivoProps } from '../hook/useClientesActivos'

/** Días que faltan para el vencimiento (1 = vence mañana) */
export const diasPorVencer = (cliente: ClienteActivoProps) => -diasVencidos(cliente.fecha_vencimiento)

/** Activos que vencen dentro de los próximos `dias` días */
export const porVencerEn = (clientes: ClienteActivoProps[], dias: number) =>
  clientes.filter((cliente) => diasPorVencer(cliente) <= dias)

/** Lo vendido en membresías a esos clientes (su venta activa), redondeado a céntimos */
export const montoClientes = (clientes: ClienteActivoProps[]) =>
  Math.round(sumBy(clientes, (cliente) => cliente.monto_membresia) * 100) / 100

/** Barra de un grupo de clientes: monto (lo vendido en sus membresías) y cantidad de clientes */
const itemBarra = (id: number, nombre: string, clientes: ClienteActivoProps[]): ItemBarra =>
  ({ id, nombre, monto: montoClientes(clientes), cantidad: clientes.length })

/** Tramo de un valor numérico (edad, días por vencer): `hasta` incluido; empieza donde terminó el anterior */
type Tramo = { label: string, hasta: number }

/** Label del tramo donde cae `valor` (null: `sinValor`) */
const tramoDe = (tramos: Tramo[], valor: number | null, sinValor: string) =>
  valor === null ? sinValor : (tramos.find((tramo) => valor <= tramo.hasta)?.label ?? sinValor)

const TRAMOS_EDAD: Tramo[] = [
  { label: 'Menos de 18', hasta: 17 },
  { label: '18 a 25', hasta: 25 },
  { label: '26 a 35', hasta: 35 },
  { label: '36 a 45', hasta: 45 },
  { label: '46 a 55', hasta: 55 },
  { label: 'Más de 55', hasta: Infinity },
]

const TRAMOS_VENCIMIENTO: Tramo[] = [
  { label: '1 a 7 días', hasta: 7 },
  { label: '8 a 15 días', hasta: 15 },
  { label: '16 a 30 días', hasta: 30 },
  { label: '31 a 60 días', hasta: 60 },
  { label: '61 a 90 días', hasta: 90 },
  { label: 'Más de 90 días', hasta: Infinity },
]

/** Edad cumplida hoy; null sin fecha de nacimiento (o con una fecha futura) */
const edad = (cliente: ClienteActivoProps) => {
  if (!cliente.fecha_nacimiento) return null
  const anios = differenceInYears(new Date(), parseISO(cliente.fecha_nacimiento))
  return anios >= 0 ? anios : null
}

/** Texto de un dato del cliente, o `sinValor` si está vacío */
const textoO = (texto: string | null | undefined, sinValor: string) => texto?.trim() || sinValor

/** Por qué se agrupan (y filtran) los clientes en los gráficos del reporte */
export type DimensionCliente = 'programa' | 'asesor' | 'vencimiento' | 'genero' | 'edad' | 'estadoCivil' | 'distrito'

type Dimension = {
  /** Nombre en el badge del filtro ("Distrito: Rimac") y en la primera columna de la tabla */
  nombre: string
  /** Grupo del cliente (mismo texto que la barra y que el valor del filtro) */
  grupo: (cliente: ClienteActivoProps) => string
  /** Tramos: las barras van en este orden y todas, aunque tengan 0 */
  tramos?: Tramo[]
}

export const DIMENSIONES: Record<DimensionCliente, Dimension> = {
  programa: { nombre: 'Programa', grupo: (cliente) => textoO(cliente.label_programa, 'Por definir') },
  asesor: { nombre: 'Asesor', grupo: (cliente) => textoO(cliente.label_nombres_apellidos_empl, 'Sin asesor') },
  vencimiento: {
    nombre: 'Vencimiento',
    grupo: (cliente) => tramoDe(TRAMOS_VENCIMIENTO, diasPorVencer(cliente), 'Sin vencimiento'),
    tramos: TRAMOS_VENCIMIENTO,
  },
  genero: { nombre: 'Género', grupo: (cliente) => textoO(cliente.label_genero, 'Sin género') },
  edad: { nombre: 'Edad', grupo: (cliente) => tramoDe(TRAMOS_EDAD, edad(cliente), 'Sin fecha de nacimiento'), tramos: TRAMOS_EDAD },
  estadoCivil: { nombre: 'Estado civil', grupo: (cliente) => textoO(cliente.label_estado_civil, 'Sin estado civil') },
  distrito: { nombre: 'Distrito', grupo: (cliente) => textoO(cliente.label_distrito, 'Sin distrito') },
}

/** Filtros elegidos haciendo click en las tablas: un grupo por dimensión */
export type FiltrosClientes = Partial<Record<DimensionCliente, string>>

/** Clientes que cumplen todos los filtros, menos el de `excepto` (la card de esa dimensión compara todos sus grupos) */
export const filtrarClientes = (clientes: ClienteActivoProps[], filtros: FiltrosClientes, excepto?: DimensionCliente) => {
  const activos = (Object.entries(filtros) as [DimensionCliente, string][]).filter(([dimension]) => dimension !== excepto)
  return clientes.filter((cliente) => activos.every(([dimension, grupo]) => DIMENSIONES[dimension].grupo(cliente) === grupo))
}

/**
 * Barras de una dimensión: una por grupo (id 1, 2, ...). Con tramos, primero todos los tramos en su orden
 * (aunque tengan 0) y luego el grupo "sin dato" si hay; el gráfico mantiene ese orden por id.
 */
export const agruparClientes = (clientes: ClienteActivoProps[], dimension: DimensionCliente): ItemBarra[] => {
  const { grupo, tramos } = DIMENSIONES[dimension]
  const grupos = new Map<string, ClienteActivoProps[]>((tramos ?? []).map((tramo) => [tramo.label, []]))
  for (const cliente of clientes) {
    const label = grupo(cliente)
    grupos.set(label, [...(grupos.get(label) ?? []), cliente])
  }
  return [...grupos].map(([label, lista], i) => itemBarra(i + 1, label, lista))
}

/** Activos por tipo de cliente de su venta: cada tipo de la terminología (aunque tenga 0) y "Sin tipo" si hay */
export const clientesPorTipo = (tipos: OpcionesSelect[], clientes: ClienteActivoProps[]): ItemBarra[] => {
  const porTipo = tipos.map((tipo) => itemBarra(tipo.value, tipo.label, clientes.filter((cliente) => cliente.id_tipo_cli === tipo.value)))
  const idsTipos = new Set(tipos.map((tipo) => tipo.value))
  const sinTipo = clientes.filter((cliente) => !cliente.id_tipo_cli || !idsTipos.has(cliente.id_tipo_cli))
  return sinTipo.length ? [...porTipo, itemBarra(0, 'Sin tipo', sinTipo)] : porTipo
}
