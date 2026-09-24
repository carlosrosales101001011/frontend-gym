import { useSelector } from "react-redux"
import { AppContactoEmergencia } from "@/components/GestionContactoEmergencia/AppContactoEmergencia"
import type { RootState } from "@/stores/Store"

export const TabContactoEmergencia = () => {
  const {colaborador} = useSelector((state: RootState)=>state.PERFIL_COLABORADOR)
  
  return (
    <div>
      <AppContactoEmergencia uid_location={colaborador.uid_contactoEmergencia}/>
    </div>
  )
}
