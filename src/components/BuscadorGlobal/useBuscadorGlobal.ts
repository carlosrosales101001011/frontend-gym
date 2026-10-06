import { useEffect, useState } from 'react'
import httpClient from '@/common/helpers/httpClient'

/** Fila de GET /modulo-x-user/user/secciones (solo lo que usa el buscador) */
type FilaSeccionUsuario = {
  seccion?: { id: number, label: string, url: string, icon: string, is_seccion_mantenimiento?: boolean }
  moduloUser?: { modulo?: { label: string, url: string, icono: string } }
}

/** Pantalla a la que se puede ir: una sección de un módulo del usuario */
export type PantallaBuscable = {
  id: number
  label: string
  icono: string
  modulo: string
  /** /url_modulo/url_seccion */
  ruta: string
  /** url de la sección (ej. gestion-clientes) */
  urlSeccion: string
  enMantenimiento: boolean
}

/**
 * Pantallas (secciones de los módulos) del usuario logueado para el buscador del Home.
 * Se piden una vez; el filtrado por texto lo hace el buscador sin ir al servidor.
 */
export const useBuscadorGlobal = () => {
  const [pantallas, setPantallas] = useState<PantallaBuscable[]>([])
  const [cargandoPantallas, setCargandoPantallas] = useState(true)

  useEffect(() => {
    httpClient.get('/modulo-x-user/user/secciones')
      .then(({ data }: { data: FilaSeccionUsuario[] }) => {
        // Sin repetidos (misma sección en el mismo módulo) y solo las que tienen a dónde ir
        const porRuta = new Map<string, PantallaBuscable>()
        for (const fila of data) {
          const seccion = fila.seccion
          const modulo = fila.moduloUser?.modulo
          if (!seccion?.url || !modulo?.url) continue
          const ruta = `/${modulo.url}/${seccion.url}`
          if (!porRuta.has(ruta)) {
            porRuta.set(ruta, {
              id: seccion.id,
              label: seccion.label,
              icono: seccion.icon,
              modulo: modulo.label,
              ruta,
              urlSeccion: seccion.url,
              enMantenimiento: !!seccion.is_seccion_mantenimiento,
            })
          }
        }
        setPantallas([...porRuta.values()])
      })
      .catch((error) => console.log(error))
      .finally(() => setCargandoPantallas(false))
  }, [])

  return { pantallas, cargandoPantallas }
}
