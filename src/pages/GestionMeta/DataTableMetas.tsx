import { DataTableTest } from "@/components/DataTableTest/DataTableTest"
import IconCR from "@/components/Icons/IconCR"
import type { MetaProps } from "@/pages/GestionMeta/store/metaSlice"
import { useMetaStore } from "@/pages/GestionMeta/useMetaStore"
import { formatDate } from "@/helpers/FormatDate"
import { getFormatMoney } from "@/helpers/getFormatMoney"

export const DataTableMetas = ({ onOpenModalCustom, otrosBotones }: { onOpenModalCustom: (id:number) => void, otrosBotones: React.ReactNode }) => {
    const { metas, eliminarMeta } = useMetaStore()

    const columns = [
        {
            id: 0,
            header: 'ID',
            render: (rowData: MetaProps) => <span>{rowData.id}</span>,
        },
        {
            id: 1,
            header: 'Nombre', campoBusqueda: 'nombre',
            render: (rowData: MetaProps) => <span>{rowData.nombre}</span>,
        },
        {
            id: 2,
            header: 'Fecha de inicio',
            render: (rowData: MetaProps) => <span>{formatDate(rowData.fecha_inicio, 'yyyy-mm-dd', 'dd/mm/yyyy')}</span>,
        },
        {
            id: 3,
            header: 'Fecha de fin',
            render: (rowData: MetaProps) => <span>{formatDate(rowData.fecha_fin, 'yyyy-mm-dd', 'dd/mm/yyyy')}</span>,
        },
        {
            id: 4,
            header: 'Monto de programas',
            render: (rowData: MetaProps) => <span>{getFormatMoney(Number(rowData.monto_programa) || 0)}</span>,
        },
        {
            id: 5,
            header: '',
            render: (rowData: MetaProps) => {
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
        eliminarMeta(id)
    }

  return (
    <div>
        <DataTableTest
            congelarColumnas
            permitirOcultarColumnas
            permitirReordenarColumnas
            persistKey='metas'
            mostrarFlechas
            classNameTablePagination='sticky-bottom-1'
            classNameToolBar="sticky-top-1"
            otrosBotones={otrosBotones}
            columns={columns}
            data={metas}
        />
    </div>
  )
}
