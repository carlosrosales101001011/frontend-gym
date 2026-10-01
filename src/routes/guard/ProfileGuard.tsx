import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAppSelector } from "@/stores/Store";
import { usePermisosStore } from "@/hook/usePermisosStore";

type ProfileGuardProps = {
  /** Sección de gestión que contiene al perfil (ej. "gestion-clientes" para perfil-cliente) */
  gestion: string;
}

/**
 * Protege una gestión y su perfil: solo se entra si el usuario tiene la sección `gestion` en este módulo.
 * Si no la tiene, va a la primera sección del módulo. Las secciones ya las cargó ProtectedRoutes.
 */
export const ProfileGuard = ({ gestion }: ProfileGuardProps) => {
  const { url_modulo } = useParams();
  const { secciones } = useAppSelector((state) => state.PERMISO);
  const { hasSeccionxURL } = usePermisosStore();

  // Las secciones del store son solo las del módulo actual (ProtectedRoutes ya lo validó)
  if (!hasSeccionxURL(gestion, secciones)) {
    return <Navigate to={secciones[0] ? `/${url_modulo}/${secciones[0].seccion.url}` : '/home'} replace />;
  }
  return <Outlet />;
};
