import { useState } from 'react'
import httpClient from '@/common/helpers/httpClient'
import type { SeguimientoMembresiaProps } from '@/pages/SeguimientoMembresia/store/seguimientoMembresiaSlice'
import { diasHabilesMembresia } from '@/helpers/diasMembresia'

const CANTIDAD = 50
/** Ventana de la columna de asistencia (hoy incluido) */
export const DIAS_ASISTENCIA = 30

/**
 * Seguimiento con los días que asistió el cliente en los últimos DIAS_ASISTENCIA días y los días desde su
 * último entrenamiento (recencia: 0 = hoy; null = nunca asistió). renovaciones_anteriores: membresías del cliente que
 * vencen antes que esta (sin contarla). clases_consumidas: días con asistencia entre el inicio y el vencimiento de esta
 */
export type MembresiaAsistenciaProps = SeguimientoMembresiaProps & {
  dias_asistidos: number,
  /** Días asistidos en los últimos DIAS_ASISTENCIA días menos el promedio de los 2 periodos anteriores (puede ser x.5) */
  tendencia: number,
  dias_desde_ultima: number | null,
  renovaciones_anteriores: number,
  clases_consumidas: number,
  /** Días hábiles (lunes a sábado) de toda la membresía; 0 si no se conoce su inicio */
  sesiones_totales: number,
}

type HistorialSeguimientoProps = { id: number, anteriores: number, clases_consumidas: number, fecha_inicio: string | null }

type AsistenciaClienteProps = { id_persona: number, dias_asistidos: number, tendencia: number, dias_desde_ultima: number | null }

/** Los primeros 50 seguimientos de membresía (por id, como los devuelve el backend) con la asistencia y recencia de cada cliente */
export const useMembresiasSeguimiento = () => {
  const [membresias, setMembresias] = useState<MembresiaAsistenciaProps[]>([])
  const [cargando, setCargando] = useState(false)

  const obtenerMembresias = async () => {
    setCargando(true)
    try {
      const { data }: { data: { lista: SeguimientoMembresiaProps[] } } =
        await httpClient.get('/membresia-seguimiento', { params: { show: CANTIDAD, offset: 0 } })
      const idsClientes = [...new Set(data.lista.map((m) => m.id_cli).filter(Boolean))]
      const idsSeguimientos = data.lista.map((m) => m.id).filter(Boolean)
      const [{ data: asistencias }, { data: historial }]: [{ data: AsistenciaClienteProps[] }, { data: HistorialSeguimientoProps[] }] =
        await Promise.all([
          httpClient.get('/persona-eventos-asistencia/dias-asistidos', { params: { ids: idsClientes.join(','), dias: DIAS_ASISTENCIA } }),
          httpClient.get('/membresia-seguimiento/historial', { params: { ids: idsSeguimientos.join(',') } }),
        ])
      const porCliente = new Map(asistencias.map((a) => [a.id_persona, a]))
      const historialPorId = new Map(historial.map((h) => [h.id, h]))
      setMembresias(data.lista.map((m) => {
        const asistencia = porCliente.get(m.id_cli ?? 0)
        const seguimiento = historialPorId.get(m.id ?? 0)
        return {
          ...m,
          dias_asistidos: asistencia?.dias_asistidos ?? 0,
          tendencia: asistencia?.tendencia ?? 0,
          dias_desde_ultima: asistencia?.dias_desde_ultima ?? null,
          renovaciones_anteriores: seguimiento?.anteriores ?? 0,
          clases_consumidas: seguimiento?.clases_consumidas ?? 0,
          sesiones_totales: seguimiento?.fecha_inicio && m.fecha_vencimiento
            ? diasHabilesMembresia(seguimiento.fecha_inicio, m.fecha_vencimiento) : 0,
        }
      }))
    } catch (error) {
      console.log(error)
      setMembresias([])
    } finally {
      setCargando(false)
    }
  }

  return { membresias, cargando, obtenerMembresias }
}
