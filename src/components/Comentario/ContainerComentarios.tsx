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
import { formatDate } from '@/helpers/FormatDate';

/** "dd/mm/yyyy hh:mm" de una fecha del backend ('' si no viene) */
const fechaHora = (fecha?: string) => fecha ? formatDate(new Date(fecha), 'yyyy-mm-dd', 'dd/mm/yyyy hh:mm') : ''

/** Tamaño de las fotos de los comentarios (px) */
const TAMANO_AVATAR = 55
type props = {
    uid_location: string;
}
export const ContainerComentarios = ({uid_location}:props) => {
    const { obtenerComentariosxUIDLOCATION, postComentario, loading, patchComentario, eliminarComentario } = useComentarioStore()
    const { comentarios } = useSelector((state: RootState)=>state.COMENTARIO)
    // Quien comenta es el usuario logueado: su nombre y su foto van junto al formulario
    const { usuario, nombreUsuario, obtenerUsuarioSesion } = useSesionStore()
    useEffect(() => {
      if (!usuario) obtenerUsuarioSesion()
    }, [])
    const [editingId, setEditingId] = useState<number | null>(null)
    const { register, formState: { errors }, handleSubmit, reset}  = useForm<ComentarioProps>({mode: 'onSubmit', defaultValues: initialComentario})
    useEffect(() => {
      obtenerComentariosxUIDLOCATION(uid_location)
    }, [uid_location])
    
    // Solo se envían el texto y dónde va: el autor lo pone el backend con el token
    const onSubmitComentario = async ({ comentario }: ComentarioProps)=>{
      const publicado = await postComentario({ uid_location, comentario: comentario.trim() }, uid_location)
      if (publicado) reset()
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
                required: "Escribe el comentario",
                validate: (valor) => !!String(valor ?? '').trim() || "Escribe el comentario",
                maxLength: { value: 450, message: "Máximo 450 caracteres" },
              })} label="Comentario" type='text-area' messageErrors={errors.comentario?.message}/>
              <ButtonCR variant="primary" label={'Comentar'} type="submit"/>
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
    onCloseEdit={() => setEditingId(null)} id={m.id} onUpdated={onUpdateComentario} comentario={m.comentario}
    // Editar y eliminar: solo su autor o un super usuario (el backend también lo valida al eliminar)
    onEliminar={m.id_user === usuario?.id || usuario?.is_super_user ? (id) => eliminarComentario(id, uid_location) : undefined} fecha_created={fechaHora(m.createdAt)}
    // Solo si se editó después de creado
    fecha_update={m.updatedAt && m.updatedAt !== m.createdAt ? `Editado ${fechaHora(m.updatedAt)}` : ''}
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
