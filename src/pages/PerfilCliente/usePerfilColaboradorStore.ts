import { useDispatch } from "react-redux";
import httpClient from "@/common/helpers/httpClient";
import { onSetDataColaborador, type ColaboradorProps } from "@/pages/PerfilCliente/store/perfilColaboradorSlice";
import { useState } from "react";
import { useCrudhook } from "@/hook/usecrudhook";
import { onSetContratosColaborador } from "@/pages/PerfilCliente/store/contratoColaboradorSlice";

export const usePerfilColaboradorStore = () => {
    const dispatch = useDispatch()
    const [loading, setloading] = useState(false)
    const { patch } = useCrudhook<ColaboradorProps>('/persona')
    const obtenerDataColaboradorxUID = async(uid_cliente:string)=>{
        setloading(true)
        try {
            const {data} = await httpClient.get(`/persona/id_tipo/2/uid/${uid_cliente}`)
            dispatch(onSetDataColaborador(data))
        } catch (error) {
            console.log(error);
        }finally{
            setloading(false)
        }
    }
    const patchColaborador = async(id:number, uid_cliente:string, formState:ColaboradorProps)=>{
        setloading(true)
        try {
            await patch(formState, id, uid_cliente);
            await obtenerDataColaboradorxUID(uid_cliente);
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
