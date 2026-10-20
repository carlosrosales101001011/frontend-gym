import { TabsCR } from '@/components/Tabs/TabsCR'
import { TabCR } from '@/components/Tabs/TabCR'
import { useTabsHistorial } from '@/hook/useTabsHistorial';
import IconCR, { type IconName } from '@/components/Icons/IconCR';
import { TabDatosPersonales } from './Tabs/TabDatosPersonales/TabDatosPersonales';
import { TabContratosLaborales } from './Tabs/TabContratosLaborales/TabContratosLaborales';
import { TabArchivos } from './Tabs/TabArchivos/TabArchivos';
import { TabComentarios } from './Tabs/TabComentarios/TabComentarios';
import { TabContactoEmergencia } from './Tabs/TabContactoEmergencia/TabContactoEmergencia';
import { TabAccesoSistema } from './Tabs/TabAccesoSistema/TabAccesoSistema';

/** Título de pestaña con ícono (toma el color del texto de la pestaña) */
const TituloTab = ({ icono, texto }: { icono: IconName, texto: string }) => (
  <span className="d-inline-flex align-items-center gap-2">
    <IconCR name={icono} size={16} className="" />
    {texto}
  </span>
)

export const CardContenedor = () => {
  // Pestaña en la URL (?view-tab=); volver a una ya vista retrocede en el historial en vez de agregar pasos
  const { activa: activeTab, seleccionar: handleSelect } = useTabsHistorial('view-tab', 'datos-personales')

  return (
    <div>
      <TabsCR
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        activeKey={activeTab}
        onSelect={handleSelect}
      >
        <TabCR eventKey="datos-personales" title={<TituloTab icono="user" texto="Datos" />}>
          <TabDatosPersonales activo={activeTab === 'datos-personales'}/>
        </TabCR>
        <TabCR eventKey="datos-laborales" title={<TituloTab icono="archivo" texto="Contratos laborales" />}>
          <TabContratosLaborales/>
        </TabCR>
        <TabCR eventKey="archivos" title={<TituloTab icono="carpeta" texto="Archivos" />}>
          <TabArchivos activo={activeTab === 'archivos'}/>
        </TabCR>
        <TabCR eventKey="comentarios" title={<TituloTab icono="comentarios" texto="Comentarios" />}>
          <TabComentarios activo={activeTab === 'comentarios'}/>
        </TabCR>
        <TabCR eventKey="contacto-emergencia" title={<TituloTab icono="contactoTelefono" texto="Emergencia" />}>
          <TabContactoEmergencia activo={activeTab === 'contacto-emergencia'}/>
        </TabCR>
        <TabCR eventKey="acceso-sistema" title={<TituloTab icono="lock" texto="Acceso al sistema" />}>
          <TabAccesoSistema/>
        </TabCR>
      </TabsCR>
    </div>
  )
}
