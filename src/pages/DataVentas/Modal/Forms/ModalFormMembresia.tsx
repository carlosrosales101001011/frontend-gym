import { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { addMonths, format } from 'date-fns'
import httpClient from '@/common/helpers/httpClient'
import ModalCR from '@/components/Modal/ModalCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputMontoCR } from '@/components/TextFields/InputMontoCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import type { OpcionesSelect } from '@/types/props'
import type { HorariosProps, PlanProps, ProgramaProps } from '@/pages/PuntoVenta/store/ventaSlice'
import type { DetalleMembresiaProps, MembresiaForm } from '../../types'
import { aFechaISO, aNumero, formatearMoneda, redondear2 } from '../../helpers'

const formularioVacio = (): MembresiaForm => ({
  id_programa: 0,
  id_plan: 0,
  id_horario: 0,
  fecha_inicio: format(new Date(), 'yyyy-MM-dd'),
  fecha_fin: '',
  montoSinDescuento: 0,
  montoDescuento: 0,
  montoTotal: 0,
})

const aFormulario = (detalle: DetalleMembresiaProps): MembresiaForm => ({
  id_programa: detalle.id_programa,
  id_plan: detalle.id_plan,
  id_horario: detalle.id_horario,
  fecha_inicio: aFechaISO(detalle.fecha_inicio),
  fecha_fin: aFechaISO(detalle.fecha_fin),
  montoSinDescuento: aNumero(detalle.montoSinDescuento) || aNumero(detalle.montoTotal) + aNumero(detalle.montoDescuento),
  montoDescuento: aNumero(detalle.montoDescuento),
  montoTotal: aNumero(detalle.montoTotal),
})

const calcularFechaFin = (fechaInicio: string, nMeses?: number) =>
  fechaInicio && nMeses ? format(addMonths(new Date(`${fechaInicio}T00:00:00`), nMeses), 'yyyy-MM-dd') : ''

const calcularTotal = (form: MembresiaForm) =>
  ({ ...form, montoTotal: redondear2(Math.max(0, form.montoSinDescuento - form.montoDescuento)) })

type ModalFormMembresiaProps = {
  show: boolean
  onHide: () => void
  /** Si se pasa, edita esa membresía; si no, agrega una nueva. */
  detalle?: DetalleMembresiaProps | null
  onGuardar: (values: MembresiaForm, idDetalle?: number) => Promise<boolean>
}

export const ModalFormMembresia = ({ show, onHide, detalle, onGuardar }: ModalFormMembresiaProps) => (
  <ModalCR show={show} onHide={onHide} size="lg">
    <ModalCR.Header>
      <ModalCR.Title>{detalle ? 'Editar membresía' : 'Agregar membresía'}</ModalCR.Title>
    </ModalCR.Header>
    <ModalCR.Body>
      {/* Se monta al abrir: el formulario arranca limpio en cada apertura. */}
      {show && <FormularioMembresia key={detalle?.id ?? 'nuevo'} detalle={detalle} onHide={onHide} onGuardar={onGuardar} />}
    </ModalCR.Body>
  </ModalCR>
)

const FormularioMembresia = ({ detalle, onHide, onGuardar }: Omit<ModalFormMembresiaProps, 'show'>) => {
  const [form, setForm] = useState<MembresiaForm>(() => (detalle ? aFormulario(detalle) : formularioVacio()))
  const [guardando, setGuardando] = useState(false)
  const [programas, setProgramas] = useState<OpcionesSelect[]>([])
  const [planesPorPrograma, setPlanesPorPrograma] = useState<{ id_programa: number; planes: PlanProps[]; horarios: OpcionesSelect[] }>(
    { id_programa: 0, planes: [], horarios: [] }
  )

  useEffect(() => {
    httpClient.get('/programa-entrenamiento')
      .then(({ data }: { data: { lista: ProgramaProps[] } }) => setProgramas(
        data.lista
          .filter((p) => p.estado || p.id === detalle?.id_programa)
          .map((p) => ({ value: p.id, label: p.nombre }))
      ))
      .catch(console.error)
  }, [detalle?.id_programa])

  const id_programa = form.id_programa
  useEffect(() => {
    if (!id_programa) return
    const cargarPlanesYHorarios = async () => {
      const [{ data: dataPlanes }, { data: dataHorarios }] = await Promise.all([
        httpClient.get(`/entrenamiento-plan/id_programa/${id_programa}`),
        httpClient.get(`/entrenamiento-horario/id_programa/${id_programa}`),
      ])
      const planes: PlanProps[] = dataPlanes.lista
      const horarios: HorariosProps[] = dataHorarios.lista
      setPlanesPorPrograma({
        id_programa,
        planes,
        horarios: horarios.map((h) => ({ value: h.id, label: `${h.horarioInicio} - ${h.horarioFin}` })),
      })
    }
    cargarPlanesYHorarios().catch(console.error)
  }, [id_programa])

  // Solo se usan si corresponden al programa seleccionado actualmente.
  const { planes, horarios } = planesPorPrograma.id_programa === id_programa
    ? planesPorPrograma
    : { planes: [] as PlanProps[], horarios: [] as OpcionesSelect[] }

  const nMesesPlan = planes.find((p) => p.id === form.id_plan)?.nMeses
    ?? (form.id_plan === detalle?.id_plan ? detalle?.nMeses_plan : undefined)

  const onSelectPrograma = (id_programa: number) =>
    setForm((prev) => calcularTotal({ ...prev, id_programa, id_plan: 0, id_horario: 0, fecha_fin: '', montoSinDescuento: 0 }))

  const onSelectPlan = (id_plan: number) => {
    const plan = planes.find((p) => p.id === id_plan)
    setForm((prev) => calcularTotal({
      ...prev,
      id_plan,
      fecha_fin: calcularFechaFin(prev.fecha_inicio, plan?.nMeses),
      montoSinDescuento: aNumero(plan?.precioTotal),
    }))
  }

  const onCambiarFechaInicio = (fecha_inicio: string) =>
    setForm((prev) => ({ ...prev, fecha_inicio, fecha_fin: calcularFechaFin(fecha_inicio, nMesesPlan) || prev.fecha_fin }))

  const onCambiarMonto = (campo: 'montoSinDescuento' | 'montoDescuento', valor: number) =>
    setForm((prev) => calcularTotal({ ...prev, [campo]: valor }))

  const valido = form.id_programa > 0 && form.id_plan > 0 && !!form.fecha_inicio && !!form.fecha_fin
    && form.montoDescuento <= form.montoSinDescuento

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valido) return
    setGuardando(true)
    const ok = await onGuardar(form, detalle?.id)
    setGuardando(false)
    if (ok) onHide()
  }

  return (
    <form onSubmit={onSubmit}>
      <Row className="g-2">
        <Col md={6}>
          <InputSelectCR
            label="Programa"
            required
            options={programas}
            defaultValue={String(form.id_programa)}
            onChange={(e) => onSelectPrograma(Number(e.target.value))}
          />
        </Col>
        <Col md={6}>
          <InputSelectCR
            label="Plan"
            required
            options={planes
              .filter((p) => p.estado || p.id === form.id_plan)
              .map((p) => ({ value: p.id, label: `${p.nMeses} ${p.nMeses === 1 ? 'mes' : 'meses'} · ${formatearMoneda(p.precioTotal)}` }))}
            defaultValue={String(form.id_plan)}
            onChange={(e) => onSelectPlan(Number(e.target.value))}
          />
        </Col>
        <Col md={6}>
          <InputSelectCR
            label="Horario"
            options={horarios}
            defaultValue={String(form.id_horario)}
            onChange={(e) => setForm((prev) => ({ ...prev, id_horario: Number(e.target.value) }))}
          />
        </Col>
        <Col md={3}>
          <InputCR
            type="date"
            label="Fecha de inicio"
            required
            value={form.fecha_inicio}
            onChange={(e) => onCambiarFechaInicio(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <InputCR
            type="date"
            label="Fecha de fin"
            required
            value={form.fecha_fin}
            onChange={(e) => setForm((prev) => ({ ...prev, fecha_fin: e.target.value }))}
          />
        </Col>
        <Col md={4}>
          <InputMontoCR
            label="Precio (sin descuento)"
            value={form.montoSinDescuento}
            onChange={(valor) => onCambiarMonto('montoSinDescuento', valor)}
          />
        </Col>
        <Col md={4}>
          <InputMontoCR
            label="Descuento"
            value={form.montoDescuento}
            onChange={(valor) => onCambiarMonto('montoDescuento', valor)}
            messageErrors={form.montoDescuento > form.montoSinDescuento ? 'No puede superar el precio' : ''}
          />
        </Col>
        <Col md={4} className="d-flex flex-column justify-content-center">
          <span className="text-secondary" style={{ fontSize: '13px' }}>Total</span>
          <span className="fw-bolder fs-5">{formatearMoneda(form.montoTotal)}</span>
        </Col>
        <Col xs={12} className="d-flex justify-content-end">
          <ButtonCR label="Cancelar" variant="link" onClick={onHide} disabled={guardando} />
          <ButtonCR label={guardando ? 'Guardando...' : 'Guardar'} type="submit" disabled={!valido || guardando} />
        </Col>
      </Row>
    </form>
  )
}
