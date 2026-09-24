import React from "react";
import { useAppSelector } from "@/stores/Store";
import type { ProductoProps } from "@/pages/GestionProductos/store/productoSlice";
import { useProductoStore } from "@/pages/GestionProductos/useProductoStore";
import IconCR from "@/components/Icons/IconCR";
import { DataTableTest } from "@/components/DataTableTest/DataTableTest";
export const DataTableProductos = ({ onOpenModalCustom, otrosBotones }: { onOpenModalCustom: (id:number) => void, otrosBotones: React.ReactNode }) => {
    const val = useAppSelector((state)=>state.PRODUCTO.productos)
    const { remove } = useProductoStore()

    const columns = [
        {
            id: 0,
            header: 'ID',
            render: (rowData: ProductoProps) => <span>{rowData.id}</span>,
        },
        {
            id: 1,
            header: 'Nombre',
            render: (rowData: ProductoProps) => <span>{rowData.nombre}</span>,
        },
        {
            id: 2,
            header: 'Código de Barra',
            render: (rowData: ProductoProps) => <span>{rowData.codigo_barra}</span>,
        },
        {
            id: 3,
            header: 'Código SKU',
            render: (rowData: ProductoProps) => <span>{rowData.codigo_sku}</span>,
        },
        {
            id: 4,
            header: 'Descripción',
            render: (rowData: ProductoProps) => <span>{rowData.descripcion}</span>,
        },
        {
            id: 5,
            header: 'Categoría',
            render: (rowData: ProductoProps) => <span>{rowData.label_categoria}</span>,
        },
        {
            id: 6,
            header: 'Marca',
            render: (rowData: ProductoProps) => <span>{rowData.label_marca}</span>,
        },
        {
            id: 7,
            header: 'Unidad de Medida',
            render: (rowData: ProductoProps) => <span>{rowData.label_unidadMedida}</span>,
        },
        {
            id: 8,
            header: 'Stock Actual',
            render: (rowData: ProductoProps) => <span>{rowData.stock_actual}</span>,
        },
        {
            id: 9,
            header: 'Stock Mínimo',
            render: (rowData: ProductoProps) => <span>{rowData.stock_min}</span>,
        },
        {
            id: 10,
            header: 'Estado',
            render: (rowData: ProductoProps) => <span>{rowData.label_estado}</span>,
        },
        {
            id: 11,
            header: '',
            render: (rowData: ProductoProps) => {
                return (
                    <div className="d-flex">
                        <div onClick={()=>onEdit(rowData.id)} className="cursor-pointer me-2">
                            <IconCR name="edit" size={14}/>
                        </div>
                        <div onClick={()=>onDelete(rowData.id)} className="cursor-pointer">
                            <IconCR name="delete" size={14}/>
                        </div>
                    </div>
                )
            },
        },
    ]
    const onEdit = (id:number)=>{
        onOpenModalCustom(id)
    }
    const onDelete = (id:number)=>{
        remove(id)
    }

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
