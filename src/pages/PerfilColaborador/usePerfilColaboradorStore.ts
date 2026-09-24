import { useDispatch } from "react-redux";
import httpClient from "@/common/helpers/httpClient";
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
    patchColaborador,
    obtenerDataColaboradorxUID,
    loading,
  }
}
