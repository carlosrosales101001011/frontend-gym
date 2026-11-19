import { DataTableTest } from "@/components/DataTableTest/DataTableTest"
import IconCR from "@/components/Icons/IconCR"
import type { IngredienteProps } from "@/pages/GestionIngredientes/store/ingredienteSlice"
import { useIngredienteStore } from "@/pages/GestionIngredientes/useIngredienteStore"

export const DataTableIngredientes = ({ onOpenModalCustom, otrosBotones }: { onOpenModalCustom: (id:number) => void, otrosBotones: React.ReactNode }) => {
    const { ingredientes, eliminarIngrediente } = useIngredienteStore()

    const columns = [
        {
            id: 0,
            header: 'ID',
            render: (rowData: IngredienteProps) => <span>{rowData.id}</span>,
        },
        {
            id: 1,
            header: 'Ingrediente', campoBusqueda: 'nombre',
            render: (rowData: IngredienteProps) => <span>{rowData.nombre}</span>,
        },
        {
            id: 2,
            header: 'Kcal (100 g)',
            render: (rowData: IngredienteProps) => <span>{Number(rowData.kcal)}</span>,
        },
        {
            id: 3,
            header: 'Proteínas (g)',
            render: (rowData: IngredienteProps) => <span>{Number(rowData.proteinas_g)}</span>,
        },
        {
            id: 4,
            header: 'Carbohidratos (g)',
            render: (rowData: IngredienteProps) => <span>{Number(rowData.carbohidratos_g)}</span>,
        },
        {
            id: 5,
            header: 'Grasas (g)',
            render: (rowData: IngredienteProps) => <span>{Number(rowData.grasas_g)}</span>,
        },
        {
            id: 6,
            header: 'Unidades',
            render: (rowData: IngredienteProps) => (
                <span>{rowData.unidades.map((u) => `${u.label_unidad} = ${Number(u.gramos)} g`).join(' · ')}</span>
            ),
        },
        {
            id: 7,
            header: 'Alérgenos',
            render: (rowData: IngredienteProps) => (
                <span>{rowData.alergenos.map((a) => a.label_alergeno).join(', ') || '—'}</span>
            ),
        },
        {
            id: 8,
            header: '',
            render: (rowData: IngredienteProps) => (
                <div className="d-flex">
                    <div onClick={()=>onOpenModalCustom(rowData.id)} className="cursor-pointer me-2">
                        <IconCR name="edit" size={14}/>
                    </div>
                    <div onClick={()=>eliminarIngrediente(rowData.id)} className="cursor-pointer">
                        <IconCR name="delete" size={14}/>
                    </div>
                </div>
            ),
        },
    ]

  return (
    <div>
        <DataTableTest
            congelarColumnas
            permitirOcultarColumnas
            permitirReordenarColumnas
            persistKey='ingredientes'
            mostrarFlechas
            classNameTablePagination='sticky-bottom-1'
            classNameToolBar="sticky-top-1"
            otrosBotones={otrosBotones}
            columns={columns}
            data={ingredientes}
        />
    </div>
  )
}
