import { useDispatch } from "react-redux"
import httpClient from "@/common/helpers/httpClient"
import { useCrudhook } from "@/hook/usecrudhook"
import { type DetalleEgresoProps } from "@/pages/GestionEgresos/DetalleEgreso/store/detalleEgresoSlice"
import { type DetallePagoProps } from "@/pages/GestionEgresos/DetallePago/store/detallePagoSlice"
import { onSetDataEgresos,  onSetDataOpcionesConceptosFinanzas,  onSetDataOpcionesCuentasFinancieras,  onSetDataOpcionesGruposFinanzas,  onSetDataOpcionesProveedores,  type conceptoFinanzaProps,  type CuentaFinancieraProps,  type EgresosProps, type grupoFinanzaProps, type ProveedorProps } from "@/pages/GestionEgresos/store/egresosSlice"

export const useEgresosStore = () => {
    const dispatch = useDispatch()
    const { post:postMovFinanciero, obtenerxID, dataxID, searcher } = useCrudhook<EgresosProps>('/movimiento-financiero/id_tipo_movimiento/0', onSetDataEgresos)
    const { obtener:obtenerProveedores } = useCrudhook<ProveedorProps>('/persona/id_tipo/3')
    const { obtener:obtenerCuentasFinancieras } = useCrudhook<CuentaFinancieraProps>('/cuentas-financieras')
    const postDetalleGastoPago = async(detalles:DetallePagoProps[])=>{
      try {
        await httpClient.post('/detallepago-gasto/bulk', detalles)
      }catch (error) {
        console.log(error);
      }
    }
    const postDetalleGasto = async(detalles:DetalleEgresoProps[])=>{
      try {
        await httpClient.post('/detalleArticulos-gasto/bulk', detalles)
      }catch (error) {
        console.log(error);
      }
    }
    const postEgreso = async(formEgreso:EgresosProps, detallesEgreso:DetalleEgresoProps[], detallesGastoPago:DetallePagoProps[])=>{
      try {
        const {data} = await postMovFinanciero(formEgreso)
        await postDetalleGastoPago(detallesGastoPago.map(detalle => ({...detalle, id_movimiento_financiero:data.id})))
        await postDetalleGasto(detallesEgreso.map(detalle => ({...detalle, id_movimiento_financiero:data.id})))
      } catch (error) {
        console.log(error);
      }
    }
    const obtenerGastos = async(signal?: AbortSignal)=>{
      try {
        const data = await searcher(signal)
        console.log(data);
        
      } catch (error) {
        console.log(error);
      }
    }
    const obtenerOpProveedores = async()=>{
      try {
        const data = await obtenerProveedores()
        console.log(data.lista);
        dispatch(onSetDataOpcionesProveedores(data.lista.map((proveedor:ProveedorProps)=>({value:proveedor.id, label:proveedor.nombres}))))
      } catch (error) {
        console.log(error);
      }
    }
    const obtenerOpGruposFinanzas = async()=>{
      try {
        const {data} = await httpClient.get('/terminologia-grupo-movimiento/id_tipo_movimiento/5023')
        dispatch(onSetDataOpcionesGruposFinanzas(data.lista.map((grupo:grupoFinanzaProps)=>({value:grupo.id, label:grupo.nombre}))))
      } catch (error) {
        console.log(error);
      }
    }
    const obtenerOpConceptosFinanzas = async(id_grupo:number)=>{
      try {
        const {data} = await httpClient.get(`/terminologia-gasto/id_grupo/${id_grupo}`)
        console.log({dcon: data});
        dispatch(onSetDataOpcionesConceptosFinanzas(data.map((concepto:conceptoFinanzaProps)=>({value:concepto.id, label:concepto.concepto}))))
      } catch (error) {
        console.log(error);
      }
    }
    const obtenerOpCuentasFinancieras = async()=>{
      try {
        const data = await obtenerCuentasFinancieras()
        console.log(data.lista);
        dispatch(onSetDataOpcionesCuentasFinancieras(data.lista.map((cuenta:CuentaFinancieraProps)=>({value:cuenta.id, label:`${cuenta.n_cuenta}-${cuenta.titular}-${cuenta.descripcion}`}))))
      } catch (error) {
        console.log(error);
      }
    }
    const deleteGastos = async(id_movimiento:number)=>{
      try {
        await httpClient.delete(`/movimiento-financiero/delete/id/${id_movimiento}`)
        await httpClient.delete(`/detalleArticulos-gasto/delete/id_movimiento_financiero/${id_movimiento}`)
        await httpClient.delete(`/detallepago-gasto/delete/id_movimiento_financiero/${id_movimiento}`)
      } catch (error) {
        console.log(error);
      }
    }
  return {
    deleteGastos,
    postEgreso,
    obtenerGastos,
    obtenerOpProveedores,
    obtenerOpCuentasFinancieras,
    obtenerxID,
    obtenerOpGruposFinanzas,
    obtenerOpConceptosFinanzas,
    dataxID
  }
}
