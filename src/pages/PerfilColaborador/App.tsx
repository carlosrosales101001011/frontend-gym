import { useParams } from 'react-router-dom'
import noAvatar from '@/assets/img/user-no-avatar.jpg'
import { InfoTabColaborador } from '@/pages/PerfilColaborador/InfoTabColaborador'
import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb';
import { useEffect } from 'react';
import { usePerfilColaboradorStore } from '@/pages/PerfilColaborador/usePerfilColaboradorStore';
import { useSelector } from 'react-redux';
import type { RootState } from '@/stores/Store';

export const App = () => {
  const { uid_colaborador } = useParams<{ uid_colaborador: string }>();
  const { obtenerDataColaboradorxUID } = usePerfilColaboradorStore()
  const {colaborador} = useSelector((state: RootState)=>state.PERFIL_COLABORADOR)
  useEffect(() => {
    obtenerDataColaboradorxUID(uid_colaborador||'')
  }, [uid_colaborador])
  if (colaborador.id===0)return <>LOADING</>
  return (
    <>
    <PageBreadCumb title='Perfil del colaborador'/>
    <div className="view-h-100 p-3 d-flex">
      <div className="p-3" style={{height: '100%', width: '340px'}} >
        <div className='d-flex flex-column card p-3 card-mode-actual' style={{height: '100%'}}>
          <img src={noAvatar} className='mx-auto mb-3' style={{height: '80px'}}/>
          <div className='my-1 text-center'>
            <div className='fs-4 color-mode-actual'>{colaborador.nombres} {colaborador.apellido_paterno} {colaborador.apellido_materno}</div>
          </div>
          <div className='my-3'>
            <div className='fw-bold'>Cargo:</div>
            <span className=''>Desarrollador de sistemas, Administrador</span>
          </div>
          <div className='my-3'>
            <div className='fw-bold'>Email:</div>
            <span className='text-break'>{`${colaborador.email_personal}`} </span>
          </div>
          <div className='my-3'>
            <div className='fw-bold'>Telefono:</div>
            <span className='text-break'>{colaborador.telefono}</span>
          </div>
        </div>
      </div>
      <div className="p-3" style={{height: '100%', width: '100%'}} >
        <div className='d-flex flex-column card card-mode-actual'  style={{height: '100%'}}>
          <InfoTabColaborador />
        </div>
      </div>
    </div>
    </>
  )
}
