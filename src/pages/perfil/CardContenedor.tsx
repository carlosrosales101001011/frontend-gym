import { TabsCR } from '@/components/Tabs/TabsCR'
import { TabCR } from '@/components/Tabs/TabCR'
import { useSearchParams } from 'react-router-dom';
import { TabComentarios } from './Tabs/TabComentarios/TabComentarios';
import { TabContactoEmergencia } from './Tabs/TabContactoEmergencia/TabContactoEmergencia';
import { TabDatosPersonales } from '../PerfilCliente/TabDatosPersonales';
import { TabMembresia } from './Tabs/TabMembresia/TabMembresia';
import { TabVentas } from './Tabs/TabVentas/TabVentas';

export const CardContenedor = () => {
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
    <div>
      <TabsCR
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        activeKey={activeTab}
        onSelect={handleSelect}
      >
        <TabCR eventKey="datos-personales" title="Datos personales">
          <TabDatosPersonales activo={activeTab === 'datos-personales'}/>
        </TabCR>
        <TabCR eventKey="membresia" title="Membresias">
          <TabMembresia activo={activeTab === 'membresia'}/>
        </TabCR>
        <TabCR eventKey="ventas" title="Ventas">
          <TabVentas activo={activeTab === 'ventas'}/>
        </TabCR>
        <TabCR eventKey="archivos" title="Archivos">
        </TabCR>
        <TabCR eventKey="comentarios" title="Comentarios">
          <TabComentarios/>
        </TabCR>
        <TabCR eventKey="contacto-emergencia" title="Contactos de emergencia">
          <TabContactoEmergencia/>
        </TabCR>
      </TabsCR>
    </div>
  )
}
