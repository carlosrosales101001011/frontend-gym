import { useAppSelector } from "@/stores/Store"
import { onSetDataVentas, type DataVentaProps } from "../store/ventaSlice"
import { useCrudhook } from "@/hook/usecrudhook"

export const useVentascliStore = (id_cli:number) => {
        const {
            obtenerAll:obtenerVentasxidCli
            } = useCrudhook<DataVentaProps>(`/venta/id_cli/${id_cli}`, onSetDataVentas)
            const { dataVentas } = useAppSelector(e=>e.VENTA)
    const obtenerVentasxIdCli = async()=>{
        try {
            await obtenerVentasxidCli()
            } catch (error) {
            console.log(error);
            }
        }
  return {
    obtenerVentasxIdCli,
    dataVentas
  }
}
