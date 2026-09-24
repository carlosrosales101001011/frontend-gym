import { useSelector } from "react-redux"
import { useEffect } from "react"
import type { RootState } from "@/stores/Store"
import type { DetallePagoProps } from "@/pages/GestionEgresos/DetallePago/store/detallePagoSlice"
import IconCR from '@/components/Icons/IconCR'
import DataTableCR from "@/components/DataTable/DataTableCR"
import { useDetallePagoStore } from "@/pages/GestionEgresos/DetallePago/useDetallePagoStore"
import { useEgresosStore } from "@/pages/GestionEgresos/useEgresosStore"
import { useTerminologiaPersona } from "@/hook/usePropiedadesStore"
import { NumberFormatMoney } from "@/components/Formats/NumberFormat"

export const DataTableDetalleGastoPago = () => {
        const { cargar: cargarMoneda, data: dataMoneda } = useTerminologiaPersona('codigoOficialMoneda')
    const { obtenerOpCuentasFinancieras } = useEgresosStore()
    const { detallesPago } = useSelector((state: RootState)=>state.DETALLE_GASTOPAGO)
    const { egreso, opcionesCuentasFinancieras } = useSelector((state: RootState)=>state.EGRESO)
    const { obtenerDetallePagosxIDMov } = useDetallePagoStore()
      useEffect(() => {
        if (egreso.id !== 0) {
          obtenerDetallePagosxIDMov(egreso.id)
          cargarMoneda()
          obtenerOpCuentasFinancieras()
        }}, [egreso.id])
    const columns = [
            {
            id: 0,
            header: 'Donde salio el pago',
            render: (row:DetallePagoProps) => (
                <div style={{width: '430px'}}>
                    {opcionesCuentasFinancieras.find((item)=>item.value===row.id_forma_pago)?.label}
                </div>
            ),
            },
            {
            id: 1,
            header: 'Monto',
            render: (row:DetallePagoProps) => (
                <div>
                    {dataMoneda.find((item)=>item?.value===row.id_codigo_moneda)?.label}
                    <NumberFormatMoney value={row.monto}/>
                </div>
            ),
            },
            {
            id: 2,
            header: 'Fecha de pago',
            render: (row:DetallePagoProps) => (
                <div>
                {row.fecha_pago}
                </div>
            ),
            },
            {
            id: 3,
            header: 'Observaciones',
            render: (row:DetallePagoProps) => (
                <div style={{width: '130px'}}>
                {row.observacion}
                </div>
            ),
            },
            {
            id: 5,
            header: '',
            render: () => (
                <div style={{width: '30px'}}>
                <IconCR name='edit'/>
                <IconCR name='delete'/>
                </div>
            ),
            },
        ]
  return (
    <div>
        <DataTableCR
            showPagination={false}
            isUrlPagination={false}
            permitirOcultarColumnas={false}
            permitirReordenarColumnas={false}
            mostrarFlechasScroll={false}
            columns={columns}
            data={detallesPago}
            totalPages={1}
            countTotal={1}
        />
    </div>
  )
}
