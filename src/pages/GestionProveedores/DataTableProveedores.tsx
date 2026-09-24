import React, { useEffect } from 'react'
import { useProveedoresStore } from '@/pages/GestionProveedores/useProveedoresStore'
import { useAppSelector } from '@/stores/Store'
import type { ProveedorProps } from '@/pages/GestionProveedores/store/proveedorSlice'
import IconCR from '@/components/Icons/IconCR'
import DataTableCR from '@/components/DataTable/DataTableCR'

interface DataTableProveedoresProps {
  onOpenModalCustom: (id: number) => void
}

export const DataTableProveedores = ({ onOpenModalCustom }: DataTableProveedoresProps) => {
    const val = useAppSelector((state)=>state.PROVEEDOR.proveedores)
        const { obtener, remove } = useProveedoresStore()
        useEffect(() => {
            obtener()
        }, [])
        
        const columns = [
            {
                id: 0,
                header: 'ID',
                render: (rowData: ProveedorProps) => <span>{rowData.id}</span>,
            },
            {
                id: 1,
                header: 'Razon social',
                render: (rowData: ProveedorProps) => <span>{rowData.nombres}</span>,
            },
            {
                id: 2,
                header: 'Nombre Comercial',
                render: (rowData: ProveedorProps) => <span>{rowData.apodo}</span>,
            },
            {
                id: 4,
                header: 'Tipo de Documento',
                render: (rowData: ProveedorProps) => <span>{rowData.id_tipo_documento}</span>,
            },
            {
                id: 5,
                header: 'Número de Documento',
                render: (rowData: ProveedorProps) => <span>{rowData.numero_documento}</span>,
            },
            {
                id: 6,
                header: 'Nacionalidad',
                render: (rowData: ProveedorProps) => <span>{rowData.id_nacionalidad}</span>,
            },
            {
                id: 7,
                header: '',
                render: (rowData: ProveedorProps) => {
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
        <DataTableCR
            columns={columns}
            data={val}
            countTotal={2} totalPages={2}
        />
    </div>
  )
}
