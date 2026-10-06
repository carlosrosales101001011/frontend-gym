import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CardContenedor } from './CardContenedor'
import { CardInfo } from './CardInfo'
import { PerfilUsuarioContext } from './hook/perfilUsuarioContexto'
import { usePerfilUsuario, type PerfilUsuarioProps } from './hook/usePerfilUsuario'

/**
 * Perfil del usuario (:uid_person es el uuid del usuario): tarjeta a la izquierda y pestañas a la derecha;
 * en celular, uno debajo del otro (_perfilLayout.scss). Los datos personales son los de su colaborador.
 */
export const App = () => {
  const { uid_person } = useParams<{ uid_person: string }>()
  const { obtenerPerfil } = usePerfilUsuario()
  const [perfil, setPerfil] = useState<PerfilUsuarioProps | null>(null)
  const [cargando, setCargando] = useState(true)

  const recargar = useCallback(async () => {
    if (!uid_person) return
    try {
      setPerfil(await obtenerPerfil(uid_person))
    } catch (error) {
      console.log(error)
      setPerfil(null)
    } finally {
      setCargando(false)
    }
  }, [uid_person])

  useEffect(() => {
    recargar()
  }, [recargar])

  return (
    <PerfilUsuarioContext.Provider value={{ perfil, cargando, recargar }}>
      <div className="view-h-100 perfil-layout">
        <div className="perfil-layout__info p-3">
          <div className='d-flex flex-column card p-3 card-mode-actual h-100'>
            <CardInfo/>
          </div>
        </div>
        <div className="perfil-layout__contenedor p-3">
          <div className='d-flex flex-column card p-3 card-mode-actual h-100'>
            {perfil && <CardContenedor/>}
          </div>
        </div>
      </div>
    </PerfilUsuarioContext.Provider>
  )
}
