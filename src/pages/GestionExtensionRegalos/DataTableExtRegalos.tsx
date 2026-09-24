import { format, parseISO } from "date-fns"
import { DataTableTest } from "@/components/DataTableTest/DataTableTest"
import IconCR from "@/components/Icons/IconCR"
import type { ExtRegaloProps } from "@/pages/GestionExtensionRegalos/store/extRegaloSlice"
import { useExtRegaloStore } from "@/pages/GestionExtensionRegalos/useExtRegaloStore"

const formatFecha = (fecha?: string|null) => fecha ? format(parseISO(fecha), 'dd/MM/yyyy') : ''

export const DataTableExtRegalos = ({ onOpenModalCustom, otrosBotones }: { onOpenModalCustom: (id:number) => void, otrosBotones: React.ReactNode }) => {
    const { extRegalos, eliminarExtRegalo } = useExtRegaloStore()

    const columns = [
        {
            id: 0,
            header: 'ID',
            render: (rowData: ExtRegaloProps) => <span>{rowData.id}</span>,
        },
        {
            id: 1,
            header: 'Cliente',
            render: (rowData: ExtRegaloProps) => <span>{rowData.label_nombres_apellidos_cli}</span>,
        },
        {
            id: 2,
            header: 'Comprobante',
            render: (rowData: ExtRegaloProps) => <span>{rowData.label_venta}</span>,
        },
        {
            id: 3,
            header: 'Tipo',
            render: (rowData: ExtRegaloProps) => <span>{rowData.label_tipo_extension}</span>,
        },
        {
            id: 4,
            header: 'Días regalados',
            render: (rowData: ExtRegaloProps) => <span>{rowData.dias_habiles}</span>,
        },
        {
            id: 5,
            header: 'Desde',
            render: (rowData: ExtRegaloProps) => <span>{formatFecha(rowData.fecha_inicio)}</span>,
        },
        {
            id: 6,
            header: 'Hasta',
            render: (rowData: ExtRegaloProps) => <span>{formatFecha(rowData.fecha_fin)}</span>,
        },
        {
            id: 7,
            header: 'Motivo',
            render: (rowData: ExtRegaloProps) => <span>{rowData.observacion}</span>,
        },
        {
            id: 8,
            header: '',
            render: (rowData: ExtRegaloProps) => {
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
        eliminarExtRegalo(id)
    }

  return (
    <div>
        <DataTableTest
            congelarColumnas
            permitirOcultarColumnas
            permitirReordenarColumnas
            persistKey='extension-regalos'
            mostrarFlechas
            classNameTablePagination='sticky-bottom-1'
            classNameToolBar="sticky-top-1"
            otrosBotones={otrosBotones}
            columns={columns}
            data={extRegalos}
        />
    </div>
  )
}
