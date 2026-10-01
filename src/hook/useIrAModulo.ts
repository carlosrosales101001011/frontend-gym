import { useNavigate } from "react-router-dom";

/**
 * Entra a un módulo (Home y "Mis módulos" usan lo mismo). Solo navega a /:url_modulo/; ProtectedRoutes hace las
 * validaciones: sesión iniciada, módulo del usuario (pidiéndolo al servidor con su token) y lleva a la
 * primera sección del módulo, que también valida contra el servidor.
 * Devuelve false si el módulo está bloqueado (sin_acceso).
 */
export const useIrAModulo = () => {
  const navigate = useNavigate();
  return (modulo: { modulo?: { url?: string }, sin_acceso?: boolean }) => {
    const url = modulo.modulo?.url;
    if (modulo.sin_acceso || !url) return false;
    navigate(`/${url}/`);
    return true;
  };
};
