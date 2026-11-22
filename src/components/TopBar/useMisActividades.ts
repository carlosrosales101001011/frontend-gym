import { useState } from 'react'
import httpClient from '@/common/helpers/httpClient'


/** Registro de user_auditoria: datos_anteriores/datos_nuevos son JSON [{ propiedad: valor }] */
export type ActividadProps = {
  id: number
  id_user: number
  fecha: string
  ip: string
  id_accion_realizada: number
  tabla: string | null
  id_registro: number | null
  datos_anteriores: string | null
  datos_nuevos: string | null
  resultado: string
}

/** Últimas 50 actividades del usuario de la sesión (modal "Mis actividades" del Topbar) */
export const useMisActividades = () => {
  const [actividades, setActividades] = useState<ActividadProps[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(false)

  /** idAccion 0 = todas */
  const obtenerMisActividades = async (idAccion = 0) => {
    try {
      setCargando(true)
      setError(false)
      const { data } = await httpClient.get('/user-auditoria/mis-actividades', { params: idAccion ? { id_accion: idAccion } : {} })
      setActividades(data as ActividadProps[])
    } catch (e) {
      console.log(e)
      setError(true)
    } finally {
      setCargando(false)
    }
  }

  return { actividades, cargando, error, obtenerMisActividades }
}
