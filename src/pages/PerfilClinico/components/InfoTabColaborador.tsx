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
        // Títulos de las pestañas sin fondo, en fila, fijos debajo de las fechas al bajar;
        // el contenido en otro card, sin scroll propio
        classNameLista='p-2 d-flex flex-row perfil-clinico__tabs-fija'
        classNamePanel='card card-mode-actual p-3'
    >
      <TabCR eventKey="datos-generales" title="Datos generales">
          <TabDatosNutricionales/>
      </TabCR>
      <TabCR eventKey="evaluacion-corporal" title="Evaluación corporal">
          <TabEvaluacionCorporal/>
      </TabCR>
      <TabCR eventKey="antecedentes" title="Antecedentes">
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
