import { useEffect, useState } from "react";
import httpClient from "@/common/helpers/httpClient";
import type { moduloProp } from "@/stores/permisos/permisoSlice";

/**
 * Nombre del módulo de la URL (/:url_modulo/...), con carga propia: pide los módulos del usuario por su
 * cuenta (no depende de ProtectedRoutes ni del store), así el Topbar lo muestra aunque el resto siga cargando.
 */
export const useNombreModulo = (url_modulo?: string) => {
  const [nombre, setNombre] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!url_modulo) return;
    // Si cambia el módulo antes de que responda, la respuesta vieja se descarta
    let vigente = true;
    const cargar = async () => {
      setCargando(true);
      try {
        const { data }: { data: moduloProp[] } = await httpClient.get('/modulo-x-user/user/');
        if (vigente) setNombre(data.find((m) => m.modulo?.url === url_modulo)?.modulo.label ?? '');
      } catch (error) {
        console.log(error);
        if (vigente) setNombre('');
      } finally {
        if (vigente) setCargando(false);
      }
    };
    cargar();
    return () => {
      vigente = false;
    };
  }, [url_modulo]);

  return { nombre, cargando };
};
