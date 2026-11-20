import { useParams } from 'react-router-dom'
import { InfoTabColaborador } from './components/InfoTabColaborador'
import { FilaFechas } from './components/FilaFechas'
import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb';
import { useEffect, useState, type CSSProperties } from 'react';
import { usePerfilColaboradorStore } from './hook/usePerfilColaboradorStore';
import { usePerfilNutricional } from './hook/usePerfilNutricional';
import { useSelector } from 'react-redux';
import type { RootState } from '@/stores/Store';

export const App = () => {
  const { uid_person } = useParams<{ uid_person: string }>();
  const { obtenerDataColaboradorxUID } = usePerfilColaboradorStore()
  const {colaborador} = useSelector((state: RootState)=>state.PERFIL_COLABORADOR)
  useEffect(() => {
    obtenerDataColaboradorxUID(uid_person||'')
  }, [uid_person])

  // Fechas del perfil nutricional del paciente (las usan la fila de fechas y todas las pestañas)
  const { cargar: cargarPerfilNutricional } = usePerfilNutricional()
  useEffect(() => {
    if (colaborador.id) cargarPerfilNutricional(colaborador.id)
  }, [colaborador.id])

  // Alto de la fila de fechas fija: los títulos de las pestañas se pegan justo debajo
  const [filaFechas, setFilaFechas] = useState<HTMLDivElement | null>(null)
  const [altoFilaFechas, setAltoFilaFechas] = useState(0)
  useEffect(() => {
    if (!filaFechas) return
    const observador = new ResizeObserver(() => setAltoFilaFechas(filaFechas.offsetHeight))
    observador.observe(filaFechas)
    return () => observador.disconnect()
  }, [filaFechas])

  if (colaborador.id===0)return <>LOADING</>
  const nombreCompleto = `${colaborador.nombres} ${colaborador.apellido_paterno} ${colaborador.apellido_materno}`.trim()
  return (
    <>
    {/* Topbar: [módulo] > Gestion de pacientes > nombre y apellidos del paciente */}
    <PageBreadCumb title={`Gestion de pacientes > ${nombreCompleto}`}/>
    {/* Un solo scroll para toda la vista: las fechas y los títulos de las pestañas quedan fijos */}
    <div className="view-h-100 overflow-auto" style={{ '--alto-fila-fechas': `${altoFilaFechas}px` } as CSSProperties}>
      {/* Fecha seleccionada, arriba de los tabs: aplica a todos */}
      <div ref={setFilaFechas} className="perfil-clinico__fechas-fija mx-3">
        <FilaFechas />
      </div>
      <div className="p-3">
        <InfoTabColaborador />
      </div>
    </div>
    </>
  )
}
