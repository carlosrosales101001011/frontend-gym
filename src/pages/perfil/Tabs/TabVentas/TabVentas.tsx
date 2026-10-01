import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { DataTableSimple2, type ColumnaSimple2 } from '@/components/DataTableSimple/DataTableSimple2'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { formatDate } from '@/helpers/FormatDate'
import { getFormatMoney } from '@/helpers/getFormatMoney'
import { ModalInfoVentas } from '@/pages/DataVentas/ModalInfoVentas'
import { totalVenta, useVentasCliente, type VentaClienteProps } from './useVentasCliente'

type TabVentasProps = {
  /** Si el tab está a la vista: cada vez que se activa se vuelven a pedir las ventas */
  activo: boolean
}

/** Ventas del cliente del perfil; "Ver detalle" abre la misma información de venta que el módulo Ventas */
export const TabVentas = ({ activo }: TabVentasProps) => {
  const { uid_person } = useParams<{ uid_person: string }>()
  const { ventas, cargando, obtenerVentas } = useVentasCliente()
  const [idVentaDetalle, setIdVentaDetalle] = useState(0)

  useEffect(() => {
    if (activo && uid_person) obtenerVentas(uid_person)
  }, [activo, uid_person])

  const columnas: ColumnaSimple2<VentaClienteProps>[] = [
    {
      id: 'fecha',
      header: 'Fecha',
      render: (venta) => <span className="text-capitalize">{formatDate(venta.fecha_venta.slice(0, 10), 'yyyy-mm-dd', 'd MMMM yyyy')}</span>,
      sortValue: (venta) => venta.fecha_venta,
    },
    {
      id: 'comprobante',
      header: 'Comprobante',
      render: (venta) => (
        <div>
          <div>{venta.n_comprobante}</div>
          <div className="small opacity-75">{venta.label_tipo_comprobante}</div>
        </div>
      ),
      searchValue: (venta) => `${venta.n_comprobante} ${venta.label_tipo_comprobante}`,
    },
    {
      id: 'asesor',
      header: 'Asesor',
      render: (venta) => venta.label_nombres_apellidos_empl,
      searchValue: (venta) => venta.label_nombres_apellidos_empl ?? '',
    },
    {
      id: 'total',
      header: 'Total',
      render: (venta) => <span className="fw-semibold">{getFormatMoney(totalVenta(venta))}</span>,
      sortValue: (venta) => totalVenta(venta),
    },
    {
      id: 'pagado',
      header: 'Pagado',
      render: (venta) => {
        const pagado = Number(venta.montoPagos) || 0
        const debe = totalVenta(venta) - pagado
        return (
          <div>
            <div>{getFormatMoney(pagado)}</div>
            {debe > 0 && <div className="small text-danger">Debe {getFormatMoney(debe)}</div>}
          </div>
        )
      },
      sortValue: (venta) => Number(venta.montoPagos) || 0,
    },
    {
      id: 'detalle',
      header: '',
      render: (venta) => <ButtonCR label="Ver detalle" onClick={() => setIdVentaDetalle(venta.id)} />,
    },
  ]

  return (
    <div className="position-relative p-2" style={{ minHeight: '160px' }}>
      <LoadingOverlay show={cargando} interno texto="Cargando ventas" />
      {!cargando && ventas.length === 0 ? (
        <p className="small opacity-75 mb-0">El cliente no tiene ventas.</p>
      ) : (
        <DataTableSimple2 columns={columnas} data={ventas} />
      )}
      <ModalInfoVentas
        show={idVentaDetalle !== 0}
        id={idVentaDetalle}
        onHide={() => setIdVentaDetalle(0)}
        onCambio={() => uid_person && obtenerVentas(uid_person)}
      />
    </div>
  )
}
