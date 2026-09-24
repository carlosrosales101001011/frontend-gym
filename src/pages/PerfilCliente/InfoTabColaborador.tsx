import { Tab, Tabs } from 'react-bootstrap'
import { TabDatosPersonales } from '@/pages/PerfilCliente/TabDatosPersonales'
import { TabArchivos } from '@/pages/PerfilCliente/TabArchivos'
import { TabComentarios } from '@/pages/PerfilCliente/TabComentarios'
import { AppAccesoSistema } from '@/pages/PerfilCliente/AccesoSistema/AppAccesoSistema'
import { TabContactoEmergencia } from '@/pages/PerfilCliente/ContactoEmergencia/TabContactoEmergencia'
import { useSearchParams } from 'react-router-dom'
export const InfoTabColaborador = () => {
  
    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab = searchParams.get('view-tab') || 'datos-personales';

    const handleSelect = (key: string | null) => {
        if (!key) return;

        setSearchParams(prev => {
            prev.set('view-tab', key);
            return prev;
        });
    };

  return (
    <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        activeKey={activeTab}
        onSelect={handleSelect}
    >
      <Tab eventKey="datos-personales" title="Datos personales">
          <TabDatosPersonales/>
      </Tab>
      <Tab eventKey="membresia" title="Membresias">
        <TabArchivos/>
      </Tab>
      <Tab eventKey="acceso-sistema" title="Ventas">
        <AppAccesoSistema/>
      </Tab>
      <Tab eventKey="archivos" title="Archivos">
        <TabArchivos/>
      </Tab>
      <Tab eventKey="comentarios" title="Comentarios">
        <TabComentarios/>
      </Tab>
      <Tab eventKey="contacto-emergencia" title="Contactos de emergencia">
        <TabContactoEmergencia/>
      </Tab>
    </Tabs>
  )
}
