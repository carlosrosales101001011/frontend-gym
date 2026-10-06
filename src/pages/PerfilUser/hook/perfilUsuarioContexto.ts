import { createContext, useContext } from 'react'
import type { PerfilUsuarioProps } from './usePerfilUsuario'

type PerfilUsuarioContexto = {
  /** null mientras carga o si no existe */
  perfil: PerfilUsuarioProps | null
  cargando: boolean
  /** Vuelve a pedir el perfil (tras guardar) */
  recargar: () => Promise<void>
}

/** El perfil del usuario lo carga App una vez; la tarjeta y las pestañas lo leen de aquí */
export const PerfilUsuarioContext = createContext<PerfilUsuarioContexto>({
  perfil: null,
  cargando: true,
  recargar: async () => {},
})

export const usePerfilUsuarioContexto = () => useContext(PerfilUsuarioContext)
