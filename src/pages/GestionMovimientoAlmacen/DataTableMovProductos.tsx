import React, { useMemo } from "react";
import { useAppSelector } from "@/stores/Store";
import { DataTableTest } from "@/components/DataTableTest/DataTableTest";

const ID_TIPO_MOVIMIENTO_ENTRADA = 6045
const ID_TIPO_MOVIMIENTO_SALIDA = 6046

type ResumenProducto = {
    id_producto: number,
    label_producto?: string,
    label_marca_producto?: string,
    stock_inicial: number,
    entradas: number,
    salidas: number,
}

export const DataTableMovProductos = ({ otrosBotones }: { otrosBotones?: React.ReactNode }) => {
    const val = useAppSelector((state)=>state.MOVPRODUCTO.movProductos)

    const data = useMemo(() => {
        const resumen = new Map<number, ResumenProducto>()
        const stockInicialAsignado = new Set<number>()
        val.forEach((mov) => {
            const actual = resumen.get(mov.id_producto) ?? {
                id_producto: mov.id_producto,
                label_producto: mov.label_producto,
                label_marca_producto: mov.label_marca_producto,
                stock_inicial: 0,
                entradas: 0,
                salidas: 0,
            }
            if (mov.id_tipo_movimiento === ID_TIPO_MOVIMIENTO_ENTRADA) {
                if (!stockInicialAsignado.has(mov.id_producto)) {
                    actual.stock_inicial = mov.cantidad_movimiento
                    stockInicialAsignado.add(mov.id_producto)
                }
                actual.entradas += mov.cantidad_movimiento
            } else if (mov.id_tipo_movimiento === ID_TIPO_MOVIMIENTO_SALIDA) {
                actual.salidas += mov.cantidad_movimiento
            }
            resumen.set(mov.id_producto, actual)
        })
        return Array.from(resumen.values())
    }, [val])

    const columns = [
        {
            id: 0,
            header: 'Producto',
            render: (rowData: ResumenProducto) => <span>{rowData.label_producto}</span>,
        },
        {
            id: 1,
            header: 'Marca',
            render: (rowData: ResumenProducto) => <span>{rowData.label_marca_producto}</span>,
        },
        {
            id: 2,
            header: 'Stock inicial',
            render: (rowData: ResumenProducto) => <span>{rowData.stock_inicial}</span>,
        },
        {
            id: 3,
            header: 'Entradas',
            render: (rowData: ResumenProducto) => <span>{rowData.entradas}</span>,
        },
        {
            id: 4,
            header: 'Salidas',
            render: (rowData: ResumenProducto) => <span>{rowData.salidas}</span>,
        },
        {
            id: 5,
            header: 'Total',
            render: (rowData: ResumenProducto) => <span>{rowData.entradas - rowData.salidas}</span>,
        },
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
            data={data}
        />
    </div>
  )
}
