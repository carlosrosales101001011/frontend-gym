import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import httpClient from "@/common/helpers/httpClient";
import { mensajeError } from "@/helpers/mensajeError";
import { onSetDataColaborador, type ColaboradorProps } from "@/pages/PerfilCliente/store/perfilColaboradorSlice";
import { useState } from "react";
import { onSetContratosColaborador } from "@/pages/PerfilCliente/store/contratoColaboradorSlice";

/** Id de tipo de persona "cliente" */
const ID_TIPO_CLIENTE = 2

/** Campos del formulario "Datos personales" que se envían (el backend rechaza los label_*, fecha_registro, etc.) */
const CAMPOS_EDITABLES = [
  'nombres', 'apellido_paterno', 'apellido_materno', 'fecha_nacimiento', 'telefono', 'numero_documento',
  'direccion', 'email_personal', 'email_corporativo',
  'id_genero', 'id_estado_civil', 'id_tipo_documento', 'id_nacionalidad', 'id_distrito',
] as const

/** Los selects devuelven texto ("3"): el backend los pide como número */
const CAMPOS_NUMERICOS: readonly string[] = ['id_genero', 'id_estado_civil', 'id_tipo_documento', 'id_nacionalidad', 'id_distrito']

/** Solo los campos editables; los ids como número (un select vacío no se envía) */
const armarPayload = (datos: Partial<ColaboradorProps>) =>
  Object.fromEntries(
    CAMPOS_EDITABLES
      .filter((campo) => datos[campo] !== undefined)
      .filter((campo) => !CAMPOS_NUMERICOS.includes(campo) || (datos[campo] !== '' && datos[campo] !== null))
      .map((campo) => [campo, CAMPOS_NUMERICOS.includes(campo) ? Number(datos[campo]) : datos[campo]])
  )

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
     * Avisa si se guardó o por qué no. Devuelve true si se guardó.
     */
    const actualizarDatosPersonales = async(id:number, uid_person:string, datos:Partial<ColaboradorProps>)=>{
        setloading(true)
        try {
            await httpClient.patch(`/persona/id_tipo/${ID_TIPO_CLIENTE}/id/${id}`, armarPayload(datos));
            await obtenerDataColaboradorxUID(uid_person);
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
    obtenerDataColaboradorxUID,
    loading,
  }
}
