import { useSearchParams } from "react-router-dom"

/**
 * Pestaña activa guardada en la URL (?param=). Cada cambio de pestaña agrega un paso al historial
 * del navegador, aunque la pestaña ya se haya visto (se pueden repetir).
 * Ej.: Comentarios → Emergencia → Comentarios deja tres pasos; "atrás" los recorre en orden.
 */
export const useTabsHistorial = (param: string, porDefecto: string) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activa = searchParams.get(param) || porDefecto

  const seleccionar = (key: string | null) => {
    if (!key || key === activa) return
    setSearchParams((prev) => {
      const siguiente = new URLSearchParams(prev)
      siguiente.set(param, key)
      return siguiente
    })
  }

  return { activa, seleccionar }
}
