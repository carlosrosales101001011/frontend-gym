import { useDispatch } from "react-redux";
import httpClient from "@/common/helpers/httpClient";
import Swal from "sweetalert2";
import { mensajeError } from "@/helpers/mensajeError";
import { payloadDatosPersonales } from "@/helpers/payloadDatosPersonales";
import { ID_TIPO_COLABORADOR } from "@/pages/PerfilColaborador/hook/usePersonaColaborador";
import { onSetDataColaborador, type ColaboradorProps } from "@/pages/PerfilColaborador/store/perfilColaboradorSlice";
import { useState } from "react";
import { useCrudhook } from "@/hook/usecrudhook";
import { onSetContratosColaborador } from "@/pages/PerfilColaborador/store/contratoColaboradorSlice";

export const usePerfilColaboradorStore = () => {
    const dispatch = useDispatch()
    const [loading, setloading] = useState(false)
    const { patch } = useCrudhook<ColaboradorProps>('/persona')
    const obtenerDataColaboradorxUID = async(uid_colaborador:string)=>{
        setloading(true)
        try {
            const {data} = await httpClient.get(`/persona/id_tipo/1/uid/${uid_colaborador}`)
            dispatch(onSetDataColaborador(data))
        } catch (error) {
            console.log(error);
        }finally{
            setloading(false)
        }
    }
    const patchColaborador = async(id:number, uid_colaborador:string, formState:ColaboradorProps)=>{
        setloading(true)
        try {
            await patch(formState, id, uid_colaborador);
            await obtenerDataColaboradorxUID(uid_colaborador);
        } catch (error) {
            console.log(error);
        }finally{
            setloading(false)
        }
    }
    /**
     * Guarda "Datos personales" (PATCH /persona/id_tipo/1/id/:id) y vuelve a pedir la persona por el uid de la URL.
     * Avisa si se guardó o por qué no. Devuelve true si se guardó.
     */
    const actualizarDatosPersonales = async(id:number, uid_colaborador:string, datos:Partial<ColaboradorProps>)=>{
        setloading(true)
        try {
            await httpClient.patch(`/persona/id_tipo/${ID_TIPO_COLABORADOR}/id/${id}`, { ...payloadDatosPersonales(datos), id_estado: Number(datos.id_estado) || 0 });
            await obtenerDataColaboradorxUID(uid_colaborador);
            await Swal.fire({ icon: 'success', title: 'Datos actualizados', timer: 1500, showConfirmButton: false });
            return true
        } catch (error) {
            await Swal.fire({ icon: 'error', title: 'No se pudieron actualizar los datos', html: mensajeError(error) });
            return false
        }finally{
            setloading(false)
        }
    }
    const obtenerContratoxEmpleado = async(uid_empleado:string)=>{
        try {
            const { data } = await httpClient.get(`/contrato-empleado/uid_empleado/${uid_empleado}`)
            
            dispatch(onSetContratosColaborador(data.lista))
        } catch (error) {
            console.log(error);
        }
    }
  return {
    obtenerContratoxEmpleado,
    actualizarDatosPersonales,
    patchColaborador,
    obtenerDataColaboradorxUID,
    loading,
  }
}
