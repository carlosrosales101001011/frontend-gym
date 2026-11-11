import { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import IconCR from '@/components/Icons/IconCR'
import ModalCR from '@/components/Modal/ModalCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { BtnAdd, BtnDelete, BtnUpdate } from '@/components/Button/buttonsCrud'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { BuscadorPersona } from '@/components/BuscadorPersona/BuscadorPersona'
import type { ItemResultado } from '@/components/ModalSearching/ModalSearching'
import { useForm } from '@/hook/useForm'
import { useAppSelector } from '@/stores/Store'
import { localDateStringToDate } from '@/helpers/getDate'
import type { EventoAgendaProps } from '../store/agendaNutricionistaSlice'
import { useAgendaNutricionistaStore } from '../hook/useAgendaNutricionistaStore'
import {
  buscarCruce,
  DURACION_CITA_DEFAULT,
  DURACIONES_CITA,
  duracionEvento,
  estadosSeleccionables,
  obtenerEstado,
  sumarMinutos,
  tituloVista,
} from '../helpers/agendaHelpers'
import { HistorialCitasCliente } from '../components/HistorialCitasCliente'

const ID_TIPO_COLABORADOR = 1
const ID_TIPO_CLIENTE = 2

/** Persona mostrada en el buscador a partir del id y label guardados en el evento */
const aPersona = (id: number, nombre?: string): ItemResultado | null =>
  id ? { id, nombre: nombre ?? '', dni: '', email_personal: '', telefono: '' } : null

type ModalCustomEventoProps = {
  show: boolean
  onHide: () => void
  /**
   * Evento a editar (id !== 0) o uno nuevo con la fecha/hora del slot elegido en la vista semana.
   * La fecha y la hora de inicio no se editan: las define el slot. La hora de fin sale de la duración elegida.
   * El modal se monta al abrirse (ver App), así el form arranca con estos valores.
   */
  evento: EventoAgendaProps
}

export const ModalCustomEvento = ({ show, onHide, evento }: ModalCustomEventoProps) => {
  const { eventos, estados, guardarEvento, eliminarEvento, obtenerCitasDeCliente, obtenerUidCliente } = useAgendaNutricionistaStore()
  const { url_modulo } = useParams<{ url_modulo: string }>()
  const esSuperUsuario = useAppSelector((state) => state.SESION.usuario?.is_super_user)
  const { register, formState: { errors }, handleSubmit, setError, setValue, watch } = useForm<EventoAgendaProps>({ mode: 'onChange', defaultValues: evento })
  const [cliente, setCliente] = useState(() => aPersona(evento.id_cli, evento.label_cliente))
  const [nutricionista, setNutricionista] = useState(() => aPersona(evento.id_nutricionista, evento.label_nutricionista))
  // Al editar se respeta la duración guardada si es una de las permitidas
  const [duracion, setDuracion] = useState(() =>
    DURACIONES_CITA.some((d) => d.value === duracionEvento(evento)) ? duracionEvento(evento) : DURACION_CITA_DEFAULT)
  const horaFin = sumarMinutos(evento.hora_inicio, duracion)
  const esEdicion = evento.id !== 0
  /** Estado "Importante": la cita solo ocupa el horario, sin cliente ni nutricionista (quedan en 0 y ocultos) */
  const esBloqueado = (id_estado: unknown) => Boolean(obtenerEstado(estados, Number(id_estado)).bloqueado)
  const importante = esBloqueado(watch('id_estado'))
  const onCambiarEstado = (id_estado: unknown) => {
    if (!esBloqueado(id_estado)) return
    setCliente(null)
    setNutricionista(null)
    setValue('id_cli', 0)
    setValue('id_nutricionista', 0)
  }

  // Historial: todas las citas del cliente elegido (de cualquier fecha), pedidas al backend
  const [citasCliente, setCitasCliente] = useState<EventoAgendaProps[]>([])
  // Uid junto al cliente consultado: mientras llega el del cliente nuevo, "Ver perfil" queda desactivado
  const [perfilCliente, setPerfilCliente] = useState<{ id: number, uid?: string } | null>(null)
  const uidCliente = perfilCliente?.id === cliente?.id ? perfilCliente?.uid : undefined
  useEffect(() => {
    if (!cliente?.id) return
    const ctrl = new AbortController()
    obtenerCitasDeCliente(cliente.id, ctrl.signal).then((citas) => {
      if (!ctrl.signal.aborted) setCitasCliente(citas)
    })
    const { id } = cliente
    obtenerUidCliente(id, ctrl.signal).then((uid) => {
      if (!ctrl.signal.aborted) setPerfilCliente({ id, uid })
    })
    return () => ctrl.abort()
  }, [cliente?.id])

  const onSubmit = async (data: EventoAgendaProps) => {
    const valores: EventoAgendaProps = {
      ...evento,
      hora_fin: horaFin,
      id_cli: importante ? 0 : Number(data.id_cli),
      id_nutricionista: importante ? 0 : Number(data.id_nutricionista),
      id_estado: Number(data.id_estado),
      // Para mostrarlos en el calendario sin recargar (el hook no los envía al backend)
      label_cliente: cliente?.nombre,
      label_nutricionista: nutricionista?.nombre,
    }
    // Por seguridad: el slot pudo ocuparse mientras el modal estaba abierto
    const cruce = buscarCruce(valores, eventos)
    if (cruce) {
      // El error va en un campo visible: con "Importante" el de cliente está oculto
      setError(importante ? 'id_estado' : 'id_cli', {
        type: 'validate',
        // Sin nombre: es una cita importante
        message: `Se cruza con ${cruce.label_cliente ? `el evento de ${cruce.label_cliente}` : 'un evento importante'} (${cruce.hora_inicio} - ${cruce.hora_fin})`,
      })
      return
    }
    if (await guardarEvento(valores)) onHide()
  }

  const onEliminar = async () => {
    if (await eliminarEvento(evento.id)) onHide()
  }

  return (
    <ModalCR show={show} onHide={onHide} size={'lg'}>
      <ModalCR.Header>
        <ModalCR.Title>{esEdicion ? 'Editar evento' : 'Agregar evento'}</ModalCR.Title>
      </ModalCR.Header>
      <ModalCR.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card-mode-actual rounded p-2 mb-3">
            <div className="small">Horario de la cita</div>
            <div className="fw-bold">
              {tituloVista('dia', localDateStringToDate(evento.fecha))}
              {' · '}{evento.hora_inicio} - {horaFin}
            </div>
          </div>
          <Row className="g-3">
            {/* Columna 1: datos de la cita */}
            <Col lg={importante ? 12 : 6}>
              <Row className="g-2">
                <Col lg={12} className={importante ? 'd-none' : ''}>
                  <BuscadorPersona
                    idTipo={ID_TIPO_CLIENTE}
                    label="Cliente"
                    placeholder="Buscar Cliente por nombre, DNI o Telefono"
                    value={cliente}
                    onSelect={setCliente}
                    onChange={register('id_cli', { min: { value: 1, message: 'Selecciona un cliente' }, disabled: importante }).onChange}
                    soloNombre
                    required
                  />
                  <span className="text-danger fw-bold px-2" style={{ fontSize: '11px' }}>{errors.id_cli?.message}</span>
                </Col>
                <Col lg={12} className={importante ? 'd-none' : ''}>
                  <BuscadorPersona
                    idTipo={ID_TIPO_COLABORADOR}
                    label="Nutricionista"
                    placeholder="Buscar Nutricionista por nombre, DNI o Telefono"
                    value={nutricionista}
                    onSelect={setNutricionista}
                    onChange={register('id_nutricionista', { min: { value: 1, message: 'Selecciona un nutricionista' }, disabled: importante }).onChange}
                    soloNombre
                    required
                  />
                  <span className="text-danger fw-bold px-2" style={{ fontSize: '11px' }}>{errors.id_nutricionista?.message}</span>
                </Col>
                <Col lg={12}>
                  <InputSelectCR
                    options={DURACIONES_CITA}
                    label="Duración"
                    name="duracion"
                    defaultValue={String(duracion)}
                    onChange={(e) => setDuracion(Number(e.target.value) || DURACION_CITA_DEFAULT)}
                  />
                </Col>
                <Col lg={12}>
                  <InputSelectCR options={estadosSeleccionables(estados, esSuperUsuario)} {...register('id_estado', {
                    required: 'Este campo es obligatorio',
                    onChange: (e) => onCambiarEstado((e.currentTarget as unknown as { value: string }).value),
                  })} label="Estado" name="id_estado" messageErrors={errors.id_estado?.message} />
                </Col>
              </Row>
            </Col>
            {/* Columna 2: citas del cliente, se activa al seleccionar un cliente */}
            {!importante && (
              <Col lg={6}>
                <HistorialCitasCliente eventos={citasCliente} id_cli={cliente?.id} idEvento={evento.id} />
              </Col>
            )}
          </Row>
          <div className="d-flex flex-wrap align-items-center mt-2">
            {esEdicion
              ? <BtnUpdate label="Actualizar cita" type="submit" />
              : <BtnAdd label="Agregar cita" type="submit" />}
            {/* En otra pestaña: la cita que se está editando no se pierde */}
            {cliente && !importante && (
              <ButtonCR
                label="Ver perfil"
                variant="outline-primary"
                icon={<IconCR name="eye" size={14} className="" />}
                disabled={!uidCliente}
                onClick={() => window.open(`/${url_modulo}/perfil-paciente/${uidCliente}`, '_blank')}
              />
            )}
            {esEdicion && <BtnDelete label="Eliminar cita" onClick={onEliminar} />}
            <ButtonCR label={'Cancelar'} variant="link" className="ms-auto" onClick={onHide} />
          </div>
        </form>
      </ModalCR.Body>
    </ModalCR>
  )
}
