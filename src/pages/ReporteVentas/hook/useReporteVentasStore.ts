import { useMemo } from "react"
import { startOfMonth } from "date-fns"
import httpClient from "@/common/helpers/httpClient"
import { useCrudhook } from "@/hook/usecrudhook"
import { formatDate } from "@/helpers/FormatDate"
import { uniqueById } from "@/helpers/arrays"
import { useTerminologiaPersona } from "@/hook/usePropiedadesStore"
import { useAppDispatch, useAppSelector } from "@/stores/Store"
import type { ProgramaBaseBackend } from "@/pages/GestionProgramasEntrenamiento/store/programaSlice"
import type { OpcionesSelect } from "@/types/props"
import { ventaCumpleFiltroMembresia, type FiltroMembresia } from "../helpers/resumenVentas"
import {
  ID_TODOS,
  onSelectAsesor,
  onSelectOrigen,
  onSelectPlan,
  onSelectPrograma,
  onSetAsesores,
  onSetFechas,
  onSetPlanes,
  onSetPorFechaPago,
  onSetProgramas,
  type PagoReporteVentasProps,
  type PlanReporteVentasProps,
  type VentaReporteVentasProps,
} from "../store/reporteVentasSlice"
import { textosReporteVentas } from "../helpers/textosReporteVentas"

const aFechaISO = (fecha: Date) => formatDate(fecha, 'yyyy-mm-dd', 'yyyy-mm-dd')

/** Agrega "Todos" al inicio de las opciones de un seleccionable */
const conTodos = (opciones: OpcionesSelect[]) => [{ value: ID_TODOS, label: 'Todos' }, ...opciones]

export const useReporteVentasStore = () => {
    const dispatch = useAppDispatch()
    const {
      fecha_inicio, fecha_fin, porFechaPago, opcionesAsesores, opcionesProgramas, planes,
      idAsesorSeleccionado, idProgramaSeleccionado, idPlanSeleccionado, idOrigenSeleccionado,
    } = useAppSelector((state) => state.REPORTE_VENTAS)
    // Orígenes de venta desde terminologías (igual que en Punto de Venta)
    const { cargar: obtenerOrigenes, data: dataOrigenes } = useTerminologiaPersona('origenVenta')
    const { obtenerAll: obtenerProgramasApi } = useCrudhook<ProgramaBaseBackend>('/programa-entrenamiento')
    const { obtenerAll: obtenerPlanesApi } = useCrudhook<PlanReporteVentasProps>('/entrenamiento-plan')

    /** Programa y plan elegidos: se aplican sobre las membresías de cada venta */
    const filtroMembresia: FiltroMembresia = useMemo(
      () => ({ idPrograma: idProgramaSeleccionado, idPlan: idPlanSeleccionado }),
      [idProgramaSeleccionado, idPlanSeleccionado]
    )

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

    /** Asesores = quienes tienen ventas en el rango (nombre como label, id_empl como value) */
    const obtenerAsesoresRango = async (inicio: string, fin: string) => {
      try {
        const { data } = await httpClient.get('/venta/rango-fechas', { params: { fecha_inicio: inicio, fecha_fin: fin, por_fecha_pago: porFechaPago } })
        const asesores = uniqueById((data.lista as VentaReporteVentasProps[])
          .filter((venta) => venta.id_empl)
          .map((venta) => ({ id: venta.id_empl, label: venta.label_nombres_apellidos_empl ?? '' })))
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((asesor) => ({ value: asesor.id, label: asesor.label }))
        dispatch(onSetAsesores({ fecha_inicio: inicio, fecha_fin: fin, porFechaPago, asesores }))
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * Filas del reporte; cada componente guarda el resultado en su propio estado.
     * - por fecha de venta: las ventas del rango (con sus membresías).
     * - por fecha de pago: los ingresos, una fila por pago del rango con los datos de su venta (membresías,
     *   origen, deuda...). Así todo el reporte suma lo que realmente entró en el rango.
     */
    const obtenerVentasRango = async (inicio: string, fin: string): Promise<VentaReporteVentasProps[]> => {
      if (!porFechaPago) {
        const { data } = await httpClient.get('/venta/rango-fechas', { params: { fecha_inicio: inicio, fecha_fin: fin } })
        return (data.lista as VentaReporteVentasProps[]).map((venta) => ({ ...venta, pago: null }))
      }
      // Las ventas con algún pago en el rango traen los datos de venta de cada pago
      const [{ data: dataVentas }, { data: dataPagos }] = await Promise.all([
        httpClient.get('/venta/rango-fechas', { params: { fecha_inicio: inicio, fecha_fin: fin, por_fecha_pago: true } }),
        httpClient.get('/detalleventa-pagos/rango-fechas', { params: { fecha_inicio: inicio, fecha_fin: fin } }),
      ])
      const ventaPorId = new Map((dataVentas.lista as VentaReporteVentasProps[]).map((venta) => [venta.id, venta]))
      return (dataPagos.lista as PagoReporteVentasProps[]).flatMap((pago) => {
        const venta = ventaPorId.get(pago.id_venta)
        if (!venta) return []
        const { id, id_venta, fecha_pago, id_forma_pago, monto } = pago
        return [{ ...venta, pago: { id, id_venta, fecha_pago, id_forma_pago, monto: Number(monto) || 0 } }]
      })
    }

    /**
     * Aplica los filtros del header (0 = "Todos"); con programa y/o plan, quedan las ventas que los incluyen.
     * `ignorarAsesor` / `ignorarOrigen` / `ignorarPrograma` / `ignorarPlan`: para vistas que comparan a todos
     * (ventas por asesor / por origen / por programa / por plan).
     */
    const filtrarVentas = (ventas: VentaReporteVentasProps[], { ignorarAsesor = false, ignorarOrigen = false, ignorarPrograma = false, ignorarPlan = false } = {}) =>
      ventas.filter((venta) =>
        (ignorarAsesor || idAsesorSeleccionado === ID_TODOS || venta.id_empl === idAsesorSeleccionado)
        && (ignorarOrigen || idOrigenSeleccionado === ID_TODOS || venta.id_origen === idOrigenSeleccionado)
        && ventaCumpleFiltroMembresia(venta, { idPrograma: ignorarPrograma ? ID_TODOS : idProgramaSeleccionado, idPlan: ignorarPlan ? ID_TODOS : idPlanSeleccionado }))

    /** Todos los programas (sin paginar) */
    const obtenerProgramas = async () => {
      try {
        const data = await obtenerProgramasApi()
        dispatch(onSetProgramas(data.lista.map((programa: ProgramaBaseBackend) => ({ value: programa.id, label: programa.nombre }))))
      } catch (error) {
        console.log(error);
      }
    }

    /** Todos los planes (sin paginar); las opciones se arman según el programa elegido */
    const obtenerPlanes = async () => {
      try {
        const data = await obtenerPlanesApi()
        dispatch(onSetPlanes(data.lista))
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * Planes para el seleccionable: dependen del programa elegido y el label es solo la duración ("3 meses").
     * Con programa "Todos" solo queda la opción "Todos" (los planes de distintos programas no se distinguirían).
     */
    const opcionesPlanes = useMemo(() => conTodos(
      idProgramaSeleccionado === ID_TODOS ? [] : planes
        .filter((plan) => plan.id_programa === idProgramaSeleccionado)
        .sort((a, b) => a.nMeses - b.nMeses)
        .map((plan) => ({ value: plan.id, label: `${plan.nMeses} ${plan.nMeses === 1 ? 'mes' : 'meses'}` }))
    ), [planes, idProgramaSeleccionado])

    const opcionesAsesoresTodos = useMemo(() => conTodos(opcionesAsesores), [opcionesAsesores])
    const opcionesProgramasTodos = useMemo(() => conTodos(opcionesProgramas), [opcionesProgramas])
    const opcionesOrigenesTodos = useMemo(() => conTodos(dataOrigenes), [dataOrigenes])

  return {
    fecha_inicio,
    fecha_fin,
    porFechaPago,
    rangoValido,
    opcionesAsesores: opcionesAsesoresTodos,
    opcionesProgramas: opcionesProgramasTodos,
    opcionesOrigenes: opcionesOrigenesTodos,
    opcionesPlanes,
    planes,
    idAsesorSeleccionado,
    idProgramaSeleccionado,
    idPlanSeleccionado,
    idOrigenSeleccionado,
    filtroMembresia,
    inicializarFechas,
    cambiarFechas,
    cambiarPorFechaPago: (valor: boolean) => dispatch(onSetPorFechaPago(valor)),
    /** Textos de venta o de ingreso según el switch de fecha */
    textos: textosReporteVentas(porFechaPago),
    obtenerAsesoresRango,
    obtenerVentasRango,
    filtrarVentas,
    obtenerProgramas,
    obtenerOrigenes,
    obtenerPlanes,
    seleccionarAsesor: (id: number) => dispatch(onSelectAsesor(id)),
    seleccionarPrograma: (id: number) => dispatch(onSelectPrograma(id)),
    seleccionarPlan: (id: number) => dispatch(onSelectPlan(id)),
    seleccionarOrigen: (id: number) => dispatch(onSelectOrigen(id)),
  }
}
