
import { useAppSelector } from "@/stores/Store";
import IconCR from "@/components/Icons/IconCR";
import { useSeccionesStore } from "@/pages/GestionSecciones/useSeccionesStore";
import type { SeccionProps } from "@/pages/GestionSecciones/store/seccionSlice";
import { DataTableTest } from "@/components/DataTableTest/DataTableTest";
export const DataTableSecciones = ({ onOpenModalCustom, otrosBotones }: { onOpenModalCustom: (id:number) => void, otrosBotones?: React.ReactNode }) => {
    const val = useAppSelector((state)=>state.SECCION.secciones)
    const { remove } = useSeccionesStore()
    
    const columns = [
        {
            id: 0,
            header: 'ID',
            render: (rowData: SeccionProps) => <span>{rowData.id}</span>,
        },
        {
            id: 1,
            header: 'Sub Sección',
            render: (rowData: SeccionProps) => <span>{rowData.subSeccion}</span>,
        },
        {
            id: 2,
            header: 'Icono',
            render: (rowData: SeccionProps) => <span>{rowData.icon}</span>,
        },
        {
            id: 3,
            header: 'Label',
            render: (rowData: SeccionProps) => <span>{rowData.label}</span>,
        },
        {
            id: 6,
            header: 'URL',
            render: (rowData: SeccionProps) => <span>{rowData.url}</span>,
        },
        {
            id: 7,
            header: '',
            render: (rowData: SeccionProps) => {
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
            persistKey='gestion-secciones'
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
