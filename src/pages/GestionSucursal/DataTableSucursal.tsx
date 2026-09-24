import React from "react";
import { useAppSelector } from "@/stores/Store";
import type { SucursalProps } from "@/pages/GestionSucursal/store/sucursalSlice";
import { useSucursalStore } from "@/pages/GestionSucursal/useSucursalStore";
import IconCR from "@/components/Icons/IconCR";
import { DataTableTest } from "@/components/DataTableTest/DataTableTest";
export const DataTableSucursal = ({ onOpenModalCustom, otrosBotones }: { onOpenModalCustom: (id:number) => void, otrosBotones: React.ReactNode }) => {
    const val = useAppSelector((state)=>state.SUCURSAL.sucursales)
    const { remove } = useSucursalStore()

    const columns = [
        {
            id: 0,
            header: 'ID',
            render: (rowData: SucursalProps) => <span>{rowData.id}</span>,
        },
        {
            id: 1,
            header: 'Código',
            render: (rowData: SucursalProps) => <span>{rowData.codigo}</span>,
        },
        {
            id: 2,
            header: 'Nombre',
            render: (rowData: SucursalProps) => <span>{rowData.nombre}</span>,
        },
        {
            id: 4,
            header: 'Tipo',
            render: (rowData: SucursalProps) => <span>{rowData.label_tipo}</span>,
        },
        {
            id: 5,
            header: 'Dirección',
            render: (rowData: SucursalProps) => <span>{rowData.direccion}</span>,
        },
        {
            id: 6,
            header: 'Ubigeo',
            render: (rowData: SucursalProps) => <span>{rowData.ubigeo}</span>,
        },
        {
            id: 7,
            header: 'Teléfono',
            render: (rowData: SucursalProps) => <span>{rowData.telefono}</span>,
        },
        {
            id: 8,
            header: 'Email',
            render: (rowData: SucursalProps) => <span>{rowData.email}</span>,
        },
        {
            id: 9,
            header: 'Responsable',
            render: (rowData: SucursalProps) => <span>{rowData.label_responsable}</span>,
        },
        {
            id: 10,
            header: 'Estado',
            render: (rowData: SucursalProps) => <span>{rowData.label_estado}</span>,
        },
        {
            id: 11,
            header: '',
            render: (rowData: SucursalProps) => {
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
