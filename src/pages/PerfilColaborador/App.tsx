import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { usePerfilColaboradorStore } from './usePerfilColaboradorStore'
import { CardContenedor } from './CardContenedor'
import { CardInfo } from './CardInfo'

/** Perfil del colaborador: info a la izquierda y pestañas a la derecha; en celular, uno debajo del otro (perfil/scss/_perfilLayout.scss) */
export const App = () => {
  const { uid_colaborador } = useParams<{ uid_colaborador: string }>()
  const { obtenerDataColaboradorxUID } = usePerfilColaboradorStore()

  // Contratos laborales toma el colaborador del store (PERFIL_COLABORADOR): se carga aunque se abra directo esa pestaña
  useEffect(() => {
    if (uid_colaborador) obtenerDataColaboradorxUID(uid_colaborador)
  }, [uid_colaborador])

  return (
    <div className="view-h-100 perfil-layout">
      <div className="perfil-layout__info p-3">
        <div className='d-flex flex-column card p-3 card-mode-actual h-100'>
          <CardInfo/>
        </div>
      </div>
      <div className="perfil-layout__contenedor p-3">
        <div className='d-flex flex-column card p-3 card-mode-actual h-100'>
          <CardContenedor/>
        </div>
      </div>
    </div>
  )
}
