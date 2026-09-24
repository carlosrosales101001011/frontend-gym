import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useGestionStore } from '@/pages/GestionUsuarios/useGestionUsuariosStore'
import { useSelector } from 'react-redux'
import type { RootState } from '@/stores/Store'
type Props = {
    setStep: (step:number)=>void;
}
export const StepModulos = ({setStep}:Props) => {
  const { obtenerModulosxMe} = useGestionStore()
  const [stepEntidad, setstepEntidad] = useState(0)
  const {modulos} = useSelector((state: RootState)=>state.USER)
  
  const onLastStep = ()=>{
        setStep(3)
  }
  const onChangeStepEntidad = (n:number)=>{
    setstepEntidad(n)
  }
  useEffect(() => {
      obtenerModulosxMe()
  }, [])
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Modulo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {
            modulos.map((modulo, index) => (
              <tr key={modulo.id}>
                <td>{modulo.modulo.label}</td>
                <td>{1}</td>
              </tr>
            ))
          }
        </tbody>
      </Table>
        <Button onClick={()=>onLastStep()}>Siguiente</Button>
    </div>
  )
}


