import { format } from 'date-fns'

const formatoMoneda = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })

export const aNumero = (valor: unknown) => {
  const num = Number(valor)
  return Number.isFinite(num) ? num : 0
}

export const redondear2 = (valor: number) => Math.round(valor * 100) / 100

export const formatearMoneda = (valor: unknown) => formatoMoneda.format(aNumero(valor))

// "2026-09-22" o "2026-09-22T00:00:00.000Z" -> "yyyy-MM-dd" (sin desfase de zona horaria)
export const aFechaISO = (valor?: string | null) => (valor ? valor.slice(0, 10) : '')

export const formatearFecha = (valor?: string | null) => {
  const iso = aFechaISO(valor)
  return iso ? format(new Date(`${iso}T00:00:00`), 'dd/MM/yyyy') : ''
}

export const formatearFechaHora = (valor?: string | null) =>
  valor ? format(new Date(valor), 'dd/MM/yyyy hh:mm a') : ''

// Valor para <input type="datetime-local"> en hora local.
export const aFechaHoraLocal = (valor?: string | null) =>
  valor ? format(new Date(valor), "yyyy-MM-dd'T'HH:mm") : ''
