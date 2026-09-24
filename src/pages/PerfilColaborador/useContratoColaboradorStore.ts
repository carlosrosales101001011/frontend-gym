import { useCrudhook } from "@/hook/usecrudhook"
import { onSetContratosColaborador, type ContratoColaboradorProps } from "@/pages/PerfilColaborador/store/contratoColaboradorSlice"

export const useContratoColaboradorStore = (uid_empleado: string) => {
    const { post, obtener, dataxID, obtenerxID, remove, patch, searcher } = useCrudhook<ContratoColaboradorProps>(`/contrato-empleado/uid_empleado/${uid_empleado}`, onSetContratosColaborador)
  return {
    searcher,
    post,
    obtener,
    dataxID,
    obtenerxID,
    remove,
    patch
  }
}
