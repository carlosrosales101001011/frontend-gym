import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hook/useAuth';
export const PublicGuard = () => {

  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={"/home"} replace/>
  }
  return <Outlet />;
}
