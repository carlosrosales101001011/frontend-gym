import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import httpClient from "@/common/helpers/httpClient";
import { alertaError, mostrarAlerta } from "@/components/Alerta/alertas";
import { onSetDataColaborador, type ColaboradorProps } from "@/pages/PerfilCliente/store/perfilColaboradorSlice";
import { useState } from "react";
import { onSetContratosColaborador } from "@/pages/PerfilCliente/store/contratoColaboradorSlice";
import { payloadDatosPersonales } from "@/helpers/payloadDatosPersonales";

/** Id de tipo de persona "cliente" */
const ID_TIPO_CLIENTE = 2

export const usePerfilColaboradorStore = () => {
    const dispatch = useDispatch()
    const [loading, setloading] = useState(false)
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
    /**
     * Guarda "Datos personales" (PATCH /persona/id_tipo/2/id/:id) y vuelve a pedir la persona por el uid de la URL.
     * Avisa si se guardó o no. Devuelve true si se guardó.
     */
    const actualizarDatosPersonales = async(id:number, uid_person:string, datos:Partial<ColaboradorProps>)=>{
        setloading(true)
        try {
            await httpClient.patch(`/persona/id_tipo/${ID_TIPO_CLIENTE}/id/${id}`, payloadDatosPersonales(datos));
            await obtenerDataColaboradorxUID(uid_person);
            mostrarAlerta({ variante: 'success', concepto: 'Datos actualizados con éxito' });
            return true
        } catch {
            alertaError();
            return false
        }finally{
            setloading(false)
        }
    }
    /**
     * Elimina al cliente (borrado lógico: DELETE /persona/id_tipo/2/id/:id) tras confirmarlo.
     * Avisa el resultado; devuelve true si se eliminó.
     */
    const eliminarCliente = async(id:number, nombre:string)=>{
        const { isConfirmed } = await Swal.fire({
            icon: 'warning',
            title: '¿Eliminar cliente?',
            html: `Se eliminará a <strong>${nombre}</strong>. Ya no aparecerá en los listados ni en los buscadores.`,
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: 'var(--bs-danger)',
            focusCancel: true,
        })
        if (!isConfirmed) return false
        try {
            await httpClient.delete(`/persona/id_tipo/${ID_TIPO_CLIENTE}/id/${id}`);
            mostrarAlerta({ variante: 'success', concepto: 'Eliminado con éxito' });
            return true
        } catch {
            alertaError();
            return false
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
    eliminarCliente,
    obtenerDataColaboradorxUID,
    loading,
  }
}
