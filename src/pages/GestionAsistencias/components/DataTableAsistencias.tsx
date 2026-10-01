import { DataTableTest } from "@/components/DataTableTest/DataTableTest"
import IconCR from "@/components/Icons/IconCR"
import { formatDate } from "@/helpers/FormatDate"
import type { AsistenciaProps } from "../store/asistenciasSlice"
import { useAsistenciasStore } from "../hook/useAsistenciasStore"

type DataTableAsistenciasProps = {
  onOpenModalCustom: (id: number) => void
  otrosBotones: React.ReactNode
}

/** Listado de asistencias (la más reciente primero, lo ordena el backend) */
export const DataTableAsistencias = ({ onOpenModalCustom, otrosBotones }: DataTableAsistenciasProps) => {
  const { asistencias, eliminarAsistencia } = useAsistenciasStore()

  const columns = [
    {
      id: 0,
      header: 'ID',
      render: (rowData: AsistenciaProps) => <span>{rowData.id}</span>,
    },
    {
      id: 1,
      header: 'Persona', campoBusqueda: 'label_nombres_apellidos_persona',
      render: (rowData: AsistenciaProps) => <span>{rowData.label_nombres_apellidos_persona}</span>,
    },
    {
      id: 2,
      header: 'Tipo de evento', campoBusqueda: 'label_tipo_evento',
      render: (rowData: AsistenciaProps) => <span>{rowData.label_tipo_evento}</span>,
    },
    {
      id: 3,
      header: 'Fecha y hora',
      render: (rowData: AsistenciaProps) => <span>{formatDate(new Date(rowData.fecha_registro), 'yyyy-mm-dd', 'dd/mm/yyyy hh:mm')}</span>,
    },
    {
      id: 4,
      header: 'Dispositivo', campoBusqueda: 'deviceSN',
      render: (rowData: AsistenciaProps) => <span>{rowData.deviceSN || <span className="opacity-75">Manual</span>}</span>,
    },
    // {
    //   id: 5,
    //   header: '',
    //   render: (rowData: AsistenciaProps) => (
    //     <div className="d-flex">
    //       <div onClick={() => onOpenModalCustom(rowData.id)} className="cursor-pointer me-2" title="Editar">
    //         <IconCR name="edit" size={14}/>
    //       </div>
    //       <div onClick={() => eliminarAsistencia(rowData.id)} className="cursor-pointer" title="Eliminar">
    //         <IconCR name="delete" size={14}/>
    //       </div>
    //     </div>
    //   ),
    // },
  ]

  return (
    <div>
      <DataTableTest
        congelarColumnas
        permitirOcultarColumnas
        permitirReordenarColumnas
        persistKey='gestion-asistencias'
        mostrarFlechas
        classNameTablePagination='sticky-bottom-1'
        classNameToolBar="sticky-top-1"
        otrosBotones={otrosBotones}
        columns={columns}
        data={asistencias}
      />
    </div>
  )
}
