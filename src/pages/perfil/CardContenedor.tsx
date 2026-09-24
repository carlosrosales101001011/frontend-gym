import { Tab, Tabs } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom';

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
      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        activeKey={activeTab}
        onSelect={handleSelect}
      >
        <Tab eventKey="datos-personales" title="Datos personales">
        </Tab>
        <Tab eventKey="membresia" title="Membresias">
        </Tab>
        <Tab eventKey="acceso-sistema" title="Ventas">
        </Tab>
        <Tab eventKey="archivos" title="Archivos">
        </Tab>
        <Tab eventKey="comentarios" title="Comentarios">
        </Tab>
        <Tab eventKey="contacto-emergencia" title="Contactos de emergencia">
        </Tab>
      </Tabs>
    </div>
  )
}
