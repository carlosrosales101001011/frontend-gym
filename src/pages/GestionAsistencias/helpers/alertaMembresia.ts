import { parseISO } from 'date-fns'
import type { SweetAlertOptions } from 'sweetalert2'
import { formatDate } from '@/helpers/FormatDate'
import { getFormatMoney } from '@/helpers/getFormatMoney'
import { diasVencidos } from '@/helpers/diasMembresia'
import type { MembresiaActualProps } from '../hook/useMembresiaActual'

/** Colores fuertes de la alerta (fondo) */
const VERDE = '#146c43'
const ROJO = '#b02a37'
/** Cuánto se ve la alerta después de registrar la asistencia */
export const DURACION_ALERTA_MS = 3000

/** Texto de la base dentro del html de la alerta, sin que se interprete como html */
const escapar = (texto: string) =>
  texto.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))

const fecha = (valor?: string | null) => valor ? formatDate(parseISO(valor), 'yyyy-mm-dd', 'd MMMM yyyy') : '—'

const fila = (etiqueta: string, valor: string) =>
  `<div style="display:flex;justify-content:space-between;gap:16px;padding:3px 0"><span style="opacity:.8">${etiqueta}</span><strong>${valor}</strong></div>`

/** Días de calendario que le quedan hasta el vencimiento (negativo si ya venció) */
const diasQueQuedan = (membresia: MembresiaActualProps) => -diasVencidos(membresia.fecha_vencimiento)

/** Un cliente puede asistir solo con una membresía vigente (no vencida); la deuda no lo impide */
export const membresiaVigente = (membresia: MembresiaActualProps | null) => !!membresia && diasQueQuedan(membresia) >= 0

/**
 * Alerta de la membresía del cliente al registrar su asistencia:
 * - Sin membresía vigente (no tiene o está vencida): rojo fuerte, "No asiste…" (la asistencia NO se registra).
 * - Vigente y pagada: verde fuerte (inicio, fin y días que le quedan).
 * - Vigente con deuda: rojo fuerte avisando lo que falta pagar.
 */
export const alertaMembresia = (nombre: string, membresia: MembresiaActualProps | null): SweetAlertOptions => {
  const base: SweetAlertOptions = {
    color: '#fff',
    iconColor: '#fff',
    timer: DURACION_ALERTA_MS,
    timerProgressBar: true,
    showConfirmButton: false,
    // Texto blanco sobre el fondo fuerte (el * global del tema lo pintaría oscuro); ver _cardMembresiaAsistencia.scss
    customClass: { popup: 'alerta-membresia' },
  }
  const vigente = membresiaVigente(membresia)
  const encabezado = vigente
    ? `<div style="margin-bottom:10px;font-size:15px">Asistencia registrada: <strong>${escapar(nombre)}</strong></div>`
    : `<div style="margin-bottom:10px;font-size:15px"><strong>${escapar(nombre)}</strong></div>`
  const tituloNoAsiste = 'No asiste porque no tiene membresía vigente'

  if (!membresia) {
    return { ...base, background: ROJO, icon: 'error', title: tituloNoAsiste, html: `${encabezado}El cliente no tiene ninguna membresía registrada.` }
  }

  const diasQuedan = diasQueQuedan(membresia)
  const activa = diasQuedan >= 0
  const deuda = Math.max(0, membresia.montoTotal - membresia.montoPagado)
  const tieneDeuda = !membresia.pagado

  const programa = [membresia.label_programa, membresia.label_plan].filter(Boolean).map((t) => escapar(t as string)).join(' · ')
  const detalle = [
    programa && `<div style="margin-bottom:8px;font-weight:600">${programa}</div>`,
    fila('Inicio', fecha(membresia.fecha_inicio)),
    fila('Fin', fecha(membresia.fecha_vencimiento)),
    fila(activa ? 'Le quedan' : 'Vencida hace', `${Math.abs(diasQuedan)} día${Math.abs(diasQuedan) === 1 ? '' : 's'}`),
    tieneDeuda && fila('Deuda por pagar', getFormatMoney(deuda)),
  ].filter(Boolean).join('')
  const html = `${encabezado}<div style="text-align:left;background:rgba(255,255,255,.12);border-radius:10px;padding:10px 14px">${detalle}</div>`

  if (activa && !tieneDeuda) {
    return { ...base, background: VERDE, icon: 'success', title: 'Membresía activa', html }
  }
  return { ...base, background: ROJO, icon: 'error', title: activa ? 'Tiene una deuda por pagar' : tituloNoAsiste, html }
}
