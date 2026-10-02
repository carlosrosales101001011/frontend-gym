import { useEffect, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

/**
 * Pestaña activa guardada en la URL (?param=) con un historial sin repetidos:
 * - una pestaña nueva agrega un paso al historial del navegador;
 * - volver a una que ya se vio retrocede hasta ella (no agrega pasos).
 * Ej.: Comentarios → Emergencia → Comentarios deja el historial en [Comentarios], no en tres pasos.
 * El botón "atrás" del navegador recorre solo las pestañas vistas.
 */
export const useTabsHistorial = (param: string, porDefecto: string) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const activa = searchParams.get(param) || porDefecto
  // Pestañas vistas, en el mismo orden que sus pasos en el historial (la última es la activa)
  const vistas = useRef<string[]>([activa])

  // Sincroniza con la URL (también cuando se usa "atrás" / "adelante" del navegador)
  useEffect(() => {
    const indice = vistas.current.lastIndexOf(activa)
    vistas.current = indice >= 0 ? vistas.current.slice(0, indice + 1) : [...vistas.current, activa]
  }, [activa])

  const seleccionar = (key: string | null) => {
    if (!key || key === activa) return
    const indice = vistas.current.lastIndexOf(key)
    if (indice >= 0) {
      // Ya se vio: retroceder hasta ella
      navigate(indice - (vistas.current.length - 1))
      return
    }
    setSearchParams((prev) => {
      const siguiente = new URLSearchParams(prev)
      siguiente.set(param, key)
      return siguiente
    })
  }

  return { activa, seleccionar }
}
