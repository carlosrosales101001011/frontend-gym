import { useEffect, useState } from "react"

/** Servicio de OpenStreetMap que convierte coordenadas en dirección (gratis, sin API key) */
const URL_NOMINATIM = 'https://nominatim.openstreetmap.org/reverse'
/** Se guarda por sesión del navegador para no consultar Nominatim en cada visita al Home (su límite es 1 req/s) */
const CLAVE_CACHE = 'ubicacion_usuario'

type DireccionNominatim = Record<string, string | undefined>

/**
 * "Miraflores, Lima": el distrito y la ciudad (sin repetir si coinciden, ej. Cercado de Lima → "Lima").
 * En Perú Nominatim pone el distrito en `city` y la provincia en `region`.
 */
const distritoYCiudad = (direccion: DireccionNominatim) => {
  const distrito = direccion.city ?? direccion.town ?? direccion.village ?? direccion.suburb
  const ciudad = direccion.region ?? direccion.state_district ?? direccion.state
  return [...new Set([distrito, ciudad].filter(Boolean))].join(', ')
}

/**
 * Distrito y ciudad donde está el usuario, con la geolocalización del navegador (pide permiso).
 * Si no hay permiso, el navegador no la soporta o falla la consulta, devuelve ''.
 * Solo se envían las coordenadas a Nominatim (fetch directo, sin el token del sistema).
 */
export const useUbicacionUsuario = () => {
  const [ubicacion, setUbicacion] = useState(() => {
    try {
      return sessionStorage.getItem(CLAVE_CACHE) ?? ''
    } catch {
      return ''
    }
  })

  useEffect(() => {
    if (ubicacion || !('geolocation' in navigator)) return
    const ctrl = new AbortController()
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const params = new URLSearchParams({
            format: 'jsonv2',
            lat: String(coords.latitude),
            lon: String(coords.longitude),
            zoom: '14',
            'accept-language': 'es',
          })
          const respuesta = await fetch(`${URL_NOMINATIM}?${params}`, { signal: ctrl.signal })
          if (!respuesta.ok) return
          const { address } = await respuesta.json() as { address?: DireccionNominatim }
          const texto = address ? distritoYCiudad(address) : ''
          setUbicacion(texto)
          try { sessionStorage.setItem(CLAVE_CACHE, texto) } catch { /* sin almacenamiento: se consulta de nuevo */ }
        } catch {
          // Sin conexión o consulta cancelada: queda vacío
        }
      },
      () => { /* Permiso denegado o sin señal: queda vacío */ },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    )
    return () => ctrl.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al montar
  }, [])

  return ubicacion
}
