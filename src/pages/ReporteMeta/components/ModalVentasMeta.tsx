import { useEffect, useMemo, useState, type ReactNode } from 'react'
import ModalCR from '@/components/Modal/ModalCR'
import { DataTableSimple2, type ColumnaSimple2 } from '@/components/DataTableSimple/DataTableSimple2'
import { formatDate } from '@/helpers/FormatDate'
import { getFormatMoney } from '@/helpers/getFormatMoney'
import { useFormasPago } from '@/pages/DataVentas/hook/useFormasPago'
import { useReporteMetaStore } from '../hook/useReporteMetaStore'
import { ID_TODOS_ASESORES, type PagoReporteProps, type VentaReporteProps } from '../store/reporteMetaSlice'
import { DescargarExcel, type ColumnaExcel } from '@/components/DescargarExcel/DescargarExcel'

type ModalVentasMetaProps = {
  show: boolean
  onHide: () => void
  /** Ventas del periodo ya filtradas por asesor (las mismas que suman en "Venta total acumulada") */
  ventas: VentaReporteProps[]
  /** true: muestra los ingresos (pagos con fecha de pago en el periodo); false: las ventas por fecha de venta */
  porFechaPago: boolean
  /** yyyy-MM-dd */
  fecha_inicio: string
  /** yyyy-MM-dd (igual a fecha_inicio para ver un solo día, ej. al hacer click en un punto del gráfico) */
  fecha_fin: string
}

/** Columnas comunes a ventas e ingresos: cliente, asesor, tipo de cliente y comprobante */
type FilaComun = Pick<VentaReporteProps, 'label_nombres_apellidos_cli' | 'label_documento_cli' | 'label_nombres_apellidos_empl' | 'label_tipo_cli' | 'n_comprobante'>

const columnasComunes = <T extends FilaComun>(): ColumnaSimple2<T>[] => [
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
]

/**
 * Modal del detalle de la venta total acumulada del reporte de metas:
 * por fecha de pago muestra los ingresos (cada pago del periodo); por fecha de venta, las ventas
 */
export const ModalVentasMeta = ({ show, onHide, ventas, porFechaPago, fecha_inicio, fecha_fin }: ModalVentasMetaProps) => (
  <ModalCR show={show} onHide={onHide} size='xl'>
    <ModalCR.Header>
      <ModalCR.Title>
        {porFechaPago ? 'Ingresos' : 'Ventas'}
        {fecha_inicio === fecha_fin ? ` del ${formatDate(fecha_inicio, 'yyyy-mm-dd', 'd MMMM yyyy')}` : ' del periodo'}
      </ModalCR.Title>
    </ModalCR.Header>
    <ModalCR.Body>
      {/* Se monta al abrir: cada apertura vuelve a pedir los ingresos */}
      {show && (porFechaPago
        ? <TablaIngresos fecha_inicio={fecha_inicio} fecha_fin={fecha_fin} />
        : <TablaVentas ventas={ventas} fecha_inicio={fecha_inicio} fecha_fin={fecha_fin} />)}
    </ModalCR.Body>
  </ModalCR>
)

/** Sufijo del nombre del Excel: el día (un solo día) o el periodo */
const sufijoArchivo = (fecha_inicio: string, fecha_fin: string) =>
  fecha_inicio === fecha_fin ? fecha_inicio : `${fecha_inicio}_${fecha_fin}`

/** Columnas comunes del Excel (mismas que en la tabla) */
const columnasExcelComunes = <T extends FilaComun>(): ColumnaExcel<T>[] => [
  { header: 'Cliente', width: 34, valor: (fila) => fila.label_nombres_apellidos_cli ?? '' },
  { header: 'Documento', width: 18, valor: (fila) => fila.label_documento_cli ?? '' },
  { header: 'Asesor', width: 28, valor: (fila) => fila.label_nombres_apellidos_empl ?? '' },
  { header: 'Tipo de cliente', width: 16, valor: (fila) => fila.label_tipo_cli ?? '' },
  { header: 'Comprobante', width: 16, valor: (fila) => fila.n_comprobante || 'Sin comprobante' },
]

/** Resumen sobre la tabla (cantidad y total) con el botón de descarga a la derecha */
const ResumenTabla = ({ texto, children }: { texto: string, children: ReactNode }) => (
  <div className='d-flex align-items-center justify-content-between gap-2 mb-2'>
    <div className='small fw-semibold'>{texto}</div>
    {children}
  </div>
)

const montoVenta = (venta: VentaReporteProps) => Number(venta.montoTotal_membresia) || 0
/** Total de la venta: membresías + productos */
const totalVenta = (venta: VentaReporteProps) => montoVenta(venta) + (Number(venta.montoTotal_productos) || 0)

type TablaVentasProps = { ventas: VentaReporteProps[], fecha_inicio: string, fecha_fin: string }

const TablaVentas = ({ ventas, fecha_inicio, fecha_fin }: TablaVentasProps) => {
  // Filas que se ven (con buscador y orden): son las que se descargan
  const [visibles, setVisibles] = useState<VentaReporteProps[]>([])
  const total = ventas.reduce((suma, venta) => suma + montoVenta(venta), 0)
  // Memorizadas: si cambiaran en cada render, la tabla avisaría filas nuevas sin parar (onFilasVisibles)
  const columnas = useMemo<ColumnaSimple2<VentaReporteProps>[]>(() => [
    {
      id: 'fecha',
      header: 'Fecha de venta',
      render: (venta) => formatDate(venta.fecha_venta.slice(0, 10), 'yyyy-mm-dd', 'dd/mm/yyyy'),
      sortValue: (venta) => venta.fecha_venta,
    },
    ...columnasComunes<VentaReporteProps>(),
    {
      id: 'monto',
      header: 'Monto membresías',
      render: (venta) => <span className='fw-semibold'>{getFormatMoney(montoVenta(venta))}</span>,
      sortValue: montoVenta,
    },
    {
      id: 'monto_venta',
      header: 'Monto de venta',
      render: (venta) => getFormatMoney(totalVenta(venta)),
      sortValue: totalVenta,
    },
  ], [])
  const columnasExcel: ColumnaExcel<VentaReporteProps>[] = [
    { header: 'Fecha de venta', width: 14, valor: (venta) => formatDate(venta.fecha_venta.slice(0, 10), 'yyyy-mm-dd', 'dd/mm/yyyy') },
    ...columnasExcelComunes<VentaReporteProps>(),
    { header: 'Monto membresías', width: 18, valor: montoVenta, esMonto: true },
    { header: 'Monto de venta', width: 16, valor: totalVenta, esMonto: true },
  ]

  return (
    <>
      <ResumenTabla texto={`${ventas.length} ${ventas.length === 1 ? 'venta' : 'ventas'} · Total: ${getFormatMoney(total)}`}>
        <DescargarExcel filas={visibles} columnas={columnasExcel} hoja='Ventas' archivo={`ventas-meta-${sufijoArchivo(fecha_inicio, fecha_fin)}`} />
      </ResumenTabla>
      <DataTableSimple2 data={ventas} columns={columnas} defaultSort={{ id: 'fecha', dir: 'asc' }} onFilasVisibles={setVisibles} />
    </>
  )
}

/** Nombre de la forma de pago (igual que labelFormaPago de useFormasPago, pero sin depender de la función del hook) */
const labelFormaPagoDe = (formasPago: { value: number | string, label: string }[], id: number) =>
  formasPago.find((forma) => forma.value === id)?.label ?? `#${id}`

/** Pagos con fecha de pago en el periodo (con el mismo filtro de asesor que el resto del reporte) */
const TablaIngresos = ({ fecha_inicio, fecha_fin }: { fecha_inicio: string, fecha_fin: string }) => {
  const { obtenerPagosRango, idAsesorSeleccionado } = useReporteMetaStore()
  const { labelFormaPago, formasPago } = useFormasPago()
  const [pagos, setPagos] = useState<PagoReporteProps[] | null>(null)
  const [error, setError] = useState('')
  // Filas que se ven (con buscador y orden): son las que se descargan
  const [visibles, setVisibles] = useState<PagoReporteProps[]>([])

  useEffect(() => {
    obtenerPagosRango(fecha_inicio, fecha_fin)
      .then(setPagos)
      .catch((e) => setError(String(e)))
  }, [])

  // Memorizadas: si cambiaran en cada render, la tabla avisaría filas nuevas sin parar (onFilasVisibles).
  // Por eso solo dependen de valores estables (no de funciones del hook, que son nuevas en cada render).
  // Mismo filtro de asesor que filtrarVentasPorAsesor
  const ingresos = useMemo(
    () => (pagos ?? []).filter((pago) => idAsesorSeleccionado === ID_TODOS_ASESORES || pago.id_empl === idAsesorSeleccionado),
    [pagos, idAsesorSeleccionado]
  )
  const columnas = useMemo<ColumnaSimple2<PagoReporteProps>[]>(() => [
    {
      id: 'fecha',
      header: 'Fecha de pago',
      render: (pago) => formatDate(pago.fecha_pago, 'yyyy-mm-dd', 'dd/mm/yyyy'),
      sortValue: (pago) => pago.fecha_pago,
    },
    ...columnasComunes<PagoReporteProps>(),
    {
      id: 'forma_pago',
      header: 'Forma de pago',
      render: (pago) => labelFormaPagoDe(formasPago, pago.id_forma_pago),
      searchValue: (pago) => labelFormaPagoDe(formasPago, pago.id_forma_pago),
    },
    {
      id: 'monto_venta',
      header: 'Monto de venta',
      render: (pago) => getFormatMoney(pago.monto_venta),
      sortValue: (pago) => pago.monto_venta,
    },
    {
      id: 'monto',
      header: 'Monto pagado',
      render: (pago) => <span className='fw-semibold'>{getFormatMoney(pago.monto)}</span>,
      sortValue: (pago) => pago.monto,
    },
  ], [formasPago])

  if (error) return <div className='text-danger small'>No se pudieron cargar los ingresos: {error}</div>
  if (!pagos) return <div className='text-center text-secondary py-4'>Cargando ingresos...</div>

  const total = ingresos.reduce((suma, pago) => suma + pago.monto, 0)
  const columnasExcel: ColumnaExcel<PagoReporteProps>[] = [
    { header: 'Fecha de pago', width: 14, valor: (pago) => formatDate(pago.fecha_pago, 'yyyy-mm-dd', 'dd/mm/yyyy') },
    ...columnasExcelComunes<PagoReporteProps>(),
    { header: 'Forma de pago', width: 18, valor: (pago) => labelFormaPago(pago.id_forma_pago) },
    { header: 'Monto de venta', width: 16, valor: (pago) => pago.monto_venta, esMonto: true },
    { header: 'Monto pagado', width: 16, valor: (pago) => pago.monto, esMonto: true },
  ]

  return (
    <>
      <ResumenTabla texto={`${ingresos.length} ${ingresos.length === 1 ? 'pago' : 'pagos'} · Total ingresado: ${getFormatMoney(total)}`}>
        <DescargarExcel filas={visibles} columnas={columnasExcel} hoja='Ingresos' archivo={`ingresos-meta-${sufijoArchivo(fecha_inicio, fecha_fin)}`} />
      </ResumenTabla>
      <DataTableSimple2 data={ingresos} columns={columnas} defaultSort={{ id: 'fecha', dir: 'asc' }} onFilasVisibles={setVisibles} />
    </>
  )
}
