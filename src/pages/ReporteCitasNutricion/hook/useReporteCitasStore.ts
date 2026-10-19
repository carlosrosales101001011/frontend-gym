import { useCallback, useMemo } from "react"
import { startOfMonth } from "date-fns"
import httpClient from "@/common/helpers/httpClient"
import { formatDate } from "@/helpers/FormatDate"
import { uniqueById } from "@/helpers/arrays"
import { useAppDispatch, useAppSelector } from "@/stores/Store"
import { useAgendaNutricionistaStore } from "@/pages/AgendaNutricionista/hook/useAgendaNutricionistaStore"
import type { OpcionesSelect } from "@/types/props"
import {
  ID_TODOS,
  onSelectEstado,
  onSelectNutricionista,
  onSetFechas,
  onSetNutricionistas,
  type CitaReporteProps,
} from "../store/reporteCitasSlice"

/** Cita tal como la devuelve /agenda-nutricionista/rango */
type CitaApi = {
  id: number
  id_cli: number
  label_nombres_apellidos_cli?: string | null
  id_empl: number
  label_nombres_apellidos_empl?: string | null
  /** yyyy-MM-dd (o ISO con hora) */
  fecha: string
  /** HH:mm[:ss] (o ISO 1970-01-01THH:mm) */
  hora_inicio: string
  id_estado: number
}

const aFechaISO = (fecha: Date) => formatDate(fecha, 'yyyy-mm-dd', 'yyyy-mm-dd')

/** Del backend al reporte: fecha yyyy-MM-dd y hora HH:mm (la columna time puede llegar como ISO) */
const desdeApi = (cita: CitaApi): CitaReporteProps => ({
  id: cita.id,
  id_cli: cita.id_cli,
  label_cliente: cita.label_nombres_apellidos_cli ?? '',
  id_empl: cita.id_empl,
  label_nutricionista: cita.label_nombres_apellidos_empl ?? '',
  fecha: cita.fecha.slice(0, 10),
  hora_inicio: (cita.hora_inicio.includes('T') ? cita.hora_inicio.split('T')[1] : cita.hora_inicio).slice(0, 5),
  id_estado: cita.id_estado,
})

/** Agrega "Todos" al inicio de las opciones de un seleccionable */
const conTodos = (opciones: OpcionesSelect[]) => [{ value: ID_TODOS, label: 'Todos' }, ...opciones]

export const useReporteCitasStore = () => {
    const dispatch = useAppDispatch()
    const { fecha_inicio, fecha_fin, opcionesNutricionistas, idNutricionistaSeleccionado, idEstadoSeleccionado } = useAppSelector((state) => state.REPORTE_CITAS)
    // Estados de cita con su color: los mismos de la agenda (terminología agenda / cita / estado)
    const { estados, obtenerEstados } = useAgendaNutricionistaStore()

    const rangoValido = !!fecha_inicio && !!fecha_fin && fecha_fin >= fecha_inicio

    /** Por defecto: del 1 del mes actual hasta hoy (solo si aún no hay fechas) */
    const inicializarFechas = () => {
      if (fecha_inicio && fecha_fin) return
      const hoy = new Date()
      dispatch(onSetFechas({ fecha_inicio: aFechaISO(startOfMonth(hoy)), fecha_fin: aFechaISO(hoy) }))
    }

    const cambiarFechas = (nuevas: { fecha_inicio?: string, fecha_fin?: string }) => {
      dispatch(onSetFechas({ fecha_inicio: nuevas.fecha_inicio ?? fecha_inicio, fecha_fin: nuevas.fecha_fin ?? fecha_fin }))
    }

    /** Todas las citas del rango; cada componente guarda el resultado en su propio estado */
    const obtenerCitasRango = async (inicio: string, fin: string): Promise<CitaReporteProps[]> => {
      const { data } = await httpClient.get('/agenda-nutricionista/rango', { params: { fecha_inicio: inicio, fecha_fin: fin } })
      return (data.lista as CitaApi[]).map(desdeApi)
    }

    /** Nutricionistas = quienes tienen citas en el rango (nombre como label, id_empl como value) */
    const obtenerNutricionistasRango = async (inicio: string, fin: string) => {
      try {
        const citas = await obtenerCitasRango(inicio, fin)
        const nutricionistas = uniqueById(citas
          .filter((cita) => cita.id_empl)
          .map((cita) => ({ id: cita.id_empl, label: cita.label_nutricionista })))
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((nutricionista) => ({ value: nutricionista.id, label: nutricionista.label }))
        dispatch(onSetNutricionistas({ fecha_inicio: inicio, fecha_fin: fin, nutricionistas }))
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * Aplica los filtros del header (0 = "Todos").
     * `ignorarNutricionista` / `ignorarEstado`: para vistas que comparan a todos (por nutricionista / por estado).
     */
    const filtrarCitas = useCallback((citas: CitaReporteProps[], { ignorarNutricionista = false, ignorarEstado = false } = {}) =>
      citas.filter((cita) =>
        (ignorarNutricionista || idNutricionistaSeleccionado === ID_TODOS || cita.id_empl === idNutricionistaSeleccionado)
        && (ignorarEstado || idEstadoSeleccionado === ID_TODOS || cita.id_estado === idEstadoSeleccionado)),
      [idNutricionistaSeleccionado, idEstadoSeleccionado])

    const opcionesNutricionistasTodos = useMemo(() => conTodos(opcionesNutricionistas), [opcionesNutricionistas])
    const opcionesEstados = useMemo(() => conTodos(estados.map(({ value, label }) => ({ value, label }))), [estados])

  return {
    fecha_inicio,
    fecha_fin,
    rangoValido,
    estados,
    opcionesNutricionistas: opcionesNutricionistasTodos,
    opcionesEstados,
    idNutricionistaSeleccionado,
    idEstadoSeleccionado,
    inicializarFechas,
    cambiarFechas,
    obtenerEstados,
    obtenerCitasRango,
    obtenerNutricionistasRango,
    filtrarCitas,
    seleccionarNutricionista: (id: number) => dispatch(onSelectNutricionista(id)),
    seleccionarEstado: (id: number) => dispatch(onSelectEstado(id)),
  }
}
