import { useParams } from 'react-router-dom'
import noAvatar from '@/assets/img/user-no-avatar.jpg'
import { InfoTabColaborador } from './components/InfoTabColaborador'
import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb';
import { useEffect } from 'react';
import { usePerfilColaboradorStore } from './hook/usePerfilColaboradorStore';
import { useSelector } from 'react-redux';
import type { RootState } from '@/stores/Store';

export const App = () => {
  const { uid_person } = useParams<{ uid_person: string }>();
  const { obtenerDataColaboradorxUID } = usePerfilColaboradorStore()
  const {colaborador} = useSelector((state: RootState)=>state.PERFIL_COLABORADOR)
  useEffect(() => {
    obtenerDataColaboradorxUID(uid_person||'')
  }, [uid_person])
  if (colaborador.id===0)return <>LOADING</>
  return (
    <>
    <PageBreadCumb title='Perfil del paciente'/>
    {/* Tarjeta con la foto arriba, a todo el ancho; las pestañas debajo ocupan el resto del alto */}
    <div className="view-h-100 d-flex flex-column">
      <div className="p-3 pb-0">
        <div className='card p-2 card-mode-actual d-flex flex-row flex-wrap align-items-center gap-4'>
          <img src={noAvatar} style={{height: '60px'}}/>
          <span className='fs-4 color-mode-actual'>{colaborador.nombres} {colaborador.apellido_paterno} {colaborador.apellido_materno}</span>
          <div>
            <div className='fw-bold'>Email:</div>
            <span className='text-break'>{`${colaborador.email_personal}`} </span>
          </div>
          <div>
            <div className='fw-bold'>Telefono:</div>
            <span className='text-break'>{colaborador.telefono}</span>
          </div>
        </div>
      </div>
      <div className="p-3 flex-grow-1 overflow-auto" style={{minHeight: 0}}>
        <InfoTabColaborador />
      </div>
    </div>
    </>
  )
}
