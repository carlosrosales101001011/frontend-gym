import { TabsCR } from '@/components/Tabs/TabsCR'
import { TabCR } from '@/components/Tabs/TabCR'
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
    <TabsCR
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        activeKey={activeTab}
        onSelect={handleSelect}
    >
      <TabCR eventKey="datos-personales" title="Datos personales">
          <TabDatosPersonales/>
      </TabCR>
      <TabCR eventKey="membresia" title="Membresias">
        <TabArchivos/>
      </TabCR>
      <TabCR eventKey="acceso-sistema" title="Ventas">
        <AppAccesoSistema/>
      </TabCR>
      <TabCR eventKey="archivos" title="Archivos">
        <TabArchivos/>
      </TabCR>
      <TabCR eventKey="comentarios" title="Comentarios">
        <TabComentarios/>
      </TabCR>
      <TabCR eventKey="contacto-emergencia" title="Contactos de emergencia">
        <TabContactoEmergencia/>
      </TabCR>
    </TabsCR>
  )
}
