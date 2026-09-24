import DataTableCR from '@/components/DataTable/DataTableCR'
import IconCR from '@/components/Icons/IconCR'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import type { RootState } from '@/stores/Store'
import type { DetalleEgresoProps } from '@/pages/GestionEgresos/DetalleEgreso/store/detalleEgresoSlice'
import { useDetalleEgresosStore } from '@/pages/GestionEgresos/DetalleEgreso/useDetalleEgresoStore'

export const DataTableDetalleEgreso = () => {
  const { detallesEgreso } = useSelector((state: RootState)=>state.DETALLE_EGRESO)
  const { egreso } = useSelector((state: RootState)=>state.EGRESO)
  const { obtenerDetalleEgresosxIDMov } = useDetalleEgresosStore()
  useEffect(() => {
    if (egreso.id !== 0) {
      obtenerDetalleEgresosxIDMov(egreso.id)
    }}, [egreso.id])
  const columns = [
          {
            id: 0,
            header: 'Id',
            render: (row:DetalleEgresoProps) => (
              <div>
                {JSON.stringify(row.is_old, null, 2)}
              </div>
            ),
          },
          {
            id: 1,
            header: 'Servicio/producto',
            render: (row:DetalleEgresoProps) => (
              <div>
                {row.nombre_articulo}
              </div>
            ),
          },
          {
            id: 2,
            header: 'Cantidad',
            render: (row:DetalleEgresoProps) => (
              <div>
                {row.cantidad} unidad
              </div>
            ),
          },
          {
            id: 3,
            header: 'Monto Unitario',
            render: (row:DetalleEgresoProps) => (
              <div>
                ${row.monto}
              </div>
            ),
          },
          {
            id: 4,
            header: 'Centro de costo',
            render: (row:DetalleEgresoProps) => (
              <div>
                {row.id_centro_costo}
              </div>
            ),
          },
          {
            id: 5,
            header: 'Codigo de asiento',
            render: (row:DetalleEgresoProps) => (
              <div>
                {row.codigo_asiento}
              </div>
            ),
          },
          {
            id: 6,
            header: 'Total',
            render: (row:DetalleEgresoProps) => (
              <div>
                ${row.cantidad * row.monto}
              </div>
            ),
          },
          {
            id: 7,
            header: '',
            render: (row:DetalleEgresoProps) => (
              <div>
                <span onClick={()=>onEdit(row.id, row.id_movimiento_financiero)}>
                  <IconCR name='edit'/>
                </span>
                <span onClick={()=>onDelete(row.id, row.id_movimiento_financiero)}>
                  <IconCR name='delete'/>
                </span>
              </div>
            ),
          },
        ]
        const onDelete = (_id: number, _id_movimiento_financiero: number)=>{
          
        }
        const onEdit = (_id: number, _id_movimiento_financiero: number)=>{

        }
  return (
    <div>
      {egreso.id}
      <DataTableCR
        showPagination={false}
        isUrlPagination={false}
        permitirOcultarColumnas={false}
        permitirReordenarColumnas={false}
        mostrarFlechasScroll={false}
        columns={columns}
        data={detallesEgreso}
        totalPages={1}
        countTotal={1}
      />
    </div>
  )
}
