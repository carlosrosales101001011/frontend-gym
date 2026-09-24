import { useEffect } from "react";
import { useAppSelector } from "@/stores/Store";
import type { grupoFinanzaProps } from "@/pages/GestionTermGrupoFinanzas/store/grupoFinanzasSlice";
import { useGrupoFinanzasStore } from "@/pages/GestionTermGrupoFinanzas/useGrupoFinanzasStore";
import IconCR from "@/components/Icons/IconCR";
import { DataTableTest } from "@/components/DataTableTest/DataTableTest";
export const DataTableGrupoFinanzas = ({ onOpenModalCustom, otrosBotones }: { onOpenModalCustom: (id:number) => void; otrosBotones?: React.ReactNode }) => {
    const val = useAppSelector((state)=>state.GRUPO_FINANZAS.gruposFinanzas)
    const { obtener, remove } = useGrupoFinanzasStore()
    useEffect(() => {
        obtener()
    }, [])
    
    const columns = [
        {
            id: 0,
            header: 'ID',
            render: (rowData: grupoFinanzaProps) => <span>{rowData.id}</span>,
        },
        {
            id: 2,
            header: 'Nombre',
            render: (rowData: grupoFinanzaProps) => <span>{rowData.nombre}</span>,
        },
        {
            id: 3,
            header: 'Descripción',
            render: (rowData: grupoFinanzaProps) => <span>{rowData.descripcion}</span>,
        },
        {
            id: 4,
            header: 'Orden',
            render: (rowData: grupoFinanzaProps) => <span>{rowData.orden}</span>,
        },
        {
            id: 5,
            header: 'Tipo de Impuesto',
            render: (rowData: grupoFinanzaProps) => <span>{rowData.id_tipo_movimiento}</span>,
        },
        {
            id: 6,
            header: '',
            render: (rowData: grupoFinanzaProps) => {
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
            otrosBotones={
                otrosBotones
            }
            mostrarFlechas
            classNameTablePagination='sticky-bottom-1'
            classNameToolBar="sticky-top-1"
            columns={columns}
            data={val}
        />
    </div>
  )
}
