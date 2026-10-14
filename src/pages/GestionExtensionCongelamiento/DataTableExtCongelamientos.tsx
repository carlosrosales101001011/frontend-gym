import { DataTableTest } from "@/components/DataTableTest/DataTableTest"
import type { ExtCongelamientoProps } from "@/pages/GestionExtensionCongelamiento/store/extCongelamientoSlice"
import { useExtCongelamientoStore } from "@/pages/GestionExtensionCongelamiento/useExtCongelamientoStore"
import { formatDate } from "@/helpers/FormatDate"

/** yyyy-mm-dd (o ISO) => dd/mm/yyyy */
const dia = (fecha?: string | null) => formatDate((fecha ?? '').slice(0, 10), 'yyyy-mm-dd', 'dd/mm/yyyy')

/** Solo lectura: sin editar ni eliminar */
export const DataTableExtCongelamientos = () => {
    const { extCongelamientos } = useExtCongelamientoStore()

    const columns = [
        {
            id: 0,
            header: 'ID',
            render: (rowData: ExtCongelamientoProps) => <span>{rowData.id}</span>,
        },
        {
            id: 1,
            header: 'Cliente', campoBusqueda: 'label_nombres_apellidos_cli',
            render: (rowData: ExtCongelamientoProps) => <span>{rowData.label_nombres_apellidos_cli}</span>,
        },
        {
            id: 2,
            header: 'Comprobante', campoBusqueda: 'label_venta',
            render: (rowData: ExtCongelamientoProps) => <span>{rowData.label_venta}</span>,
        },
        {
            id: 3,
            header: 'Programa', campoBusqueda: 'label_nombre_programa',
            render: (rowData: ExtCongelamientoProps) => <span>{rowData.label_nombre_programa ?? '-'}</span>,
        },
        {
            id: 4,
            header: 'Desde',
            render: (rowData: ExtCongelamientoProps) => <span>{dia(rowData.fecha_inicio)}</span>,
        },
        {
            id: 5,
            header: 'Hasta',
            render: (rowData: ExtCongelamientoProps) => <span>{dia(rowData.fecha_fin)}</span>,
        },
        {
            id: 6,
            header: 'Días congelados',
            render: (rowData: ExtCongelamientoProps) => <span>{rowData.dias_habiles} {rowData.dias_habiles === 1 ? 'día' : 'días'}</span>,
        },
        {
            id: 7,
            header: 'Motivo', campoBusqueda: 'observacion',
            render: (rowData: ExtCongelamientoProps) => <span>{rowData.observacion || '-'}</span>,
        },
    ]

  return (
    <div>
        <DataTableTest
            congelarColumnas
            permitirOcultarColumnas
            permitirReordenarColumnas
            persistKey='extension-congelamientos'
            mostrarFlechas
            classNameTablePagination='sticky-bottom-1'
            classNameToolBar="sticky-top-1"
            columns={columns}
            data={extCongelamientos}
        />
    </div>
  )
}
