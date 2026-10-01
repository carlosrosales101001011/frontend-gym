import { useAppDispatch, useAppSelector } from "@/stores/Store";
import { onSetModuloActual, type ModuloActualProps } from "@/stores/permisos/permisoSlice";
import { CLAVE_MODULO_ACTUAL } from "@/helpers/moduloActual";

/**
 * Módulo en el que está el usuario (lo fija ProtectedRoutes al entrar a /:url_modulo/...).
 * Queda en el store y en localStorage (sigue disponible al recargar la página).
 */
export const useModuloActual = () => {
  const dispatch = useAppDispatch();
  const { moduloActual } = useAppSelector((state) => state.PERMISO);

  const seleccionarModuloActual = (modulo: ModuloActualProps | null) => {
    dispatch(onSetModuloActual(modulo));
    try {
      if (modulo) localStorage.setItem(CLAVE_MODULO_ACTUAL, JSON.stringify(modulo));
      else localStorage.removeItem(CLAVE_MODULO_ACTUAL);
    } catch {
      // Sin localStorage (modo privado, etc.) queda solo en el store
    }
  };

  return {
    moduloActual,
    /** uid de modulo_x_user del módulo actual */
    uid_modulo: moduloActual?.uid_modulo ?? null,
    seleccionarModuloActual,
  };
};
