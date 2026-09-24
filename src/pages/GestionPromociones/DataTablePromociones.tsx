import React from "react";
import { useAppSelector } from "@/stores/Store";
import type { PromocionProps } from "@/pages/GestionPromociones/store/promocionSlice";
import { usePromocionesStore } from "@/pages/GestionPromociones/usePromocionesStore";
import IconCR from "@/components/Icons/IconCR";
import { DataTableTest } from "@/components/DataTableTest/DataTableTest";
export const DataTablePromociones = ({ onOpenModalCustom, otrosBotones }: { onOpenModalCustom: (id:number) => void, otrosBotones: React.ReactNode }) => {
    const { promociones } = useAppSelector((state)=>state.PROMOCION)
    const { remove } = usePromocionesStore()

    const columns = [
        {
            id: 0,
            header: 'ID',
            render: (rowData: PromocionProps) => <span>{rowData.id}</span>,
        },
        {
            id: 1,
            header: 'Código',
            render: (rowData: PromocionProps) => <span>{rowData.codigo}</span>,
        },
        {
            id: 2,
            header: 'Nombre',
            render: (rowData: PromocionProps) => <span>{rowData.nombre}</span>,
        },
        {
            id: 3,
            header: 'Tipo',
            render: (rowData: PromocionProps) => <span>{rowData.label_tipo_promocion}</span>,
        },
        {
            id: 4,
            header: 'Fecha Inicio',
            render: (rowData: PromocionProps) => <span>{rowData.fecha_inicio}</span>,
        },
        {
            id: 5,
            header: 'Fecha Fin',
            render: (rowData: PromocionProps) => <span>{rowData.fecha_fin}</span>,
        },
        {
            id: 6,
            header: 'Horario',
            render: (rowData: PromocionProps) => <span>{rowData.hora_inicio} - {rowData.hora_fin}</span>,
        },
        {
            id: 7,
            header: 'Prioridad',
            render: (rowData: PromocionProps) => <span>{rowData.prioridad}</span>,
        },
        {
            id: 8,
            header: 'Usos',
            render: (rowData: PromocionProps) => <span>{rowData.cantidad_usos}{rowData.cantidad_max_uso ? ` / ${rowData.cantidad_max_uso}` : ''}</span>,
        },
        {
            id: 9,
            header: 'Acumulable',
            render: (rowData: PromocionProps) => <span>{rowData.is_acumulable ? 'Sí' : 'No'}</span>,
        },
        {
            id: 10,
            header: 'Estado',
            render: (rowData: PromocionProps) => <span>{rowData.is_activo ? 'Activo' : 'Inactivo'}</span>,
        },
        {
            id: 11,
            header: '',
            render: (rowData: PromocionProps) => {
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
            persistKey='promocion'
            mostrarFlechas
            classNameTablePagination='sticky-bottom-1'
            classNameToolBar="sticky-top-1"
            otrosBotones={otrosBotones}
            columns={columns}
            data={promociones}
        />
    </div>
  )
}
