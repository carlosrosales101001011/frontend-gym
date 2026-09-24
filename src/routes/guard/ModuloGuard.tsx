import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useModuloStore } from '@/hook/useModuloStore';
export const ModuloGuard = () => {
  const { modulo } = useParams<{ modulo: string }>();
  const { modulos } = useModuloStore();
  console.log({modulos});
  
  if (!modulo || !modulos.find(a=>a==modulo)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};