import React from "react";
import { useAppSelector } from "@/stores/Store";
import { DataTableTest } from "@/components/DataTableTest/DataTableTest";
import type { MovProductoProps } from "@/pages/GestionSalidaMovProducto/store/movProductoSlice";


export const DataTableMovProductos = ({ otrosBotones }: { onOpenModalCustom: (id:number) => void, otrosBotones?: React.ReactNode }) => {
    const val = useAppSelector((state)=>state.MOVPRODUCTO.movProductos)

    const columns = [
        {
            id: 0,
            header: 'Producto',
            render: (rowData: MovProductoProps) => <span>{rowData.label_producto}</span>,
        },
        {
            id: 1,
            header: 'Marca',
            render: (rowData: MovProductoProps) => <span>{rowData.label_marca_producto}</span>,
        },
        {
            id: 3,
            header: 'Salidas',
            render: (rowData: MovProductoProps) => <span>{rowData.cantidad_movimiento}</span>,
        },
        {
            id: 4,
            header: 'Motivo',
            render: (rowData: MovProductoProps) => <span>{rowData.label_motivo}</span>,
        },
        {
            id: 5,
            header: 'Action',
            render: (rowData: MovProductoProps) => <span>{rowData.label_motivo}</span>,
        }
    ]

  return (
    <div>
        <DataTableTest
            congelarColumnas
            permitirOcultarColumnas
            permitirReordenarColumnas
            persistKey='term'
            mostrarFlechas
            classNameTablePagination='sticky-bottom-1'
            classNameToolBar="sticky-top-1"
            otrosBotones={otrosBotones}
            columns={columns}
            data={val}
        />
    </div>
  )
}
