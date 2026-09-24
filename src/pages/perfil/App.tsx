import { CardContenedor } from "./CardContenedor"
import { CardInfo } from "./CardInfo"

export const App = () => {
  return (
    <div>
    <div className="view-h-100 d-flex">
      <div className="p-3" style={{height: '100%', width: '380px'}} >
        <div className='d-flex flex-column card p-3 card-mode-actual' style={{height: '100%'}}>
          <CardInfo/>
        </div>
      </div>
      <div className=" p-3" style={{height: '100%', width: '100%'}} >
        <div className='d-flex flex-column card p-3 card-mode-actual'  style={{height: '100%'}}>
            <CardContenedor/>
        </div>
      </div>
    </div>
          
    </div>
  )
}
