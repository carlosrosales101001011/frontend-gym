import { DataTableTest } from "@/components/DataTableTest/DataTableTest"
import IconCR from "@/components/Icons/IconCR"
import { useAppSelector } from "@/stores/Store"
import type { AlmacenProps } from "@/pages/GestionAlmacen/store/almacenSlice"
import { useAlmacenStore } from "@/pages/GestionAlmacen/useAlmacenStore"

export const DataTableAlmacen = ({ onOpenModalCustom, otrosBotones }: { onOpenModalCustom: (id:number) => void, otrosBotones: React.ReactNode }) => {
    const {almacenes} = useAppSelector((state)=>state.ALMACEN)
    const { remove } = useAlmacenStore()

    const columns = [
        {
            id: 0,
            header: 'ID',
            render: (rowData: AlmacenProps) => <span>{rowData.id}</span>,
        },
        {
            id: 1,
            header: 'Código',
            render: (rowData: AlmacenProps) => <span>{rowData.codigo}</span>,
        },
        {
            id: 2,
            header: 'Nombre',
            render: (rowData: AlmacenProps) => <span>{rowData.nombre}</span>,
        },
        {
            id: 4,
            header: 'Tipo',
            render: (rowData: AlmacenProps) => <span>{rowData.label_tipo}</span>,
        },
        {
            id: 5,
            header: 'Dirección',
            render: (rowData: AlmacenProps) => <span>{rowData.direccion}</span>,
        },
        {
            id: 6,
            header: 'Sucursal',
            render: (rowData: AlmacenProps) => <span>{rowData.label_sucursal}</span>,
        },
        {
            id: 9,
            header: 'Responsable',
            render: (rowData: AlmacenProps) => <span>{rowData.label_responsable}</span>,
        },
        {
            id: 10,
            header: 'Estado',
            render: (rowData: AlmacenProps) => <span>{rowData.label_estado}</span>,
        },
        {
            id: 11,
            header: '',
            render: (rowData: AlmacenProps) => {
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
            persistKey='almacen'
            mostrarFlechas
            classNameTablePagination='sticky-bottom-1'
            classNameToolBar="sticky-top-1"
            otrosBotones={otrosBotones}
            columns={columns}
            data={almacenes}
        />
    </div>
  )
}
