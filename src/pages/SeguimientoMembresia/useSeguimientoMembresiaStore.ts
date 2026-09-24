import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataSeguimientoMembresias } from "./store/seguimientoMembresiaSlice"
import { useAppSelector } from "@/stores/Store"

export const useSeguimientoMembresiaStore = () => {
    const { SeguimientoMembresias } = useAppSelector(e=>e.SEGUIMIENTO_MEMBRESIA)
    const { obtenerAll:obtenerMembresiaSeguimiento } = useCrudhook('/membresia-seguimiento', onSetDataSeguimientoMembresias)
  return {
    obtenerMembresiaSeguimiento,
    SeguimientoMembresias
  }
}
