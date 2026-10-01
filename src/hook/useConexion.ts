import { useEffect, useState } from "react";

export type EstadoConexion = 'buena' | 'lenta' | 'sin-conexion';

/** Network Information API (Chrome/Edge/Android); Firefox y Safari no la tienen */
type InformacionRed = EventTarget & { effectiveType?: string, downlink?: number };

/** Velocidad efectiva que se considera lenta (2g, o bajada menor a 1 Mbps) */
const TIPOS_LENTOS = ['slow-2g', '2g'];
const MBPS_MINIMO = 1;

const leerEstado = (): EstadoConexion => {
  if (!navigator.onLine) return 'sin-conexion';
  const red = (navigator as Navigator & { connection?: InformacionRed }).connection;
  if (!red) return 'buena';
  const lenta = TIPOS_LENTOS.includes(red.effectiveType ?? '') || (red.downlink !== undefined && red.downlink > 0 && red.downlink < MBPS_MINIMO);
  return lenta ? 'lenta' : 'buena';
};

/**
 * Estado de la conexión del navegador, actualizado en vivo (se conecta/desconecta o cambia la velocidad).
 * En navegadores sin Network Information API solo distingue con y sin conexión.
 */
export const useConexion = () => {
  const [estado, setEstado] = useState<EstadoConexion>(leerEstado);

  useEffect(() => {
    const actualizar = () => setEstado(leerEstado());
    const red = (navigator as Navigator & { connection?: InformacionRed }).connection;
    window.addEventListener('online', actualizar);
    window.addEventListener('offline', actualizar);
    red?.addEventListener('change', actualizar);
    return () => {
      window.removeEventListener('online', actualizar);
      window.removeEventListener('offline', actualizar);
      red?.removeEventListener('change', actualizar);
    };
  }, []);

  return estado;
};
