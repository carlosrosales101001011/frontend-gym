import { useEffect, useState } from 'react';
import { ButtonCR } from '@/components/Button/ButtonCR';
import { AppComentario } from '@/components/Comentario/AppComentario';
import { useComentarioStore } from '@/components/Comentario/useComentarioStore';
import { useForm } from '@/hook/useForm';
import { initialComentario, type ComentarioProps } from '@/components/Comentario/comentarioSlice';
import { InputCR } from '@/components/TextFields/InputCR';
import type { RootState } from '@/stores/Store';
import { useSelector } from 'react-redux';
import { useSesionStore } from '@/hook/useSesionStore';
import { AvatarCirculo } from '@/components/Avatar/AvatarCirculo';
import { ajusteAvatarUltimo } from '@/components/Avatar/encuadreFoto';
import { getBlobUrl } from '@/helpers/blobUrl';

/** Tamaño de las fotos de los comentarios (px) */
const TAMANO_AVATAR = 55
type props = {
    uid_location: string;
}
export const ContainerComentarios = ({uid_location}:props) => {
    const { obtenerComentariosxUIDLOCATION, postComentario, loading, patchComentario } = useComentarioStore()
    const { comentarios } = useSelector((state: RootState)=>state.COMENTARIO)
    // Quien comenta es el usuario logueado: su nombre y su foto van junto al formulario
    const { usuario, nombreUsuario, obtenerUsuarioSesion } = useSesionStore()
    useEffect(() => {
      if (!usuario) obtenerUsuarioSesion()
    }, [])
    const [editingId, setEditingId] = useState<number | null>(null)
    const { register, formState: { errors }, handleSubmit, getValues, reset}  = useForm<ComentarioProps>({mode: 'onSubmit', defaultValues: initialComentario})
    useEffect(() => {
      obtenerComentariosxUIDLOCATION(uid_location)
    }, [uid_location])
    
    const onSubmitComentario = ()=>{
      const { uid_location:uid_lok, fecha_created, fecha_updated, nombre_usuario, id, usuario, ...val } = getValues() as ComentarioProps
      console.log({uid_lok, fecha_created, fecha_updated, nombre_usuario, id, usuario});
      postComentario({
        uid_location,
        ...val
      }, uid_location)
      reset()
    }
    const onUpdateComentario = (comentario:string, id:number)=>{
      patchComentario(comentario, uid_location, id)
    }
  return (
    <div>
      <div className="d-flex flex-row" style={{width: '100%'}}>
        <AvatarCirculo
          src={getBlobUrl(usuario?.avatar?.url_avatar_ultimo)}
          alt={nombreUsuario}
          ajuste={ajusteAvatarUltimo(usuario?.avatar)}
          tamano={TAMANO_AVATAR}
        />
        <div className="mx-2 w-100">
          <span style={{fontSize: '15px'}}>
              {nombreUsuario}
          </span>
          <div className='mt-3'>
            <form onSubmit={handleSubmit(onSubmitComentario)}>
              <InputCR {...register("comentario", {
                required: "Este campo es obligatorio"
              })} label="Comentario" type='text-area' messageErrors={errors.comentario?.message}/>
              <ButtonCR variant="primary" label={'Comentar'} onClick={()=>onSubmitComentario()}/>
            </form>
          </div>
        </div>
      </div>
      <div>
        {
          loading? (
            <>LOADING</>
          ): (
          <>
          {
          comentarios?.map(m=>{
              return (
                <AppComentario  
    isEditing={editingId === m.id}
    onOpenEdit={() => setEditingId(m.id)}
    onCloseEdit={() => setEditingId(null)} id={m.id} onUpdated={onUpdateComentario} comentario={m.comentario} fecha_created={m.fecha_created} fecha_update={m.fecha_updated}
    nombre_usuario={`${m.usuario?.nombres ?? ''} ${m.usuario?.apellidos ?? ''}`.trim()}
    avatar={getBlobUrl(m.avatar_usuario?.url_avatar_ultimo)}
    ajusteAvatar={ajusteAvatarUltimo(m.avatar_usuario)} />
              )
            })
          }
          </>
          )
        }
        {/* {
          comentarios.map(m=>{
            return (
              <AppComentario comentario={m.comentario} fecha_created={m.fecha_created} fecha_update={m.fecha_updated} nombre_usuario={m.nombre_usuario} />
            )
          })
        } */}
      </div>
    </div>
  )
}
