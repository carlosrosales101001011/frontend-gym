import { useSearchParams } from "react-router-dom";

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const get = (key: string) => searchParams.get(key) || "";

  const set = (params: Record<string, unknown>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    setSearchParams(newParams);
  };
  const clearQuery = () => {
    setSearchParams({});
  };
  

  return { get, set, clearQuery };
};