import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataSucursales, type SucursalProps } from "@/pages/GestionSucursal/store/sucursalSlice"

export const useSucursalStore = () => {
    const { post, obtener, dataxID, obtenerxID, remove, patch, searcher } = useCrudhook<SucursalProps>('/empresa-sucursal', onSetDataSucursales)
    // const [dataEmpresas, setdataEmpresas] = useState([])
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
