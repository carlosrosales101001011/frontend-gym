import { useEffect } from "react"
import IconCR from "@/components/Icons/IconCR"
import { ButtonCR } from "@/components/Button/ButtonCR"
import { InputCR } from "@/components/TextFields/InputCR";
import { useForm } from "@/hook/useForm";
import {  type ComentarioProps } from "@/components/Comentario/comentarioSlice";
import { useComentarioStore } from "@/components/Comentario/useComentarioStore";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/Store";
type props = {
    nombre_usuario: string;
    fecha_update: string;
    comentario:string;
    fecha_created: string;
    id:number;
    isEditing: boolean;          // 👈 viene del padre
    onOpenEdit: () => void;      // 👈 viene del padre
    onCloseEdit: () => void;     // 👈 viene del padre
    onUpdated: (comentario:string, id:number)=>void;
}
export const AppComentario = ({nombre_usuario, fecha_update, fecha_created, comentario, id, onUpdated, isEditing, onOpenEdit, onCloseEdit}:props) => {
    const { obtenerComentarioxID } = useComentarioStore()
    const { comentario:comentarioxID } = useSelector((state: RootState)=>state.COMENTARIO)
    useEffect(() => {
        if (isEditing) {
        obtenerComentarioxID(id)
        }
    }, [id, isEditing])
        const { register, formState: { errors }, handleSubmit, getValues, reset}  = useForm<ComentarioProps>({mode: 'onSubmit', defaultValues: {...comentarioxID}})
        // Precarga el formulario cuando llega el dato
    useEffect(() => {
        if (comentarioxID && isEditing) {
        reset({ ...comentarioxID })
        }
    }, [comentarioxID, isEditing])
    const onUpdateComentario = ()=>{
        onUpdated(getValues('comentario') || '', id)
        onCloseEdit()
    }
  return (
    <div className="d-flex flex-row w-100" style={{width: '100%'}}>
        <div className="">
            <span className="w-50 rounded-5">
                <img className="" style={{width: '55px', borderRadius: '50%'}}  src="https://archivosluroga.blob.core.windows.net/avatarclientes/AVATAR-1769827631140.PNG"></img>
            </span>
        </div>
        <div className="mx-2 w-100">
            <div className="fw-bold">
                <span style={{fontSize: '15px'}}>
                    {nombre_usuario}
                </span>
                <span className="text-secondary mx-2" style={{fontSize: '13px'}}>
                    {fecha_update}
                    <br/>
                    {fecha_created}
                </span>
                {
                    !isEditing && (
                        <span>
                            <span onClick={onOpenEdit}>
                                <IconCR name="edit" size={12} className=" mx-1" />
                            </span>
                            <IconCR name="trash" size={12} className=" mx-1"/>
                        </span>
                    )
                }
            </div>
            {
                isEditing ?(
                    
                    <div className='mt-3'>
                    <form onSubmit={handleSubmit(onUpdateComentario)}>
                        <InputCR {...register("comentario", {
                        required: "Este campo es obligatorio"
                        })} label="Comentario" type='text-area' messageErrors={errors.comentario?.message}/>
                        <ButtonCR variant="primary" label={'Editar'} type="submit"/>
                        <ButtonCR variant="link" label={'Cancelar'} onClick={onCloseEdit}/>
                    </form>
                    </div>
                ):(
                    <div className="my-3 bg-body-secondary p-2 rounded-2 w-100">
                        {comentario}
                    </div>
                )
            }
        </div>
    </div>
  )
}
