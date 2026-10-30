import { useMemo, useState } from 'react'
import ModalCR from '@/components/Modal/ModalCR'
import { DataTableSimple2, type ColumnaSimple2 } from '@/components/DataTableSimple/DataTableSimple2'
import { DescargarExcel, type ColumnaExcel } from '@/components/DescargarExcel/DescargarExcel'
import { formatDate } from '@/helpers/FormatDate'
import { getFormatMoney } from '@/helpers/getFormatMoney'
import { sumBy } from '@/helpers/reports'
import { useFormasPago } from '@/pages/DataVentas/hook/useFormasPago'
import { montoVendidoVenta, type FiltroMembresia } from '../helpers/resumenVentas'
import { ID_TODOS, type VentaReporteVentasProps } from '../store/reporteVentasSlice'

/** Qué se abre en el modal: las filas (ya filtradas) y el filtro de programa/plan con el que suman */
export type DetalleVentas = {
  /** Ej. "Ventas del rango", "Ingresos · Alvaro Salazar" */
  titulo: string
  filas: VentaReporteVentasProps[]
  filtro: FiltroMembresia
}

type ModalDetalleVentasProps = {
  detalle: DetalleVentas
  onHide: () => void
  /** true: cada fila es un pago (ingreso); false: una venta */
  porFechaPago: boolean
  /** yyyy-MM-dd (para el nombre del Excel) */
  fecha_inicio: string
  /** yyyy-MM-dd (para el nombre del Excel) */
  fecha_fin: string
}

const conFiltroMembresia = ({ idPrograma, idPlan }: FiltroMembresia) => idPrograma !== ID_TODOS || idPlan !== ID_TODOS

/** Fecha de la fila (yyyy-MM-dd): la del pago por fecha de pago, la de la venta si no */
const fechaFila = (fila: VentaReporteVentasProps) => fila.pago?.fecha_pago ?? fila.fecha_venta.slice(0, 10)
/** Total de la venta: membresías + productos */
const totalVenta = (fila: VentaReporteVentasProps) => (Number(fila.montoTotal_membresia) || 0) + (Number(fila.montoTotal_productos) || 0)
const labelFormaPagoDe = (formasPago: { value: number | string, label: string }[], id: number) =>
  formasPago.find((forma) => forma.value === id)?.label ?? `#${id}`

/**
 * Modal del detalle del reporte de ventas (card "Total vendido/ingresado" o click en una barra):
 * por fecha de pago, los ingresos (un pago por fila); por fecha de venta, las ventas.
 * El total de arriba es lo mismo que suma la card o la barra (con el filtro de programa/plan).
 */
export const ModalDetalleVentas = ({ detalle, onHide, porFechaPago, fecha_inicio, fecha_fin }: ModalDetalleVentasProps) => {
  const { filas, filtro, titulo } = detalle
  const { formasPago } = useFormasPago()
  // Filas que se ven (con buscador y orden): son las que se descargan
  const [visibles, setVisibles] = useState<VentaReporteVentasProps[]>([])
  const total = sumBy(filas, (fila) => montoVendidoVenta(fila, filtro))
  // Con programa/plan, la fila suma solo la parte de esas membresías: se muestra en su propia columna
  const parcial = conFiltroMembresia(filtro)

  // Memorizadas: si cambiaran en cada render, la tabla avisaría filas nuevas sin parar (onFilasVisibles)
  const columnas = useMemo<ColumnaSimple2<VentaReporteVentasProps>[]>(() => [
    {
      id: 'fecha',
      header: porFechaPago ? 'Fecha de pago' : 'Fecha de venta',
      render: (fila) => formatDate(fechaFila(fila), 'yyyy-mm-dd', 'dd/mm/yyyy'),
      sortValue: fechaFila,
    },
    {
      id: 'cliente',
      header: 'Cliente',
      render: (fila) => (
        <>
          <div>{fila.label_nombres_apellidos_cli || '—'}</div>
          {fila.label_documento_cli && <div className='small opacity-75'>{fila.label_documento_cli}</div>}
        </>
      ),
      sortValue: (fila) => fila.label_nombres_apellidos_cli ?? '',
      searchValue: (fila) => `${fila.label_nombres_apellidos_cli ?? ''} ${fila.label_documento_cli ?? ''}`,
    },
    {
      id: 'asesor',
      header: 'Asesor',
      render: (fila) => fila.label_nombres_apellidos_empl || '—',
      sortValue: (fila) => fila.label_nombres_apellidos_empl ?? '',
      searchValue: (fila) => fila.label_nombres_apellidos_empl ?? '',
    },
    {
      id: 'origen',
      header: 'Origen',
      render: (fila) => fila.label_origen || '—',
      sortValue: (fila) => fila.label_origen ?? '',
      searchValue: (fila) => fila.label_origen ?? '',
    },
    {
      id: 'tipo_cli',
      header: 'Tipo de cliente',
      render: (fila) => fila.label_tipo_cli || '—',
      sortValue: (fila) => fila.label_tipo_cli ?? '',
      searchValue: (fila) => fila.label_tipo_cli ?? '',
    },
    {
      id: 'comprobante',
      header: 'Comprobante',
      render: (fila) => fila.n_comprobante || 'Sin comprobante',
      searchValue: (fila) => fila.n_comprobante ?? '',
    },
    ...(porFechaPago ? [{
      id: 'forma_pago',
      header: 'Forma de pago',
      render: (fila: VentaReporteVentasProps) => fila.pago ? labelFormaPagoDe(formasPago, fila.pago.id_forma_pago) : '—',
      searchValue: (fila: VentaReporteVentasProps) => fila.pago ? labelFormaPagoDe(formasPago, fila.pago.id_forma_pago) : '',
    }] : []),
    {
      id: 'monto_venta',
      header: 'Monto de venta',
      render: (fila) => getFormatMoney(totalVenta(fila)),
      sortValue: totalVenta,
    },
    porFechaPago
      ? {
          id: 'monto',
          header: 'Monto pagado',
          render: (fila) => <span className={parcial ? '' : 'fw-semibold'}>{getFormatMoney(fila.pago?.monto ?? 0)}</span>,
          sortValue: (fila) => fila.pago?.monto ?? 0,
        }
      : {
          id: 'monto',
          header: 'Monto membresías',
          render: (fila) => <span className={parcial ? '' : 'fw-semibold'}>{getFormatMoney(Number(fila.montoTotal_membresia) || 0)}</span>,
          sortValue: (fila) => Number(fila.montoTotal_membresia) || 0,
        },
    ...(parcial ? [{
      id: 'parcial',
      header: porFechaPago ? 'Parte del programa/plan' : 'Monto del programa/plan',
      render: (fila: VentaReporteVentasProps) => <span className='fw-semibold'>{getFormatMoney(montoVendidoVenta(fila, filtro))}</span>,
      sortValue: (fila: VentaReporteVentasProps) => montoVendidoVenta(fila, filtro),
    }] : []),
  ], [porFechaPago, formasPago, filtro, parcial])

  const columnasExcel: ColumnaExcel<VentaReporteVentasProps>[] = [
    { header: porFechaPago ? 'Fecha de pago' : 'Fecha de venta', width: 14, valor: (fila) => formatDate(fechaFila(fila), 'yyyy-mm-dd', 'dd/mm/yyyy') },
    { header: 'Cliente', width: 34, valor: (fila) => fila.label_nombres_apellidos_cli ?? '' },
    { header: 'Documento', width: 18, valor: (fila) => fila.label_documento_cli ?? '' },
    { header: 'Asesor', width: 28, valor: (fila) => fila.label_nombres_apellidos_empl ?? '' },
    { header: 'Origen', width: 18, valor: (fila) => fila.label_origen ?? '' },
    { header: 'Tipo de cliente', width: 16, valor: (fila) => fila.label_tipo_cli ?? '' },
    { header: 'Comprobante', width: 16, valor: (fila) => fila.n_comprobante || 'Sin comprobante' },
    ...(porFechaPago ? [{ header: 'Forma de pago', width: 18, valor: (fila: VentaReporteVentasProps) => fila.pago ? labelFormaPagoDe(formasPago, fila.pago.id_forma_pago) : '' }] : []),
    { header: 'Monto de venta', width: 16, valor: totalVenta, esMonto: true },
    porFechaPago
      ? { header: 'Monto pagado', width: 16, valor: (fila) => fila.pago?.monto ?? 0, esMonto: true }
      : { header: 'Monto membresías', width: 18, valor: (fila) => Number(fila.montoTotal_membresia) || 0, esMonto: true },
    ...(parcial ? [{
      header: porFechaPago ? 'Parte del programa/plan' : 'Monto del programa/plan',
      width: 22,
      valor: (fila: VentaReporteVentasProps) => Math.round(montoVendidoVenta(fila, filtro) * 100) / 100,
      esMonto: true,
    }] : []),
  ]

  const cantidad = `${filas.length} ${porFechaPago ? (filas.length === 1 ? 'pago' : 'pagos') : (filas.length === 1 ? 'venta' : 'ventas')}`
  const archivo = `${porFechaPago ? 'ingresos' : 'ventas'}-${fecha_inicio}_${fecha_fin}`

  return (
    <ModalCR show onHide={onHide} size='xl'>
      <ModalCR.Header>
        <ModalCR.Title>{titulo}</ModalCR.Title>
      </ModalCR.Header>
      <ModalCR.Body>
        <div className='d-flex align-items-center justify-content-between gap-2 mb-2'>
          <div className='small fw-semibold'>{cantidad} · Total: {getFormatMoney(total)}</div>
          <DescargarExcel filas={visibles} columnas={columnasExcel} hoja={porFechaPago ? 'Ingresos' : 'Ventas'} archivo={archivo} />
        </div>
        <DataTableSimple2 data={filas} columns={columnas} defaultSort={{ id: 'fecha', dir: 'asc' }} onFilasVisibles={setVisibles} />
      </ModalCR.Body>
    </ModalCR>
  )
}
