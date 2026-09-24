import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataVentas } from "./store/dataVentaSlice"

export const useVentasStore = () => {
    const { searcher:obtenerVentas } = useCrudhook('/venta', onSetDataVentas)
  return {
    obtenerVentas
  }
}
