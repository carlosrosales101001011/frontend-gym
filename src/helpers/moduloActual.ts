/** Clave de localStorage del módulo actual (ver hook/useModuloActual) */
export const CLAVE_MODULO_ACTUAL = 'modulo_actual';

/** Módulo actual guardado en localStorage, o null si no hay o no se puede leer */
export const leerModuloActualGuardado = <T,>(): T | null => {
  try {
    const guardado = localStorage.getItem(CLAVE_MODULO_ACTUAL);
    return guardado ? (JSON.parse(guardado) as T) : null;
  } catch {
    return null;
  }
};
