import { useDispatch } from "react-redux";
import { addComentario, onSetDataComentarios } from "@/components/Comentario/comentarioSlice";
import httpClient from "@/common/helpers/httpClient";
import { useState } from "react";

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
    const postComentario = async(formState:{id_user:number, comentario:string, uid_location:string}, uid_location:string)=>{
        try {
            await httpClient.post(`/comentario`, formState)
        } catch (error) {
            console.log(error);
        }finally{
            obtenerComentariosxUIDLOCATION(uid_location)
        }
    }
    const patchComentario = async(comentario:string, uid_location:string, id:number)=>{
        try {
            await httpClient.patch(`/comentario/${id}`, {comentario})
        } catch (error) {
            console.log(error);
        }finally{
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
    obtenerComentariosxUIDLOCATION,
    postComentario,
    obtenerComentarioxID,
    loading
  }
}
