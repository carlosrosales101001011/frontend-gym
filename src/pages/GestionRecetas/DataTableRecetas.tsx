import { DataTableTest } from "@/components/DataTableTest/DataTableTest"
import IconCR from "@/components/Icons/IconCR"
import type { RecetaProps } from "@/pages/GestionRecetas/store/recetaSlice"
import { useRecetaStore } from "@/pages/GestionRecetas/useRecetaStore"

export const DataTableRecetas = ({ onOpenModalCustom, otrosBotones }: { onOpenModalCustom: (id:number) => void, otrosBotones: React.ReactNode }) => {
    const { recetas, eliminarReceta } = useRecetaStore()

    const columns = [
        {
            id: 0,
            header: 'ID',
            render: (rowData: RecetaProps) => <span>{rowData.id}</span>,
        },
        {
            id: 1,
            header: 'Título', campoBusqueda: 'titulo',
            render: (rowData: RecetaProps) => <span>{rowData.titulo}</span>,
        },
        {
            id: 2,
            header: 'Slug', campoBusqueda: 'slug',
            render: (rowData: RecetaProps) => <span>{rowData.slug}</span>,
        },
        {
            id: 3,
            header: 'Porciones',
            render: (rowData: RecetaProps) => <span>{rowData.porciones}</span>,
        },
        {
            id: 4,
            header: 'Dificultad', campoBusqueda: 'dificultad',
            render: (rowData: RecetaProps) => <span>{rowData.dificultad}</span>,
        },
        {
            id: 5,
            header: 'Kcal por porción',
            render: (rowData: RecetaProps) => <span>{rowData.nutricion?.por_porcion.kcal ?? 0}</span>,
        },
        {
            id: 6,
            header: 'P / C / G por porción (g)',
            render: (rowData: RecetaProps) => {
                const p = rowData.nutricion?.por_porcion
                return <span>{p ? `${p.proteinas_g} / ${p.carbohidratos_g} / ${p.grasas_g}` : '—'}</span>
            },
        },
        {
            id: 7,
            header: '',
            render: (rowData: RecetaProps) => (
                <div className="d-flex">
                    <div onClick={()=>onOpenModalCustom(rowData.id)} className="cursor-pointer me-2">
                        <IconCR name="edit" size={14}/>
                    </div>
                    <div onClick={()=>eliminarReceta(rowData.id)} className="cursor-pointer">
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
            persistKey='recetas'
            mostrarFlechas
            classNameTablePagination='sticky-bottom-1'
            classNameToolBar="sticky-top-1"
            otrosBotones={otrosBotones}
            columns={columns}
            data={recetas}
        />
    </div>
  )
}
