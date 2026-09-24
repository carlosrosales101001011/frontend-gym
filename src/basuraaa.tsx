import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';
import { useUserModuloStore } from '@/hook/useUserModuloStore';
import { VerticalLayout } from '../layouts/VerticalLayout';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../stores/Store';
export const ProtectedRoutes = () => {
  const { uid_mod } = useParams();
  const location = useLocation();
  const [, , urlSeccion, uid_perfil] = location.pathname.split('/');
  const { isAuthenticated } = useAuth()
  const { hasModule, loadingSecciones, loadingModulos, obtenerSeccionesxModulo, hasSeccion, obtenerModulos } = useUserModuloStore();
  useEffect(() => {
    obtenerModulos()
  }, [urlSeccion])
  
  useEffect(() => {
    obtenerSeccionesxModulo(Number(uid_mod));
  }, [uid_mod, urlSeccion])
    const {modulos} = useSelector((state: RootState)=>state.MODULOHOME)
  const {secciones} = useSelector((state: RootState)=>state.SECCION)
  // Nuevo guard: esperar a que modulos esté cargado
  if (loadingModulos) return <><pre>{JSON.stringify(modulos, null, 2)}</pre>CARGANDO MODULOS</>;
  if (loadingSecciones) return <>CARGANDO SECCIONES</>;
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
  if(!urlSeccion){
    return <Navigate to={`/${uid_mod}${secciones[0].seccion.url}`} replace />;
  }
  if(!uid_perfil && !hasSeccion(`/${urlSeccion}`, Number(uid_mod), secciones)){
    return <Navigate to={`/home`} replace />
  }
  // const urlActiva = (!urlSeccion) ? `/${uid_mod}${secciones[0].seccion.url}`:`/${uid_mod}/${urlSeccion}`
  // const urlActiva = (!urlSeccion||!hasSeccion(`/${urlSeccion}`, Number(uid_mod), secciones)) ? `/${uid_mod}${secciones[0].seccion.url}`:`/${uid_mod}/${urlSeccion}`
  // if (location.pathname !== urlActiva) {
  //   return <Navigate to={urlActiva} replace />;
  // }

  return (
    <>
    {/* <VerticalLayout 
      misSecciones={secciones}
    /> */}
    </>
  )
}

