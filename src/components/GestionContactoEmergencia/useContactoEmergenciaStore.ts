import httpClient from '@/common/helpers/httpClient';
import type { RootState } from '@/stores/Store';
import { addContactoEmergencia, onSetDataContactosEmergencia, type ContactoEmergenciaProps } from '@/components/GestionContactoEmergencia/contactoEmergenciaSlice';
import { useDispatch, useSelector } from 'react-redux';

export const useContactoEmergenciaStore = (uid_location:string) => {
  const dispatch = useDispatch()
  const { contactosEmergencia } = useSelector((state: RootState)=>state.CONTACTO_EMERGENCIA)
  const obtenerContactosEmergencia = async()=>{
    try {
      const {data} = await httpClient.get(`/contacto-emergencia/${uid_location}`, {
                params: {
                show: 2,
                offset: 0
                }
            })
      dispatch(onSetDataContactosEmergencia(data))
    } catch (error) {
      console.log(error);
    }
  }
  const postContactoEmergencia = async(formState:ContactoEmergenciaProps)=>{
    try {
      await httpClient.post(`/contacto-emergencia/${uid_location}`, {...formState})
    } catch (error) {
      console.log(error);
    }
  }
  const patchContactoEmergencia = async(id:number, formState:ContactoEmergenciaProps)=>{
    try {
      await httpClient.patch(`/contacto-emergencia/id/${id}`, {...formState})
    } catch (error) {
      console.log(error);
    } finally{
      obtenerContactosEmergencia()
    }
  }
  const obtenerContactoEmergenciaxID = async(id:number)=>{
    try {
      const {data} = await httpClient.get(`/contacto-emergencia/id/${id}`)
      dispatch(addContactoEmergencia(data))
    } catch (error) {
      console.log(error);
    }
  }
  const deleteContactoEmergenciaxID = async(id:number)=>{
    try {
      await httpClient.patch(`/contacto-emergencia/delete/id/${id}`)
    } catch (error) {
      console.log(error);
    }finally{
      obtenerContactosEmergencia()
    }
  }
  return {
    contactosEmergencia,
    obtenerContactoEmergenciaxID,
    obtenerContactosEmergencia,
    postContactoEmergencia,
    patchContactoEmergencia,
    deleteContactoEmergenciaxID
  }
}
