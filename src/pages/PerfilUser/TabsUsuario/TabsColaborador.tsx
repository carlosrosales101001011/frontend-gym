import { AppArchivos } from '@/components/Archivos/AppArchivos'
import { ContainerComentarios } from '@/components/Comentario/ContainerComentarios'
import { AppContactoEmergencia } from '@/components/GestionContactoEmergencia/AppContactoEmergencia'
import { usePerfilUsuarioContexto } from '../hook/perfilUsuarioContexto'
import { SinColaborador } from './SinColaborador'

/*
 * Archivos, comentarios y contactos de emergencia del colaborador vinculado al usuario, con los uid_* de su persona.
 * key: al cambiar de colaborador el componente se monta de nuevo.
 */

const SinUid = ({ texto }: { texto: string }) => <p className="small opacity-75 m-3">{texto}</p>

export const TabArchivosColaborador = () => {
  const colaborador = usePerfilUsuarioContexto().perfil?.colaborador
  if (!colaborador) return <SinColaborador />
  if (!colaborador.uid_archivos) return <SinUid texto="Este colaborador no tiene archivos habilitados." />
  return <div className="m-3"><AppArchivos key={colaborador.uid_archivos} uid_location={colaborador.uid_archivos} /></div>
}

export const TabComentariosColaborador = () => {
  const colaborador = usePerfilUsuarioContexto().perfil?.colaborador
  if (!colaborador) return <SinColaborador />
  if (!colaborador.uid_comentario) return <SinUid texto="Este colaborador no tiene comentarios habilitados." />
  return <div className="m-3"><ContainerComentarios key={colaborador.uid_comentario} uid_location={colaborador.uid_comentario} /></div>
}

export const TabEmergenciaColaborador = () => {
  const colaborador = usePerfilUsuarioContexto().perfil?.colaborador
  if (!colaborador) return <SinColaborador />
  if (!colaborador.uid_contactoEmergencia) return <SinUid texto="Este colaborador no tiene contactos de emergencia habilitados." />
  return <div className="m-3"><AppContactoEmergencia key={colaborador.uid_contactoEmergencia} uid_location={colaborador.uid_contactoEmergencia} /></div>
}
