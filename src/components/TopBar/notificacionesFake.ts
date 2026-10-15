import type { IconName } from '@/components/Icons/IconCR'

export type NotificacionProps = {
  id: number
  icono: IconName
  titulo: string
  mensaje: string
  fecha: Date
  leida: boolean
}

/** Hace `minutos` minutos (para que las fechas de prueba siempre sean recientes) */
const haceMinutos = (minutos: number) => new Date(Date.now() - minutos * 60_000)

/** Datos de prueba de la campanita del Topbar hasta que exista el endpoint de notificaciones */
export const NOTIFICACIONES_FAKE: NotificacionProps[] = [
  { id: 1, icono: 'membresia', titulo: 'Membresía por vencer', mensaje: 'La membresía de Ana Torres vence en 3 días.', fecha: haceMinutos(5), leida: false },
  { id: 2, icono: 'sales', titulo: 'Nueva venta', mensaje: 'Se registró la venta B001-00125 por S/ 350.00.', fecha: haceMinutos(42), leida: false },
  { id: 3, icono: 'calendar', titulo: 'Cita reprogramada', mensaje: 'La cita de nutrición de Luis Ramírez pasó a las 4:00 pm.', fecha: haceMinutos(180), leida: false },
  { id: 4, icono: 'regalo', titulo: 'Cumpleaños', mensaje: 'Hoy cumple años María Fernández.', fecha: haceMinutos(60 * 26), leida: true },
  { id: 5, icono: 'freeze', titulo: 'Congelamiento aprobado', mensaje: 'Se congeló la membresía de Jorge Salas por 15 días.', fecha: haceMinutos(60 * 50), leida: true },
]
