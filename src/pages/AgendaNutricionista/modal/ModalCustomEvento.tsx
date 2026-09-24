import { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import ModalCR from '@/components/Modal/ModalCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { BuscadorPersona } from '@/components/BuscadorPersona/BuscadorPersona'
import type { ItemResultado } from '@/components/ModalSearching/ModalSearching'
import { useForm } from '@/hook/useForm'
import { localDateStringToDate } from '@/helpers/getDate'
import type { EventoAgendaProps } from '../store/agendaNutricionistaSlice'
import { useAgendaNutricionistaStore } from '../hook/useAgendaNutricionistaStore'
import {
  buscarCruce,
  DURACION_CITA_DEFAULT,
  DURACIONES_CITA,
  duracionEvento,
  ESTADOS_SELECCIONABLES,
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
  const { eventos, guardarEvento, eliminarEvento } = useAgendaNutricionistaStore()
  const { register, formState: { errors }, handleSubmit, setError } = useForm<EventoAgendaProps>({ mode: 'onChange', defaultValues: evento })
  const [cliente, setCliente] = useState(() => aPersona(evento.id_cli, evento.label_cliente))
  const [nutricionista, setNutricionista] = useState(() => aPersona(evento.id_nutricionista, evento.label_nutricionista))
  // Al editar se respeta la duración guardada si es una de las permitidas
  const [duracion, setDuracion] = useState(() =>
    DURACIONES_CITA.some((d) => d.value === duracionEvento(evento)) ? duracionEvento(evento) : DURACION_CITA_DEFAULT)
  const horaFin = sumarMinutos(evento.hora_inicio, duracion)
  const esEdicion = evento.id !== 0

  const onSubmit = async (data: EventoAgendaProps) => {
    const valores: EventoAgendaProps = {
      ...evento,
      hora_fin: horaFin,
      id_cli: Number(data.id_cli),
      id_nutricionista: Number(data.id_nutricionista),
      id_estado: Number(data.id_estado),
      // Para mostrarlos en el calendario sin recargar (el hook no los envía al backend)
      label_cliente: cliente?.nombre,
      label_nutricionista: nutricionista?.nombre,
    }
    // Por seguridad: el slot pudo ocuparse mientras el modal estaba abierto
    const cruce = buscarCruce(valores, eventos)
    if (cruce) {
      setError('id_cli', {
        type: 'validate',
        message: `Se cruza con el evento de ${cruce.label_cliente ?? ''} (${cruce.hora_inicio} - ${cruce.hora_fin})`,
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
            <Col lg={6}>
              <Row className="g-2">
                <Col lg={12}>
                  <BuscadorPersona
                    idTipo={ID_TIPO_CLIENTE}
                    label="Cliente"
                    placeholder="Buscar Cliente por nombre, DNI o Telefono"
                    value={cliente}
                    onSelect={setCliente}
                    onChange={register('id_cli', { min: { value: 1, message: 'Selecciona un cliente' } }).onChange}
                    soloNombre
                    required
                  />
                  <span className="text-danger fw-bold px-2" style={{ fontSize: '11px' }}>{errors.id_cli?.message}</span>
                </Col>
                <Col lg={12}>
                  <BuscadorPersona
                    idTipo={ID_TIPO_COLABORADOR}
                    label="Nutricionista"
                    placeholder="Buscar Nutricionista por nombre, DNI o Telefono"
                    value={nutricionista}
                    onSelect={setNutricionista}
                    onChange={register('id_nutricionista', { min: { value: 1, message: 'Selecciona un nutricionista' } }).onChange}
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
                  <InputSelectCR options={ESTADOS_SELECCIONABLES} {...register('id_estado', {
                    required: 'Este campo es obligatorio'
                  })} label="Estado" name="id_estado" messageErrors={errors.id_estado?.message} />
                </Col>
              </Row>
            </Col>
            {/* Columna 2: citas del cliente, se activa al seleccionar un cliente */}
            <Col lg={6}>
              <HistorialCitasCliente eventos={eventos} id_cli={cliente?.id} idEvento={evento.id} />
            </Col>
          </Row>
          <div className="d-flex align-items-center mt-2">
            <ButtonCR label={'Guardar'} type="submit" />
            <ButtonCR label={'Cancelar'} variant="link" onClick={onHide} />
            {esEdicion && (
              <ButtonCR label={'Eliminar'} variant="danger" className="ms-auto" onClick={onEliminar} />
            )}
          </div>
        </form>
      </ModalCR.Body>
    </ModalCR>
  )
}
