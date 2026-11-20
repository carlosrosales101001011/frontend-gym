import type { ChangeEvent } from 'react'
import httpClient from '@/common/helpers/httpClient'
import { alertaError } from '@/components/Alerta/alertas'
import {
  usePerfilNutricionalStore,
  type CambiosPerfil,
  type CampoPerfil,
  type Decimal,
  type PerfilNutricional,
} from './usePerfilNutricionalStore'

/** Campos con número decimal (kg, cm, L, horas…) */
type CampoDecimal = { [K in CampoPerfil]: Decimal extends PerfilNutricional[K] ? K : never }[CampoPerfil]
/** Campos de texto libre */
type CampoTexto = { [K in CampoPerfil]: PerfilNutricional[K] extends string | null ? K : never }[CampoPerfil]

/** Ids de terminología guardados como "6147,6150" */
export const idsDeTexto = (texto?: string | null) => (texto ? texto.split(',').map(Number).filter(Boolean) : [])
export const textoDeIds = (ids: number[]) => (ids.length ? ids.join(',') : null)

/** Texto escrito → número (acepta coma decimal); null si está vacío; undefined si no es un número (no se guarda) */
const aDecimal = (texto: string) => {
  if (!texto.trim()) return null
  const numero = Number(texto.trim().replace(',', '.'))
  return Number.isFinite(numero) ? numero : undefined
}
/** Texto escrito → null si quedó vacío */
const aTexto = (texto: string) => texto.trim() || null

const estado = () => usePerfilNutricionalStore.getState()
const registroSeleccionado = () => {
  const { registros, idSeleccionado } = estado()
  return registros.find((r) => r.id === idSeleccionado) ?? null
}

/**
 * Perfil nutricional del paciente por fechas: cada fecha es un registro de perfil_nutricional.
 * Los cambios se guardan solos: las casillas y listas al cambiar; lo escrito al salir del campo.
 */
export const usePerfilNutricional = () => {
  const registros = usePerfilNutricionalStore((s) => s.registros)
  const idSeleccionado = usePerfilNutricionalStore((s) => s.idSeleccionado)
  const borrador = usePerfilNutricionalStore((s) => s.borrador)
  const cargando = usePerfilNutricionalStore((s) => s.cargando)
  const registro = registros.find((r) => r.id === idSeleccionado) ?? null

  /** Valor a mostrar: lo que se está escribiendo o lo guardado */
  const valor = <K extends CampoPerfil>(campo: K): PerfilNutricional[K] | undefined =>
    campo in borrador ? (borrador[campo] as PerfilNutricional[K]) : registro?.[campo]

  /** Trae las fechas del paciente y elige la más reciente (o la indicada) */
  const cargar = async (id_cli: number, idElegir?: number) => {
    estado().setCargando(true)
    try {
      const { data } = await httpClient.get(`/perfil-nutricional/cliente/${id_cli}`)
      const lista = data as PerfilNutricional[]
      estado().setRegistros(lista, idElegir ?? lista.at(-1)?.id ?? null)
    } catch {
      estado().setRegistros([], null)
      alertaError()
    } finally {
      estado().setCargando(false)
    }
  }

  /** Agrega una fecha con su nombre de perfil y la elige. Devuelve true si se guardó */
  const agregarFecha = async (id_cli: number, nueva: { fecha: string, nombrePerfil: string }) => {
    try {
      const { data } = await httpClient.post('/perfil-nutricional', { id_cli, ...nueva })
      await cargar(id_cli, (data as PerfilNutricional).id)
      return true
    } catch {
      alertaError()
      return false
    }
  }

  /** Guarda en la fecha elegida (se ve al instante; si falla, vuelve a lo anterior y avisa) */
  const guardar = async (cambios: CambiosPerfil) => {
    const anterior = registroSeleccionado()
    if (!anterior) return
    estado().actualizarRegistro({ ...anterior, ...cambios })
    estado().quitarDelBorrador(Object.keys(cambios) as CampoPerfil[])
    try {
      const { data } = await httpClient.patch(`/perfil-nutricional/${anterior.id}`, cambios)
      estado().actualizarRegistro(data as PerfilNutricional)
    } catch {
      estado().actualizarRegistro(anterior)
      alertaError()
    }
  }

  /** Al salir de un campo escrito: guarda si cambió; si no es válido, vuelve a lo guardado */
  const confirmar = <K extends CampoPerfil>(campo: K, convertir: (texto: string) => PerfilNutricional[K] | undefined) => {
    const { borrador: actual } = estado()
    if (!(campo in actual)) return
    const nuevo = convertir(String(actual[campo] ?? ''))
    const guardado = registroSeleccionado()?.[campo]
    if (nuevo === undefined || String(nuevo ?? '') === String(guardado ?? '')) {
      estado().quitarDelBorrador([campo])
      return
    }
    guardar({ [campo]: nuevo } as CambiosPerfil)
  }

  const escribir = (campo: CampoPerfil) => (e: ChangeEvent<HTMLInputElement>) =>
    estado().setBorrador({ [campo]: e.target.value } as CambiosPerfil)

  /** Props de un InputCR con número decimal */
  const propsDecimal = (campo: CampoDecimal) => ({
    value: String(valor(campo) ?? ''),
    inputMode: 'decimal' as const,
    disabled: !registro,
    onChange: escribir(campo),
    onBlur: () => confirmar(campo, aDecimal),
  })

  /** Props de un InputCR de texto (o text-area) */
  const propsTexto = (campo: CampoTexto) => ({
    value: String(valor(campo) ?? ''),
    disabled: !registro,
    onChange: escribir(campo),
    onBlur: () => confirmar(campo, aTexto),
  })

  return {
    registros,
    registro,
    cargando,
    seleccionar: estado().seleccionar,
    cargar,
    agregarFecha,
    guardar,
    valor,
    propsDecimal,
    propsTexto,
  }
}
