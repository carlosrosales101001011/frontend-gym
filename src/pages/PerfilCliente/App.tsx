import { useParams } from 'react-router-dom'
import noAvatar from '@/assets/img/user-no-avatar.jpg'
import { InfoTabColaborador } from '@/pages/PerfilCliente/InfoTabColaborador'
import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb';
import { useEffect } from 'react';
import { usePerfilColaboradorStore } from '@/pages/PerfilCliente/usePerfilColaboradorStore';
import { useSelector } from 'react-redux';
import type { RootState } from '@/stores/Store';

export const App = () => {
  const { uid_cliente } = useParams<{ uid_cliente: string }>();
  const { obtenerDataColaboradorxUID } = usePerfilColaboradorStore()
  const {colaborador} = useSelector((state: RootState)=>state.PERFIL_COLABORADOR)
  useEffect(() => {
    obtenerDataColaboradorxUID(uid_cliente||'')
  }, [uid_cliente])
  if (colaborador.id===0)return <>LOADING</>
  return (
    <>
    <PageBreadCumb title='Perfil del cliente'/>
    <div className="view-h-100 d-flex">
      <div className="p-3" style={{height: '100%', width: '340px'}} >
        <div className='d-flex flex-column card p-3 card-mode-actual' style={{height: '100%'}}>
          <img src={noAvatar} className='mx-auto mb-3' style={{height: '80px'}}/>
          <div className='my-1 text-center'>
            <span className='fs-4 color-mode-actual'>{colaborador.nombres} {colaborador.apellido_paterno} {colaborador.apellido_materno}</span>
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
      <div className=" p-3" style={{height: '100%', width: '100%'}} >
        <div className='d-flex flex-column card p-3 card-mode-actual'  style={{height: '100%'}}>
          <InfoTabColaborador />
        </div>
      </div>
    </div>
    </>
  )
}
