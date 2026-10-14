import { useSearchParams } from "react-router-dom";

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const get = (key: string) => searchParams.get(key) || "";

  /** replace: cambia la URL sin agregar una entrada al historial (ej. valores por defecto) */
  const set = (params: Record<string, unknown>, { replace = false }: { replace?: boolean } = {}) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    setSearchParams(newParams, { replace });
  };
  const clearQuery = () => {
    setSearchParams({});
  };
  

  return { get, set, clearQuery };
};