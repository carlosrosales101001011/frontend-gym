import { useEffect } from "react";
import DataTableCR from "@/components/DataTable/DataTableCR"
import { useAppSelector } from "@/stores/Store";
import type { SeccionxmodulouserProps } from "@/pages/GestionSeccionXmodulouser/store/seccionxmodulouserSlice";
import { useSeccionXmodulouserStore } from "@/pages/GestionSeccionXmodulouser/useSeccionXmodulouserStore";
import IconCR from "@/components/Icons/IconCR";
export const DataTableSeccionXmodulouser = ({ onOpenModalCustom }: { onOpenModalCustom: (id:number) => void }) => {
    const val = useAppSelector((state)=>state.SECCIONXMODULOUSER.seccionxmodulouser)
    const { obtener, remove } = useSeccionXmodulouserStore()
    useEffect(() => {
        obtener()
    }, [])
    
    const columns = [
        {
            id: 0,
            header: 'ID',
            render: (rowData: SeccionxmodulouserProps) => <span>{rowData.id}</span>,
        },
        {
            id: 1,
            header: 'Porcentaje o monto',
            render: (rowData: SeccionxmodulouserProps) => <span>{rowData.id_modulouser}</span>,
        },
        {
            id: 2,
            header: 'Nombre',
            render: (rowData: SeccionxmodulouserProps) => <span>{rowData.id_seccion}</span>,
        },
        {
            id: 7,
            header: '',
            render: (rowData: SeccionxmodulouserProps) => {
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
