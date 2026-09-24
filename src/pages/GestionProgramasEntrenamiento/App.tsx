import { useState } from 'react'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { DataCardProgramas } from '@/pages/GestionProgramasEntrenamiento/DataCardProgramas'
import { ModalCustomProgramas } from '@/pages/GestionProgramasEntrenamiento/ModalCustomProgramas'
import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'

export const App = () => {
  const [isOpenModalCustomPrograma, setisOpenModalCustomPrograma] = useState({id: 0, isOpen: false})
  // fuerza a DataCardProgramas a remontarse (y volver a pedir el listado) cada vez que el modal se cierra
  const [listaKey, setListaKey] = useState(0)
  const onOpenModalCustom=(id=0)=>{
    setisOpenModalCustomPrograma({id, isOpen: true})
  }
  const onCloseModalCustom = ()=>{
    setisOpenModalCustomPrograma({id: 0, isOpen: false})
    setListaKey((key) => key + 1)
  }
  return (
    <div className="p-2">
      <PageBreadCumb title='Programas de entrenamiento'/>
        <ButtonCR onClick={()=>onOpenModalCustom(0)} label={'Nuevo programa'} className="mb-2"/>
        <DataCardProgramas key={listaKey} onOpenModalCustom={onOpenModalCustom}/>
        <ModalCustomProgramas
          id={isOpenModalCustomPrograma.id}
          show={isOpenModalCustomPrograma.isOpen}
          onHide={onCloseModalCustom}
        />
    </div>
  )
}
