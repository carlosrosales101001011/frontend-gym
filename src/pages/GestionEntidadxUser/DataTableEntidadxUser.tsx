import { useEffect } from "react";
import DataTableCR from "@/components/DataTable/DataTableCR"
import { useAppSelector } from "@/stores/Store";
import type { EntidadxUserProps } from "@/pages/GestionEntidadxUser/store/entidadxuserSlice";
import IconCR from "@/components/Icons/IconCR";
import { useEntidadxUserStore } from "@/pages/GestionEntidadxUser/useEntidadxUserStore";
export const DataTableEntidadxUser = ({ onOpenModalCustom }: { onOpenModalCustom: (id:number) => void }) => {
    const val = useAppSelector((state)=>state.ENTIDADXUSER.entidadesxUser)
    const { obtener, remove } = useEntidadxUserStore()
    useEffect(() => {
        obtener()
    }, [])
    
    const columns = [
        {
            id: 0,
            header: 'ID',
            render: (rowData: EntidadxUserProps) => <span>{rowData.id}</span>,
        },
        {
            id: 1,
            header: 'Entidad',
            render: (rowData: EntidadxUserProps) => <span>{rowData.id_entidad}</span>,
        },
        {
            id: 2,
            header: 'Usuario',
            render: (rowData: EntidadxUserProps) => <span>{rowData.id_user}</span>,
        },
        {
            id: 3,
            header: 'Estado de Creación',
            render: (rowData: EntidadxUserProps) => <span>{rowData.id_estado_CREATE}</span>,
        },
        {
            id: 4,
            header: 'Estado de Lectura',
            render: (rowData: EntidadxUserProps) => <span>{rowData.id_estado_READ}</span>,
        },
        {
            id: 5,
            header: 'Estado de Actualización',
            render: (rowData: EntidadxUserProps) => <span>{rowData.id_estado_UPDATE}</span>,
        },
        {
            id: 6,
            header: 'Estado de Eliminación',
            render: (rowData: EntidadxUserProps) => <span>{rowData.id_estado_DELETE}</span>,
        },
        {
            id: 7,
            header: '',
            render: (rowData: EntidadxUserProps) => {
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
