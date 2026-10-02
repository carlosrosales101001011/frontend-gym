import { useDispatch } from "react-redux";
import { addComentario, onSetDataComentarios } from "@/components/Comentario/comentarioSlice";
import httpClient from "@/common/helpers/httpClient";
import { useState } from "react";
import Swal from "sweetalert2";
import { mensajeError } from "@/helpers/mensajeError";

export const useComentarioStore = () => {
    const dispatch = useDispatch()
    const [loading, setloading] = useState(true)
    const obtenerComentariosxUIDLOCATION = async(uid_location:string)=>{
        try {
            setloading(true)
            const { data }  =  await httpClient.get(`/comentario/${uid_location}`)
            console.log({data});
            
            dispatch(onSetDataComentarios(data))
        } catch (error) {
            console.log(error);
        } finally{
            setloading(false)
        }
    }
    /** Publica el comentario (el autor sale del token). Devuelve true si se guardó; si falla, avisa con el motivo */
    const postComentario = async(formState:{comentario:string, uid_location:string}, uid_location:string)=>{
        try {
            await httpClient.post(`/comentario`, formState)
            return true
        } catch (error) {
            await Swal.fire({ icon: 'error', title: 'No se pudo publicar el comentario', html: mensajeError(error) })
            return false
        }finally{
            obtenerComentariosxUIDLOCATION(uid_location)
        }
    }
    /** Edita el texto (solo su autor o un super usuario). Si falla, avisa con el motivo */
    const patchComentario = async(comentario:string, uid_location:string, id:number)=>{
        try {
            await httpClient.patch(`/comentario/${id}`, {comentario: comentario.trim()})
        } catch (error) {
            await Swal.fire({ icon: 'error', title: 'No se pudo editar el comentario', html: mensajeError(error) })
        }finally{
            obtenerComentariosxUIDLOCATION(uid_location)
        }
    }
    /** Pide confirmación y da de baja el comentario (solo su autor o un super usuario). Si falla, avisa con el motivo */
    const eliminarComentario = async(id:number, uid_location:string)=>{
        const { isConfirmed } = await Swal.fire({
            icon: 'warning',
            title: '¿Eliminar el comentario?',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return
        try {
            await httpClient.delete(`/comentario/${id}`)
        } catch (error) {
            await Swal.fire({ icon: 'error', title: 'No se pudo eliminar el comentario', html: mensajeError(error) })
        } finally {
            obtenerComentariosxUIDLOCATION(uid_location)
        }
    }
    const obtenerComentarioxID = async(id:number)=>{
        try {
            const { data } = await httpClient.get(`/comentario/id/${id}`)
            console.log({id, data});
            
            dispatch(addComentario(data))
        } catch (error) {
            console.log(error);
        }
    }
  return {
    patchComentario,
    eliminarComentario,
    obtenerComentariosxUIDLOCATION,
    postComentario,
    obtenerComentarioxID,
    loading
  }
}
