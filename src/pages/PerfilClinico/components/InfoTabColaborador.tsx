import { TabsCR } from '@/components/Tabs/TabsCR'
import { TabCR } from '@/components/Tabs/TabCR'
import { TabDatosPersonales } from '../Tabs/TabDatosPersonales'
import { TabContactoEmergencia } from '../Tabs/TabContactoEmergencia'
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
        // Títulos de las pestañas en un card (en fila: .card es flex-column; fijo arriba al hacer scroll) y el contenido en otro
        classNameLista='card card-mode-actual p-2 flex-row position-sticky top-0 z-3'
        classNamePanel='card card-mode-actual p-3'
    >
      <TabCR eventKey="datos-nutricionales" title="Datos nutricionales">
          <TabDatosPersonales/>
      </TabCR>
      <TabCR eventKey="evaluacion-corporal" title="Evaluación corporal">
          <TabDatosPersonales/>
      </TabCR>
      <TabCR eventKey="historia-alimentaria" title="Historia alimentaria">
        <TabContactoEmergencia/>
      </TabCR>
      <TabCR eventKey="reporte-nutricionista" title="Reporte nutricionista">
        <TabContactoEmergencia/>
      </TabCR>
      <TabCR eventKey="plan-nutricional" title="Plan nutricional">
        <TabContactoEmergencia/>
      </TabCR>
    </TabsCR>
  )
}
