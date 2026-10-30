import { useMemo } from "react"
import httpClient from "@/common/helpers/httpClient"
import { useCrudhook } from "@/hook/usecrudhook"
import { useAppDispatch, useAppSelector } from "@/stores/Store"
import type { MetaProps } from "@/pages/GestionMeta/store/metaSlice"
import { textosReporte } from "../helpers/textosReporte"
import { ID_TODOS_ASESORES, onSelectAsesor, onSelectMeta, onSetAsesoresMeta, onSetMetas, onSetPorFechaPago, type AsesorReporteProps, type PagoReporteProps, type VentaReporteProps } from "../store/reporteMetaSlice"

export const useReporteMetaStore = () => {
    const dispatch = useAppDispatch()
    const { metas, idMetaSeleccionada, asesoresMeta, idAsesorSeleccionado, porFechaPago } = useAppSelector((state) => state.REPORTE_META)
    const { obtenerAll: obtenerMetasApi } = useCrudhook<MetaProps>('/ventas-meta')

    /** Opciones del seleccionable: solo el nombre como label y el id como value */
    const opcionesMetas = useMemo(
      () => metas.map((meta) => ({ value: meta.id, label: meta.nombre })),
      [metas]
    )
    const metaSeleccionada = metas.find((meta) => meta.id === idMetaSeleccionada)
    /** Asesor elegido en el header (undefined con "Todos") */
    const asesorSeleccionado = asesoresMeta.find((asesor) => asesor.id_empl === idAsesorSeleccionado)

    /** Asesores de la meta: "Todos" primero, luego el nombre como label y el id_empl como value */
    const opcionesAsesores = useMemo(
      () => [
        { value: ID_TODOS_ASESORES, label: 'Todos' },
        ...asesoresMeta.map((asesor) => ({ value: asesor.id_empl, label: asesor.label_empl })),
      ],
      [asesoresMeta]
    )

    /**
     * Monto de meta a reportar: con "Todos" es el monto de programas de la meta;
     * con un asesor elegido, la meta de ese asesor (decimales: pueden llegar como string).
     */
    const montoMetaObjetivo = idAsesorSeleccionado === ID_TODOS_ASESORES
      ? Number(metaSeleccionada?.monto_programa) || 0
      : Number(asesoresMeta.find((asesor) => asesor.id_empl === idAsesorSeleccionado)?.monto) || 0

    /** Carga las metas y, si aún no se eligió ninguna, selecciona la última (la de mayor id) */
    const obtenerMetas = async () => {
      try {
        const data = await obtenerMetasApi()
        const lista: MetaProps[] = data.lista
        dispatch(onSetMetas(lista))
        if (idMetaSeleccionada === 0 && lista.length > 0) {
          seleccionarMeta(Math.max(...lista.map((meta) => meta.id)))
        }
      } catch (error) {
        console.log(error);
      }
    }

    const obtenerAsesoresMeta = async (id_meta: number) => {
      try {
        const { data } = await httpClient.get(`/detallemeta-asesor/id_meta/${id_meta}`)
        const asesores: AsesorReporteProps[] = data.lista.map((asesor: AsesorReporteProps) => ({
          id_empl: asesor.id_empl,
          label_empl: asesor.label_empl,
          monto: Number(asesor.monto) || 0,
        }))
        dispatch(onSetAsesoresMeta({ id_meta, asesores }))
      } catch (error) {
        console.log(error);
      }
    }

    const seleccionarMeta = (id: number) => {
      dispatch(onSelectMeta(id))
      if (id) obtenerAsesoresMeta(id)
    }

    const seleccionarAsesor = (id_empl: number) => {
      dispatch(onSelectAsesor(id_empl))
    }

    /**
     * Todas las ventas del periodo de la meta (yyyy-MM-dd). La llama cada layout del reporte,
     * que guarda el resultado en su propio estado (con su loading).
     */
    /** Con un asesor elegido solo cuentan sus ventas; con "Todos", todas (la meta ya viene en montoMetaObjetivo) */
    const filtrarVentasPorAsesor = <T extends Pick<VentaReporteProps, 'id_empl'>>(ventas: T[]) =>
      idAsesorSeleccionado === ID_TODOS_ASESORES
        ? ventas
        : ventas.filter((venta) => venta.id_empl === idAsesorSeleccionado)

    /** Pagos (ingresos) con fecha de pago en el periodo de la meta (yyyy-MM-dd) */
    const obtenerPagosRango = async (fecha_inicio: string, fecha_fin: string): Promise<PagoReporteProps[]> => {
      const { data } = await httpClient.get('/detalleventa-pagos/rango-fechas', { params: { fecha_inicio, fecha_fin } })
      return data.lista
    }

    /**
     * Filas que suma el reporte (cards, gráfico y ritmo):
     * - por fecha de venta: las ventas del periodo (montoTotal_membresia, en su fecha_venta).
     * - por fecha de pago: los ingresos, un registro por pago, con lo pagado como montoTotal_membresia y en su
     *   fecha_pago. Así todos los cálculos suman lo que realmente entró, igual que el modal "Ver ingresos".
     */
    const obtenerVentasRango = async (fecha_inicio: string, fecha_fin: string): Promise<VentaReporteProps[]> => {
      if (!porFechaPago) {
        const { data } = await httpClient.get('/venta/rango-fechas', { params: { fecha_inicio, fecha_fin } })
        return data.lista
      }
      const pagos = await obtenerPagosRango(fecha_inicio, fecha_fin)
      return pagos.map((pago) => ({
        id: pago.id_venta,
        fecha_venta: pago.fecha_pago,
        fecha_pago: pago.fecha_pago,
        id_empl: pago.id_empl,
        label_nombres_apellidos_empl: pago.label_nombres_apellidos_empl,
        label_nombres_apellidos_cli: pago.label_nombres_apellidos_cli,
        label_documento_cli: pago.label_documento_cli,
        n_comprobante: pago.n_comprobante,
        montoTotal_membresia: pago.monto,
        montoTotal_productos: 0,
        id_tipo_cli: pago.id_tipo_cli,
        label_tipo_cli: pago.label_tipo_cli,
      }))
    }

  return {
    opcionesMetas,
    idMetaSeleccionada,
    metaSeleccionada,
    asesorSeleccionado,
    opcionesAsesores,
    idAsesorSeleccionado,
    porFechaPago,
    montoMetaObjetivo,
    obtenerMetas,
    obtenerVentasRango,
    obtenerPagosRango,
    filtrarVentasPorAsesor,
    seleccionarMeta,
    seleccionarAsesor,
    cambiarPorFechaPago: (valor: boolean) => dispatch(onSetPorFechaPago(valor)),
    /** Textos de venta o de ingreso según el switch de fecha */
    textos: textosReporte(porFechaPago),
  }
}
