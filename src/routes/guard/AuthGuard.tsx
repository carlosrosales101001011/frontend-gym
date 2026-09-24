import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hook/useAuth';
export const AuthGuard = () => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace/>
  }
  return (
    <>
    <Outlet />
    </>
  );
};