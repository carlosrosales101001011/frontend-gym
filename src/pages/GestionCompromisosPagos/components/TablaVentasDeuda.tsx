import { DataTableSimple2, type ColumnaSimple2 } from '@/components/DataTableSimple/DataTableSimple2'
import { formatDate } from '@/helpers/FormatDate'
import { getFormatMoney } from '@/helpers/getFormatMoney'
import { deudaTotal, deudaVenta, nombreVenta, totalVenta, type VentaDeudaProps } from '@/pages/GestionCompromisosPagos/useCompromisoPagoStore'

type TablaVentasDeudaProps = {
  ventas: VentaDeudaProps[]
  /** Venta elegida en el formulario (su fila va resaltada); 0 = ninguna */
  idVentaElegida: number
  onElegir: (venta: VentaDeudaProps) => void
  cargando: boolean
}

/** Ventas con deuda del cliente elegido: comprobante, fecha, total, pagado y deuda; "Elegir" la usa en el compromiso */
export const TablaVentasDeuda = ({ ventas, idVentaElegida, onElegir, cargando }: TablaVentasDeudaProps) => {
  const columnas: ColumnaSimple2<VentaDeudaProps>[] = [
    { id: 'comprobante', header: 'Comprobante', render: nombreVenta },
    {
      id: 'fecha',
      header: 'Fecha',
      render: (venta) => formatDate(venta.fecha_venta.slice(0, 10), 'yyyy-mm-dd', 'dd/mm/yyyy'),
      sortValue: (venta) => venta.fecha_venta,
    },
    { id: 'total', header: 'Total', render: (venta) => getFormatMoney(totalVenta(venta)), sortValue: totalVenta },
    { id: 'pagado', header: 'Pagado', render: (venta) => getFormatMoney(Number(venta.montoPagos) || 0) },
    {
      id: 'deuda',
      header: 'Deuda',
      render: (venta) => <span className='fw-bold text-danger'>{getFormatMoney(deudaVenta(venta))}</span>,
      sortValue: deudaVenta,
    },
    {
      id: 'elegir',
      header: '',
      render: (venta) => venta.id === idVentaElegida
        ? <span className='small fw-semibold text-primary'>Elegida</span>
        : <button type='button' className='btn btn-link btn-sm p-0' onClick={() => onElegir(venta)}>Elegir</button>,
    },
  ]

  if (cargando) return <div className='small opacity-75 py-2'>Cargando ventas con deuda...</div>
  if (!ventas.length) return <div className='small opacity-75 py-2'>El cliente no tiene ventas con deuda.</div>

  return (
    <div>
      <div className='small fw-semibold mb-1'>
        Ventas con deuda ({ventas.length}) · Deuda total: <span className='text-danger'>{getFormatMoney(deudaTotal(ventas))}</span>
      </div>
      <DataTableSimple2
        data={ventas}
        columns={columnas}
        mostrarBuscador={false}
        mostrarTamanoPagina={false}
        defaultPageSize={5}
        rowClassName={(venta) => (venta.id === idVentaElegida ? 'fw-bold' : undefined)}
      />
    </div>
  )
}
