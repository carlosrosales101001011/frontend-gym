import { CardContenedor } from "./CardContenedor"
import { CardInfo } from "./CardInfo"

/** Perfil del cliente: info a la izquierda y pestañas a la derecha; en celular, uno debajo del otro (_perfilLayout.scss) */
export const App = () => {
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
