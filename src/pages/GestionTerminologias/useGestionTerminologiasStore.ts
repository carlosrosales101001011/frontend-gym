import { useCrudhook } from "@/hook/usecrudhook";
import { useAppDispatch } from "@/stores/Store";
import { onSetTerminologia, type TerminologiaProps } from "@/pages/GestionTerminologias/store/terminologiasSlice";
// import { useSelector } from "react-redux";

export const useGestionTerminologiasStore = () => {
  // const {entidades} = useSelector((state: RootState)=>state.USER.user)
  const { post, obtener, patch, remove, page, show, dataxID, obtenerxID, searcher } = useCrudhook<TerminologiaProps>('/terminologia', onSetTerminologia)
  const dispatch = useAppDispatch()
  
  return {
    searcher,
    dataxID,
    obtenerxID,
    dispatch,
    post,
    obtener,
    patch,
    remove,
    page,
    show
  }
}
