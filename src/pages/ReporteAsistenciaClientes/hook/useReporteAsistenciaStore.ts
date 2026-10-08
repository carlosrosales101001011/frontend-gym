import httpClient from '@/common/helpers/httpClient'
import { useAppDispatch, useAppSelector } from '@/stores/Store'
import {
  ID_TODOS_PROGRAMAS,
  onSetAsistenciasReporte,
  onSetCargandoReporte,
  onSetFiltroReporteAsistencia,
  onSetOpcionesProgramas,
  type AsistenciaReporteProps,
  type FiltrosReporteAsistencia,
} from '../store/reporteAsistenciaSlice'

/** Reporte de asistencias de clientes: filtros del header, programas para el seleccionable y las asistencias */
export const useReporteAsistenciaStore = () => {
  const dispatch = useAppDispatch()
  const { filtros, opcionesProgramas, asistencias, clientesSinAsistir, cargando } = useAppSelector((state) => state.REPORTE_ASISTENCIA)

  const cambiarFiltro = (cambio: Partial<FiltrosReporteAsistencia>) => dispatch(onSetFiltroReporteAsistencia(cambio))

  /** Programas de entrenamiento: "Todos" primero */
  const obtenerProgramas = async () => {
    try {
      const { data }: { data: { lista: { id: number, nombre: string }[] } } = await httpClient.get('/programa-entrenamiento')
      dispatch(onSetOpcionesProgramas([
        { value: ID_TODOS_PROGRAMAS, label: 'Todos' },
        ...data.lista.map((programa) => ({ value: programa.id, label: programa.nombre })),
      ]))
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Asistencias de clientes con los filtros actuales (programa y horario vacíos = todos) y, en paralelo,
   * cuántos clientes con membresía vigente (del programa) no asistieron en el rango.
   */
  const obtenerReporte = async (signal?: AbortSignal) => {
    dispatch(onSetCargandoReporte(true))
    try {
      const params = {
        ...(filtros.fecha_inicio ? { fecha_inicio: filtros.fecha_inicio } : {}),
        ...(filtros.fecha_fin ? { fecha_fin: filtros.fecha_fin } : {}),
        ...(filtros.id_programa !== ID_TODOS_PROGRAMAS ? { id_programa: filtros.id_programa } : {}),
        ...(filtros.horario.trim() ? { horario: filtros.horario.trim() } : {}),
      }
      const [{ data: asistenciasReporte }, { data: resumen }]: [{ data: AsistenciaReporteProps[] }, { data: { clientes_sin_asistir: number } }] = await Promise.all([
        httpClient.get('/persona-eventos-asistencia/reporte-clientes', { params, signal }),
        httpClient.get('/persona-eventos-asistencia/reporte-clientes/resumen', { params, signal }),
      ])
      dispatch(onSetAsistenciasReporte({ asistencias: asistenciasReporte, clientesSinAsistir: resumen.clientes_sin_asistir }))
    } catch (error) {
      if (!signal?.aborted) console.log(error)
    } finally {
      if (!signal?.aborted) dispatch(onSetCargandoReporte(false))
    }
  }

  return { filtros, opcionesProgramas, asistencias, clientesSinAsistir, cargando, cambiarFiltro, obtenerProgramas, obtenerReporte }
}
