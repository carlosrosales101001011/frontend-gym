import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataCuentasFinancieras } from "@/pages/GestionCuentasFinanciera/store/cuentasFinancieraSlice"
import type { CuentaFinancieraProps } from "@/pages/GestionCuentasFinanciera/store/cuentasFinancieraSlice"

export const useCuentasFinancieraStore = () => {
    const { post, obtener, obtenerxID, dataxID, patch, remove, searcher } = useCrudhook<CuentaFinancieraProps>('/cuentas-financieras', onSetDataCuentasFinancieras)
  return {
    post,
    obtener,
    obtenerxID,
    dataxID,
    patch,
    remove,
    searcher
  }
}
