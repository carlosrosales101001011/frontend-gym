import { DataTableTest } from "@/components/DataTableTest/DataTableTest"
import IconCR from "@/components/Icons/IconCR"
import type { PlanEntrenamientoProps } from "@/pages/GestionPlanesEntrenamiento/store/planEntrenamientoSlice"
import { usePlanEntrenamientoStore } from "@/pages/GestionPlanesEntrenamiento/usePlanEntrenamientoStore"
import { getFormatMoney } from "@/helpers/getFormatMoney"

export const DataTablePlanes = ({ onOpenModalCustom, otrosBotones }: { onOpenModalCustom: (id:number) => void, otrosBotones: React.ReactNode }) => {
    const { planes, eliminarPlan } = usePlanEntrenamientoStore()

    const columns = [
        {
            id: 0,
            header: 'ID',
            render: (rowData: PlanEntrenamientoProps) => <span>{rowData.id}</span>,
        },
        {
            id: 1,
            header: 'Programa', campoBusqueda: 'label_programa',
            render: (rowData: PlanEntrenamientoProps) => <span>{rowData.label_programa}</span>,
        },
        {
            id: 2,
            header: 'N° Meses',
            render: (rowData: PlanEntrenamientoProps) => <span>{rowData.nMeses} {rowData.nMeses === 1 ? 'mes' : 'meses'}</span>,
        },
        {
            id: 3,
            header: 'Precio total',
            render: (rowData: PlanEntrenamientoProps) => <span>{getFormatMoney(rowData.precioTotal)}</span>,
        },
        {
            id: 4,
            header: 'Tarifa', campoBusqueda: 'label_tipo_tarifa',
            render: (rowData: PlanEntrenamientoProps) => <span>{rowData.label_tipo_tarifa}</span>,
        },
        {
            id: 9,
            header: 'Descuento máximo',
            render: (rowData: PlanEntrenamientoProps) => {
                const maxDescuento = Number(rowData.max_descuento) || 0
                return <span>{maxDescuento > 0 ? getFormatMoney(maxDescuento) : 'Sin límite'}</span>
            },
        },
        {
            id: 5,
            header: 'Citas nutrición (regalo)',
            render: (rowData: PlanEntrenamientoProps) => <span>{rowData.citas_nutricion_regalo}</span>,
        },
        {
            id: 6,
            header: 'Días congelamiento (regalo)',
            render: (rowData: PlanEntrenamientoProps) => <span>{rowData.dias_congelamiento_regalo}</span>,
        },
        {
            id: 7,
            header: 'Estado',
            render: (rowData: PlanEntrenamientoProps) => <span>{rowData.estado ? 'Activo' : 'Inactivo'}</span>,
        },
        {
            id: 8,
            header: '',
            render: (rowData: PlanEntrenamientoProps) => {
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
        eliminarPlan(id)
    }

  return (
    <div>
        <DataTableTest
            congelarColumnas
            permitirOcultarColumnas
            permitirReordenarColumnas
            persistKey='planes-entrenamiento'
            mostrarFlechas
            classNameTablePagination='sticky-bottom-1'
            classNameToolBar="sticky-top-1"
            otrosBotones={otrosBotones}
            columns={columns}
            data={planes}
        />
    </div>
  )
}
