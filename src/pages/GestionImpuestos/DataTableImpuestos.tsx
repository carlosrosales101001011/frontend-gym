import React from "react";
import { useAppSelector } from "@/stores/Store";
import type { ImpuestosProps } from "@/pages/GestionImpuestos/store/ImpuestoSlice";
import { useImpuestosStore } from "@/pages/GestionImpuestos/useImpuestosStore";
import IconCR from "@/components/Icons/IconCR";
import { DataTableTest } from "@/components/DataTableTest/DataTableTest";
export const DataTableImpuestos = ({ onOpenModalCustom, otrosBotones }: { onOpenModalCustom: (id:number) => void, otrosBotones: React.ReactNode }) => {
    const val = useAppSelector((state)=>state.IMPUESTO.impuestos)
    const { remove } = useImpuestosStore()
    
    const columns = [
        {
            id: 0,
            header: 'ID',
            render: (rowData: ImpuestosProps) => <span>{rowData.id}</span>,
        },
        {
            id: 1,
            header: 'Porcentaje o monto',
            render: (rowData: ImpuestosProps) => <span>{rowData.porcentaje}</span>,
        },
        {
            id: 2,
            header: 'Nombre',
            render: (rowData: ImpuestosProps) => <span>{rowData.nombre}</span>,
        },
        {
            id: 3,
            header: 'Descripción',
            render: (rowData: ImpuestosProps) => <span>{rowData.descripcion}</span>,
        },
        {
            id: 4,
            header: 'Aplica Sobre',
            render: (rowData: ImpuestosProps) => <span>{rowData.label_aplica_sobre}</span>,
        },
        {
            id: 5,
            header: 'Base de Cálculo',
            render: (rowData: ImpuestosProps) => <span>{rowData.label_base_calculo}</span>,
        },
        {
            id: 6,
            header: 'Tipo de Impuesto',
            render: (rowData: ImpuestosProps) => <span>{rowData.label_tipo}</span>,
        },
        {
            id: 7,
            header: '',
            render: (rowData: ImpuestosProps) => {
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
