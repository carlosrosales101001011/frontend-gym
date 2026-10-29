import { DataTableTest } from "@/components/DataTableTest/DataTableTest"
import IconCR from "@/components/Icons/IconCR"
import { getFormatMoney } from "@/helpers/getFormatMoney"
import type { CompromisoPagoProps } from "@/pages/GestionCompromisosPagos/store/compromisoPagoSlice"
import { useCompromisoPagoStore } from "@/pages/GestionCompromisosPagos/useCompromisoPagoStore"

export const DataTableCompromisosPago = ({ onOpenModalCustom, otrosBotones }: { onOpenModalCustom: (id:number) => void, otrosBotones: React.ReactNode }) => {
    const { compromisosPago, eliminarCompromisoPago } = useCompromisoPagoStore()

    const columns = [
        {
            id: 0,
            header: 'ID',
            render: (rowData: CompromisoPagoProps) => <span>{rowData.id}</span>,
        },
        {
            id: 1,
            header: 'Cliente', campoBusqueda: 'nombres_apellidos_clientes',
            render: (rowData: CompromisoPagoProps) => <span>{rowData.nombres_apellidos_clientes}</span>,
        },
        {
            id: 2,
            header: 'Deuda total',
            render: (rowData: CompromisoPagoProps) => <span>{getFormatMoney(Number(rowData.monto_total_deuda) || 0)}</span>,
        },
        {
            id: 3,
            header: 'Comprometido',
            render: (rowData: CompromisoPagoProps) => <span>{getFormatMoney(Number(rowData.monto_comprometido) || 0)}</span>,
        },
        {
            id: 4,
            header: 'Pagado',
            render: (rowData: CompromisoPagoProps) => <span>{getFormatMoney(Number(rowData.monto_pagado) || 0)}</span>,
        },
        {
            id: 5,
            header: 'Motivo', campoBusqueda: 'label_motivo',
            render: (rowData: CompromisoPagoProps) => <span>{rowData.label_motivo}</span>,
        },
        {
            id: 6,
            header: 'Estado', campoBusqueda: 'label_estado',
            render: (rowData: CompromisoPagoProps) => <span>{rowData.label_estado}</span>,
        },
        {
            id: 7,
            header: 'Colaborador', campoBusqueda: 'nombres_apellidos_empl',
            render: (rowData: CompromisoPagoProps) => <span>{rowData.nombres_apellidos_empl}</span>,
        },
        {
            id: 8,
            header: 'Observación', campoBusqueda: 'observacion',
            render: (rowData: CompromisoPagoProps) => <span>{rowData.observacion}</span>,
        },
        {
            id: 9,
            header: '',
            render: (rowData: CompromisoPagoProps) => {
                return (
                    <div className="d-flex">
                        <div onClick={()=>onOpenModalCustom(rowData.id)} className="cursor-pointer me-2">
                            <IconCR name="edit" size={14}/>
                        </div>
                        <div onClick={()=>eliminarCompromisoPago(rowData.id)} className="cursor-pointer">
                            <IconCR name="delete" size={14}/>
                        </div>
                    </div>
                )
            },
        },
    ]

  return (
    <div>
        <DataTableTest
            congelarColumnas
            permitirOcultarColumnas
            permitirReordenarColumnas
            persistKey='compromisos-pago'
            mostrarFlechas
            classNameTablePagination='sticky-bottom-1'
            classNameToolBar="sticky-top-1"
            otrosBotones={otrosBotones}
            columns={columns}
            data={compromisosPago}
        />
    </div>
  )
}
