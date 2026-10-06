import { TabsCR } from '@/components/Tabs/TabsCR'
import { TabCR } from '@/components/Tabs/TabCR'
import { useTabsHistorial } from '@/hook/useTabsHistorial'
import IconCR, { type IconName } from '@/components/Icons/IconCR'
import { TabDatosColaborador } from './TabsUsuario/TabDatosColaborador'
import { TabDatosSistema } from './TabsUsuario/TabDatosSistema'
import { TabModulosUsuario } from './TabsUsuario/TabModulosUsuario'
import { TabArchivosColaborador, TabComentariosColaborador, TabEmergenciaColaborador } from './TabsUsuario/TabsColaborador'

/** Título de pestaña con ícono (toma el color del texto de la pestaña) */
const TituloTab = ({ icono, texto }: { icono: IconName, texto: string }) => (
  <span className="d-inline-flex align-items-center gap-2">
    <IconCR name={icono} size={16} className="" />
    {texto}
  </span>
)

/** Pestañas del perfil del usuario; cada una se monta solo mientras está activa */
export const CardContenedor = () => {
  // Pestaña en la URL (?view-tab=); volver a una ya vista retrocede en el historial en vez de agregar pasos
  const { activa, seleccionar } = useTabsHistorial('view-tab', 'datos')

  return (
    <TabsCR id="perfil-usuario-tabs" activeKey={activa} onSelect={seleccionar}>
      <TabCR eventKey="datos" title={<TituloTab icono="user" texto="Datos" />}>
        {activa === 'datos' && <TabDatosColaborador />}
      </TabCR>
      <TabCR eventKey="sistema" title={<TituloTab icono="lock" texto="Datos Sistema" />}>
        {activa === 'sistema' && <TabDatosSistema />}
      </TabCR>
      <TabCR eventKey="modulos" title={<TituloTab icono="modulos" texto="Módulos" />}>
        {activa === 'modulos' && <TabModulosUsuario />}
      </TabCR>
      <TabCR eventKey="archivos" title={<TituloTab icono="carpeta" texto="Archivos" />}>
        {activa === 'archivos' && <TabArchivosColaborador />}
      </TabCR>
      <TabCR eventKey="comentarios" title={<TituloTab icono="comentarios" texto="Comentarios" />}>
        {activa === 'comentarios' && <TabComentariosColaborador />}
      </TabCR>
      <TabCR eventKey="contacto-emergencia" title={<TituloTab icono="contactoTelefono" texto="Emergencia" />}>
        {activa === 'contacto-emergencia' && <TabEmergenciaColaborador />}
      </TabCR>
    </TabsCR>
  )
}
