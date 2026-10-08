import { useEffect, useState } from 'react'
import httpClient from '@/common/helpers/httpClient'

/** GET /persona-eventos-asistencia/resumen */
export type ResumenAsistenciasProps = {
  clientes_asistidos: number
  clientes_sin_asistir: number
  colaboradores_asistidos: number
}

/**
 * Resumen del rango de fechas de Gestión de asistencia (clientes y colaboradores que asistieron, clientes sin asistir).
 * Se vuelve a pedir al cambiar el rango o `version` (ej. la lista de asistencias tras registrar o eliminar).
 */
export const useResumenAsistencias = (fecha_inicio: string, fecha_fin: string, version: unknown) => {
  const [resumen, setResumen] = useState<ResumenAsistenciasProps | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const ctrl = new AbortController()
    httpClient.get('/persona-eventos-asistencia/resumen', {
      params: { ...(fecha_inicio ? { fecha_inicio } : {}), ...(fecha_fin ? { fecha_fin } : {}) },
      signal: ctrl.signal,
    })
      .then(({ data }) => setResumen(data))
      .catch((error) => { if (!ctrl.signal.aborted) console.log(error) })
      .finally(() => { if (!ctrl.signal.aborted) setCargando(false) })
    return () => ctrl.abort()
  }, [fecha_inicio, fecha_fin, version])

  return { resumen, cargando: cargando && !resumen }
}
