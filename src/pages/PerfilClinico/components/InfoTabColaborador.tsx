import { TabsCR } from '@/components/Tabs/TabsCR'
import { TabCR } from '@/components/Tabs/TabCR'
import { TabDatosNutricionales } from '../Tabs/TabDatosNutricionales/TabDatosNutricionales'
import { TabEvaluacionCorporal } from '../Tabs/TabEvaluacionCorporal/TabEvaluacionCorporal'
import { TabHistoriaAlimentaria } from '../Tabs/TabHistoriaAlimentaria/TabHistoriaAlimentaria'
import { TabReporteNutricionista } from '../Tabs/TabReporteNutricionista/TabReporteNutricionista'
import { TabPlanNutricional } from '../Tabs/TabPlanNutricional/TabPlanNutricional'
import { useSearchParams } from 'react-router-dom'
export const InfoTabColaborador = () => {
  
    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab = searchParams.get('view-tab') || 'datos-nutricionales';

    const handleSelect = (key: string | null) => {
        if (!key) return;

        setSearchParams(prev => {
            prev.set('view-tab', key);
            return prev;
        });
    };

  return (
    <TabsCR
        defaultActiveKey="datos-nutricionales"
        id="uncontrolled-tab-example"
        activeKey={activeTab}
        onSelect={handleSelect}
        // Títulos de las pestañas en un card (en fila: .card es flex-column; fijo arriba al hacer scroll) y el contenido en otro
        classNameLista='card card-mode-actual p-2 flex-row position-sticky top-0 z-3'
        classNamePanel='card card-mode-actual p-3'
    >
      <TabCR eventKey="datos-nutricionales" title="Datos nutricionales">
          <TabDatosNutricionales/>
      </TabCR>
      <TabCR eventKey="evaluacion-corporal" title="Evaluación corporal">
          <TabEvaluacionCorporal/>
      </TabCR>
      <TabCR eventKey="historia-alimentaria" title="Historia alimentaria">
        <TabHistoriaAlimentaria/>
      </TabCR>
      <TabCR eventKey="reporte-nutricionista" title="Reporte nutricionista">
        <TabReporteNutricionista/>
      </TabCR>
      <TabCR eventKey="plan-nutricional" title="Plan nutricional">
        <TabPlanNutricional/>
      </TabCR>
    </TabsCR>
  )
}
