import { TabsCR } from '@/components/Tabs/TabsCR'
import { TabCR } from '@/components/Tabs/TabCR'
import { useSearchParams } from 'react-router-dom'
import { TabComentarios } from '@/pages/PerfilColaborador/Tabs/TabComentarios/TabComentarios'
import { TabArchivos } from '@/pages/PerfilColaborador/Tabs/TabArchivos/TabArchivos'
import { TabDatosPersonales } from '@/pages/PerfilColaborador/Tabs/TabDatosPersonales/TabDatosPersonales'
import { TabContratosLaborales } from '@/pages/PerfilColaborador/Tabs/TabContratosLaborales/TabContratosLaborales'
import { TabContactoEmergencia } from '@/pages/PerfilColaborador/Tabs/TabContactoEmergencia/TabContactoEmergencia'
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
        className="mb-3 card-mode-actual"
        activeKey={activeTab}
        onSelect={handleSelect}
    >
      <TabCR eventKey="datos-personales" title="Datos personales">
        <TabDatosPersonales/>
      </TabCR>
      <TabCR eventKey="datos-laborales" title="Contratos laborales">
        <TabContratosLaborales/>
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
      <TabCR eventKey="acceso-sistema" title="Acceso al sistema">
        <TabArchivos/>
      </TabCR>
    </TabsCR>
  )
}
