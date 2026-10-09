import { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import ModalCR from '@/components/Modal/ModalCR'
import { DataTableSimple2, type ColumnaSimple2 } from '@/components/DataTableSimple/DataTableSimple2'
import { ButtonCR } from '@/components/Button/ButtonCR'
import IconCR from '@/components/Icons/IconCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { formatDate } from '@/helpers/FormatDate'
import { MAX_DIAS_REGALO } from '@/pages/GestionExtensionRegalos/store/extRegaloSlice'
import type { MembresiaDetalleProps } from './types'
import {
  ID_EXTENSION_CONGELAMIENTO,
  ID_EXTENSION_REGALO,
  useDetalleMembresia,
  type CitaNutricionProps,
  type ExtensionMembresiaProps,
  type NuevaExtension,
} from './useDetalleMembresia'

/** Qué se ve en el modal: congelamientos y regalos se pueden registrar; las citas son solo para ver */
export type DetalleMembresia = 'congelamiento' | 'regalo' | 'citas'

const TITULO: Record<DetalleMembresia, string> = {
  congelamiento: 'Congelamientos',
  regalo: 'Días de regalo',
  citas: 'Citas con la nutricionista',
}

const fecha = (valor: string) => formatDate(valor, 'yyyy-mm-dd', 'dd/mm/yyyy')
const dias = (n: number) => `${n} ${n === 1 ? 'día' : 'días'}`

const columnasExtension: ColumnaSimple2<ExtensionMembresiaProps>[] = [
  { id: 'inicio', header: 'Desde', render: (e) => fecha(e.fecha_inicio), sortValue: (e) => e.fecha_inicio },
  { id: 'fin', header: 'Hasta', render: (e) => fecha(e.fecha_fin), sortValue: (e) => e.fecha_fin },
  { id: 'dias', header: 'Días', render: (e) => <strong>{e.dias_habiles}</strong>, sortValue: (e) => e.dias_habiles },
  {
    id: 'observacion', header: 'Observación',
    render: (e) => e.observacion || <span className="opacity-50">—</span>,
    searchValue: (e) => e.observacion ?? '',
  },
]

const columnasCitas: ColumnaSimple2<CitaNutricionProps>[] = [
  { id: 'fecha', header: 'Fecha', render: (c) => fecha(c.fecha), sortValue: (c) => `${c.fecha} ${c.hora_inicio}` },
  { id: 'hora', header: 'Hora', render: (c) => `${c.hora_inicio} · ${c.duracionxmin} min` },
  {
    id: 'nutricionista', header: 'Nutricionista',
    render: (c) => c.label_nombres_apellidos_empl || <span className="opacity-50">—</span>,
    searchValue: (c) => c.label_nombres_apellidos_empl ?? '',
  },
  {
    id: 'estado', header: 'Estado',
    render: (c) => c.label_estado || <span className="opacity-50">—</span>,
    searchValue: (c) => c.label_estado ?? '',
    sortValue: (c) => c.label_estado ?? '',
  },
]

type ModalDetalleMembresiaProps = {
  detalle: DetalleMembresia
  membresia: MembresiaDetalleProps
  show: boolean
  onHide: () => void
  /** Tras registrar un congelamiento o regalo (ej. para recargar las membresías) */
  onRegistrado: () => void
}

/**
 * Detalle de una membresía del perfil en una tabla: congelamientos o regalos de su venta (con su botón para registrar
 * uno nuevo) o las citas de nutrición del cliente dentro de la membresía (solo vista).
 */
export const ModalDetalleMembresia = ({ detalle, membresia, show, onHide, onRegistrado }: ModalDetalleMembresiaProps) => {
  const { extensiones, citas, cargando, guardando, obtenerExtensiones, obtenerCitas, registrarExtension } = useDetalleMembresia()
  const [formAbierto, setFormAbierto] = useState(false)

  const cargar = () => {
    if (detalle === 'citas') obtenerCitas(membresia.id_cli)
    else obtenerExtensiones(membresia.id_venta)
  }

  useEffect(() => {
    if (show) cargar()
  }, [show])

  const idTipo = detalle === 'congelamiento' ? ID_EXTENSION_CONGELAMIENTO : ID_EXTENSION_REGALO
  const extensionesTipo = extensiones.filter((e) => e.id_tipo_extension === idTipo)
  // Citas dentro de la membresía (de su inicio a su vencimiento)
  const citasMembresia = citas.filter((c) =>
    (!membresia.fecha_inicio || c.fecha >= membresia.fecha_inicio) && c.fecha <= membresia.fecha_vencimiento)

  const onGuardado = () => {
    setFormAbierto(false)
    cargar()
    onRegistrado()
  }

  return (
    <ModalCR show={show} onHide={onHide} size="lg" position="center">
      <ModalCR.Header>
        <ModalCR.Title>{TITULO[detalle]}</ModalCR.Title>
      </ModalCR.Header>
      <ModalCR.Body>
        <div className="position-relative" style={{ minHeight: 160 }}>
          <LoadingOverlay show={cargando} interno texto="Cargando" />

          {detalle === 'congelamiento' && (
            <p className="small mb-2">
              Usó <strong>{membresia.dias_congelados}</strong> de <strong>{dias(membresia.congelamiento_regalados)}</strong> de congelamiento.
            </p>
          )}
          {detalle === 'citas' && (
            <p className="small mb-2">
              Usó <strong>{membresia.citas_atendidas}</strong> de <strong>{membresia.citas_regaladas}</strong> citas
              regaladas (cuentan las atendidas dentro de la membresía).
            </p>
          )}

          {detalle !== 'citas' && (
            formAbierto ? (
              <FormExtension
                detalle={detalle}
                diasMaximos={detalle === 'congelamiento'
                  ? Math.max(0, membresia.congelamiento_regalados - membresia.dias_congelados)
                  : MAX_DIAS_REGALO}
                guardando={guardando}
                onCancelar={() => setFormAbierto(false)}
                onGuardar={async (extension) => {
                  if (await registrarExtension(membresia.id_venta, membresia.id_cli, extension)) onGuardado()
                }}
              />
            ) : (
              <div className="mb-2">
                <ButtonCR
                  label={detalle === 'congelamiento' ? 'Registrar congelamiento' : 'Registrar regalo'}
                  icon={<IconCR name="plus" size={14} />}
                  onClick={() => setFormAbierto(true)}
                />
              </div>
            )
          )}

          {detalle === 'citas'
            ? <DataTableSimple2 data={citasMembresia} columns={columnasCitas} />
            : <DataTableSimple2 data={extensionesTipo} columns={columnasExtension} />}
        </div>
      </ModalCR.Body>
    </ModalCR>
  )
}

type FormExtensionProps = {
  detalle: 'congelamiento' | 'regalo'
  /** Congelamiento: días que le quedan; regalo: máximo por extensión */
  diasMaximos: number
  guardando: boolean
  onCancelar: () => void
  onGuardar: (extension: NuevaExtension) => void
}

/** Formulario de un congelamiento (desde / hasta) o un regalo (días); ambos con observación */
const FormExtension = ({ detalle, diasMaximos, guardando, onCancelar, onGuardar }: FormExtensionProps) => {
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [diasRegalo, setDiasRegalo] = useState('')
  const [observacion, setObservacion] = useState('')
  const [intentoGuardar, setIntentoGuardar] = useState(false)

  // Congelamiento: días corridos de desde a hasta, ambos incluidos
  const diasCongelamiento = desde && hasta ? differenceInCalendarDays(parseISO(hasta), parseISO(desde)) + 1 : 0
  const errores = detalle === 'congelamiento'
    ? {
        desde: !desde ? 'Indica desde cuándo' : '',
        hasta: !hasta ? 'Indica hasta cuándo'
          : diasCongelamiento < 1 ? 'Debe ser igual o posterior a "Desde"'
          : diasCongelamiento > diasMaximos ? `Le quedan ${dias(diasMaximos)} de congelamiento` : '',
      }
    : {
        dias: !/^\d+$/.test(diasRegalo) || Number(diasRegalo) < 1 ? 'Ingresa un número entero mayor a 0'
          : Number(diasRegalo) > diasMaximos ? `Máximo ${diasMaximos} días` : '',
      }
  const errorObservacion = detalle === 'regalo' && !observacion.trim() ? 'Indica el motivo del regalo' : ''
  const valido = Object.values(errores).every((e) => !e) && !errorObservacion
  const mostrar = (mensaje: string) => (intentoGuardar ? mensaje : '')

  const guardar = () => {
    setIntentoGuardar(true)
    if (!valido) return
    onGuardar(detalle === 'congelamiento'
      ? { id_tipo_extension: ID_EXTENSION_CONGELAMIENTO, fecha_inicio: desde, fecha_fin: hasta, observacion: observacion.trim() }
      : { id_tipo_extension: ID_EXTENSION_REGALO, dias_habiles: Number(diasRegalo), observacion: observacion.trim() })
  }

  return (
    <div className="card-mode-actual rounded p-3 mb-3">
      <Row className="g-2">
        {detalle === 'congelamiento' ? (
          <>
            <Col md={6}>
              <InputCR type="date" label="Desde" value={desde} onChange={(e) => setDesde(e.target.value)} messageErrors={mostrar(errores.desde ?? '')} />
            </Col>
            <Col md={6}>
              <InputCR type="date" label="Hasta" value={hasta} onChange={(e) => setHasta(e.target.value)} messageErrors={mostrar(errores.hasta ?? '')} />
            </Col>
            {diasCongelamiento > 0 && (
              <Col xs={12} className="small">
                Congela <strong>{dias(diasCongelamiento)}</strong> · le quedan {dias(diasMaximos)}
              </Col>
            )}
          </>
        ) : (
          <Col md={6}>
            <InputCR label={`Días de regalo (máx. ${diasMaximos})`} inputMode="numeric" value={diasRegalo}
              onChange={(e) => setDiasRegalo(e.target.value)} messageErrors={mostrar(errores.dias ?? '')} />
          </Col>
        )}
        <Col xs={12}>
          <InputCR type="text-area" label={detalle === 'regalo' ? 'Observación / motivo' : 'Observación'} value={observacion}
            maxLength={250} onChange={(e) => setObservacion(e.target.value)} messageErrors={mostrar(errorObservacion)} />
        </Col>
      </Row>
      <div className="d-flex align-items-center mt-2">
        <ButtonCR label={guardando ? 'Guardando…' : 'Guardar'} disabled={guardando} onClick={guardar} />
        <ButtonCR label="Cancelar" variant="link" onClick={onCancelar} />
      </div>
    </div>
  )
}
