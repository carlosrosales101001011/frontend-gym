import { useAppSelector } from "@/stores/Store";
import type { ModuloProps } from "@/pages/GestionModulos/store/moduloSlice";
import IconCR from "@/components/Icons/IconCR";
import { useModuloStore } from "@/pages/GestionModulos/useModuloStore";
import { DataTableTest } from "@/components/DataTableTest/DataTableTest";
export const DataTableModulos = ({ onOpenModalCustom, otrosBotones }: { onOpenModalCustom: (id:number) => void; otrosBotones?: React.ReactNode }) => {
    const val = useAppSelector((state)=>state.MODULO.modulos)
    const {  remove } = useModuloStore()
    
    const columns = [
        {
            id: 0,
            header: 'ID',
            render: (rowData: ModuloProps) => <span>{rowData.id}</span>,
        },
        {
            id: 1,
            header: 'Icono',
            render: (rowData: ModuloProps) => <span>{rowData.icono}</span>,
        },
        {
            id: 2,
            header: 'Nombre',
            render: (rowData: ModuloProps) => <span>{rowData.label}</span>,
        },
        {
            id: 3,
            header: 'Descripción',
            render: (rowData: ModuloProps) => <span>{rowData.descripcion}</span>,
        },
        {
            id: 4,
            header: 'Url',
            render: (rowData: ModuloProps) => <span>{rowData.url}</span>,
        },
        {
            id: 5,
            header: 'Tipo',
            render: (rowData: ModuloProps) => <span>{rowData.id_tipo}</span>,
        },
        {
            id: 6,
            header: '',
            render: (rowData: ModuloProps) => {
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
