import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '@/hook/useAuth';
import { VerticalLayout } from '@/layouts/VerticalLayout';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/stores/Store';
import { usePermisosStore } from '@/hook/usePermisosStore';
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay';
export const ProtectedRoutes = () => {
  const { uid_mod } = useParams();
  const location = useLocation();
  const [, , urlSeccion, uid_perfil] = location.pathname.split('/');
  const { isAuthenticated } = useAuth()
  const { hasModule, loadingSecciones, loadingModulos, obtenerSeccionesxIDModulo, obtenerModulos, hasSeccion } = usePermisosStore();
  useEffect(() => {
    obtenerModulos()
  }, [urlSeccion])
  
  useEffect(() => {
    obtenerSeccionesxIDModulo(Number(uid_mod));
  }, [uid_mod, urlSeccion])
    const {modulos} = useSelector((state: RootState)=>state.PERMISO)
  const {secciones} = useSelector((state: RootState)=>state.PERMISO)
  // Nuevo guard: esperar a que modulos esté cargado
  if (loadingModulos) return <LoadingOverlay texto='Cargando módulos' />;
  if (loadingSecciones) return <LoadingOverlay texto='Cargando secciones' />;
  // ── 2. No autenticado → login ────────────────────────────────────
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // ── 3. Parámetros uid_modulo ausentes ────────────────
  if (!uid_mod) {
    return <Navigate to="/home" replace />;
  }
  // 4. Si hay un modulo, y no es un modulo activo del usuario. Ir al home
  if (!hasModule(Number(uid_mod), modulos)) {
    return <Navigate to={`/home`} replace />
  }
  
  if(urlSeccion.trim().length===0){
    return <Navigate to={`/${uid_mod}/${secciones[0].seccion.url}`} replace />;
  }
  if(`${uid_perfil}`.trim().length===0 && !hasSeccion(`/${urlSeccion}`, Number(uid_mod), secciones)){
    return <Navigate to={`/home`} replace />
  }
  return (
    <>
    <VerticalLayout 
      misSecciones={secciones}
    />
    </>
  )
}

