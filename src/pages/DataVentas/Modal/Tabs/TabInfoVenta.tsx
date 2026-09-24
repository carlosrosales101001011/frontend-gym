import { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import httpClient from '@/common/helpers/httpClient'
import { CardEditable } from '@/components/CardEditable/CardEditable'
import { FieldGrid } from '@/components/FieldText/FieldGrid'
import { ResumenMontos } from '@/components/ResumenMontos/ResumenMontos'
import type { ItemResultado } from '@/components/ModalSearching/ModalSearching'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import type { OpcionesSelect } from '@/types/props'
import { BuscadorPersona } from '@/components/BuscadorPersona/BuscadorPersona'
import type { SucursalProps } from '@/pages/PuntoVenta/store/ventaSlice'
import type { UseVentaDetalle } from '../../hook/useVentaDetalle'
import type { VentaEditableForm, VentaInfoProps } from '../../types'
import { aFechaHoraLocal, aNumero, formatearFechaHora } from '../../helpers'

const ID_TIPO_COLABORADOR = 1
const ID_TIPO_CLIENTE = 2

const aPersona = (id: number, nombre: string, dni: string): ItemResultado | null =>
  id ? { id, nombre, dni, email_personal: '', telefono: '' } : null

const aFormulario = (venta: VentaInfoProps): VentaEditableForm => ({
  id_cli: venta.id_cli,
  id_empl: venta.id_empl,
  id_origen: venta.id_origen,
  id_sucursal: venta.id_sucursal,
  id_tipo_comprobante: venta.id_tipo_comprobante,
  n_comprobante: venta.n_comprobante ?? '',
  fecha_venta: aFechaHoraLocal(venta.fecha_venta),
})

type TabInfoVentaProps = {
  venta: VentaInfoProps
  actualizarVenta: UseVentaDetalle['actualizarVenta']
}

export const TabInfoVenta = ({ venta, actualizarVenta }: TabInfoVentaProps) => {
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState<VentaEditableForm>(() => aFormulario(venta))
  const [cliente, setCliente] = useState<ItemResultado | null>(null)
  const [asesor, setAsesor] = useState<ItemResultado | null>(null)
  const [sucursales, setSucursales] = useState<OpcionesSelect[]>([])
  const { cargar: cargarComprobantes, data: dataComprobantes } = useTerminologiaPersona('tipoComprobantes')
  const { cargar: cargarOrigenVenta, data: dataOrigenVenta } = useTerminologiaPersona('origenVenta')

  useEffect(() => {
    if (!editando) return
    cargarComprobantes()
    cargarOrigenVenta()
    httpClient.get('/empresa-sucursal')
      .then(({ data }: { data: { lista: SucursalProps[] } }) => setSucursales(data.lista.map((s) => ({ value: s.id, label: s.nombre }))))
      .catch(console.error)
  }, [editando, cargarComprobantes, cargarOrigenVenta])

  const onEditar = () => {
    setForm(aFormulario(venta))
    setCliente(aPersona(venta.id_cli, venta.label_nombres_apellidos_cli, venta.label_documento_cli))
    setAsesor(aPersona(venta.id_empl, venta.label_nombres_apellidos_empl, venta.label_documento_empl))
    setEditando(true)
  }

  const onCambiar = <K extends keyof VentaEditableForm>(campo: K, valor: VentaEditableForm[K]) =>
    setForm((prev) => ({ ...prev, [campo]: valor }))

  const onGuardar = async () => {
    setGuardando(true)
    const { fecha_venta, ...resto } = form
    const ok = await actualizarVenta({
      ...resto,
      // datetime-local está en hora local; se envía en ISO (UTC)
      ...(fecha_venta ? { fecha_venta: new Date(fecha_venta).toISOString() } : {}),
    })
    setGuardando(false)
    if (ok) setEditando(false)
  }

  const montoMembresia = aNumero(venta.montoTotal_membresia)
  const montoProductos = aNumero(venta.montoTotal_productos)
  const montoPagos = aNumero(venta.montoPagos)
  const total = montoMembresia + montoProductos

  return (
    <Row className="g-3 pt-2">
      <Col lg={8}>
        <CardEditable
          titulo="Información de la venta"
          editando={editando}
          onEditar={onEditar}
          onCancelar={() => setEditando(false)}
          onGuardar={onGuardar}
          guardando={guardando}
        >
          {editando ? (
            <Row className="g-2">
              <Col lg={6}>
                <BuscadorPersona
                  idTipo={ID_TIPO_CLIENTE}
                  label="Cliente"
                  placeholder="Buscar Cliente por nombre, DNI o Telefono"
                  value={cliente}
                  onSelect={(persona) => { setCliente(persona); onCambiar('id_cli', persona.id) }}
                  soloNombre
                  required
                />
              </Col>
              <Col lg={6}>
                <BuscadorPersona
                  idTipo={ID_TIPO_COLABORADOR}
                  label="Asesor / Vendedor"
                  placeholder="Buscar Asesor por nombre, DNI o Telefono"
                  value={asesor}
                  onSelect={(persona) => { setAsesor(persona); onCambiar('id_empl', persona.id) }}
                  soloNombre
                  required
                />
              </Col>
              <Col lg={6}>
                <InputSelectCR
                  label="Origen"
                  options={dataOrigenVenta}
                  defaultValue={String(form.id_origen)}
                  onChange={(e) => onCambiar('id_origen', Number(e.target.value))}
                />
              </Col>
              <Col lg={6}>
                <InputSelectCR
                  label="Sucursal"
                  options={sucursales}
                  defaultValue={String(form.id_sucursal)}
                  onChange={(e) => onCambiar('id_sucursal', Number(e.target.value))}
                />
              </Col>
              <Col lg={6}>
                <InputSelectCR
                  label="Tipo de comprobante"
                  options={dataComprobantes}
                  defaultValue={String(form.id_tipo_comprobante)}
                  onChange={(e) => onCambiar('id_tipo_comprobante', Number(e.target.value))}
                />
              </Col>
              <Col lg={6}>
                <InputCR
                  label="N° comprobante"
                  value={form.n_comprobante}
                  onChange={(e) => onCambiar('n_comprobante', e.target.value)}
                />
              </Col>
              <Col lg={6}>
                <InputCR
                  type="datetime"
                  label="Fecha de venta"
                  value={form.fecha_venta}
                  onChange={(e) => onCambiar('fecha_venta', e.target.value)}
                />
              </Col>
            </Row>
          ) : (
            <FieldGrid
              campos={[
                { label: 'Cliente', value: venta.label_nombres_apellidos_cli },
                { label: 'Documento cliente', value: venta.label_documento_cli },
                { label: 'Asesor / Vendedor', value: venta.label_nombres_apellidos_empl },
                { label: 'Fecha de venta', value: formatearFechaHora(venta.fecha_venta) },
                { label: 'Origen', value: venta.label_origen },
                { label: 'Sucursal', value: venta.label_sucursal },
                { label: 'Tipo de comprobante', value: venta.label_tipo_comprobante },
                { label: 'N° comprobante', value: venta.n_comprobante },
                { label: 'Observación', value: venta.observacion, col: 12 },
              ]}
            />
          )}
        </CardEditable>
      </Col>
      <Col lg={4}>
        <ResumenMontos
          titulo="Resumen"
          items={[
            { label: 'Membresía', monto: montoMembresia },
            { label: 'Productos', monto: montoProductos },
            { label: 'Descuento aplicado', monto: venta.montoDescuento, tipo: 'descuento' },
            { label: 'Total', monto: total, tipo: 'total' },
            { label: 'Pagado', monto: montoPagos },
            { label: 'Saldo pendiente', monto: Math.max(0, total - montoPagos), tipo: 'resaltado' },
          ]}
        />
      </Col>
    </Row>
  )
}
