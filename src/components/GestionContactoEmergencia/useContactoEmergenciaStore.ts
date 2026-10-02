import httpClient from '@/common/helpers/httpClient';
import type { RootState } from '@/stores/Store';
import { addContactoEmergencia, onSetDataContactosEmergencia, type ContactoEmergenciaProps } from '@/components/GestionContactoEmergencia/contactoEmergenciaSlice';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { mensajeError } from '@/helpers/mensajeError';

/** Lo que se envía al guardar un contacto (campos del DTO del backend) */
export type ContactoEmergenciaForm = Pick<ContactoEmergenciaProps, 'nombres' | 'apellido_paterno' | 'apellido_materno' | 'telefono' | 'email' | 'observacion' | 'id_cargo'>

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
  /** Agrega el contacto y refresca la lista. Devuelve true si se guardó; si falla, avisa con el motivo */
  const postContactoEmergencia = async(formState:ContactoEmergenciaForm)=>{
    try {
      await httpClient.post(`/contacto-emergencia/${uid_location}`, formState)
      await obtenerContactosEmergencia()
      return true
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'No se pudo agregar el contacto', html: mensajeError(error) })
      return false
    }
  }
  /** Edita el contacto y refresca la lista. Devuelve true si se guardó; si falla, avisa con el motivo */
  const patchContactoEmergencia = async(id:number, formState:ContactoEmergenciaForm)=>{
    try {
      await httpClient.patch(`/contacto-emergencia/id/${id}`, formState)
      await obtenerContactosEmergencia()
      return true
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'No se pudo editar el contacto', html: mensajeError(error) })
      return false
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
  /** Pide confirmación y da de baja el contacto. Si falla, avisa con el motivo */
  const deleteContactoEmergenciaxID = async(id:number)=>{
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar el contacto?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    })
    if (!isConfirmed) return
    try {
      await httpClient.delete(`/contacto-emergencia/id/${id}`)
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'No se pudo eliminar el contacto', html: mensajeError(error) })
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
