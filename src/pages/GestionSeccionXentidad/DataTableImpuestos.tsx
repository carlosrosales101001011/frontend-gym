import { useEffect } from "react";
import DataTableCR from "@/components/DataTable/DataTableCR"
import { useAppSelector } from "@/stores/Store";
import type { ImpuestosProps } from "@/pages/GestionSeccionXentidad/store/ImpuestoSlice";
import { useImpuestosStore } from "@/pages/GestionSeccionXentidad/useImpuestosStore";
import IconCR from "@/components/Icons/IconCR";
export const DataTableImpuestos = ({ onOpenModalCustom }: { onOpenModalCustom: (id:number) => void }) => {
    const val = useAppSelector((state)=>state.IMPUESTO.impuestos)
    const { obtener, remove } = useImpuestosStore()
    useEffect(() => {
        obtener()
    }, [])
    
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
            render: (rowData: ImpuestosProps) => <span>{rowData.id_aplica_sobre}</span>,
        },
        {
            id: 5,
            header: 'Base de Cálculo',
            render: (rowData: ImpuestosProps) => <span>{rowData.id_base_calculo}</span>,
        },
        {
            id: 6,
            header: 'Tipo de Impuesto',
            render: (rowData: ImpuestosProps) => <span>{rowData.id_tipo}</span>,
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
        <DataTableCR
            columns={columns}
            data={val}
            countTotal={2} totalPages={2}
        />
    </div>
  )
}
