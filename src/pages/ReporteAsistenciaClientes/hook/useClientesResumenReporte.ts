import { useState } from 'react'
import httpClient from '@/common/helpers/httpClient'
import { ID_TODOS_PROGRAMAS, type FiltrosReporteAsistencia } from '../store/reporteAsistenciaSlice'

/** Fila de GET /persona-eventos-asistencia/reporte-clientes/resumen/clientes: un cliente con membresía vigente en el rango */
export type ClienteResumenProps = {
  id_persona: number
  label_nombres_apellidos_persona: string
  /** Hasta la fecha fin (o hoy); null si nunca asistió */
  ultima_asistencia: string | null
  /** Días distintos con asistencia en el rango (1 por día) */
  asistencias_en_rango: number
  sin_asistir: boolean
  /** Última asistencia hace 7–13 días */
  en_riesgo: boolean
  /** Última asistencia hace ≥ 14 días */
  critico: boolean
  nunca_asistio: boolean
}

/** Clientes del resumen del reporte (los de las cards sin asistir, en riesgo, críticos y nunca asistieron) */
export const useClientesResumenReporte = () => {
  const [clientes, setClientes] = useState<ClienteResumenProps[]>([])
  const [cargando, setCargando] = useState(false)

  /** Con los mismos filtros que el resumen (el horario no aplica) */
  const obtenerClientes = async (filtros: FiltrosReporteAsistencia) => {
    setCargando(true)
    try {
      const params = {
        ...(filtros.fecha_inicio ? { fecha_inicio: filtros.fecha_inicio } : {}),
        ...(filtros.fecha_fin ? { fecha_fin: filtros.fecha_fin } : {}),
        ...(filtros.id_programa !== ID_TODOS_PROGRAMAS ? { id_programa: filtros.id_programa } : {}),
      }
      const { data }: { data: ClienteResumenProps[] } = await httpClient.get('/persona-eventos-asistencia/reporte-clientes/resumen/clientes', { params })
      setClientes(data)
    } catch (error) {
      console.log(error)
      setClientes([])
    } finally {
      setCargando(false)
    }
  }

  return { clientes, cargando, obtenerClientes }
}
