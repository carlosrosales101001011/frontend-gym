import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import ModalCR from "@/components/Modal/ModalCR";
import { useTerminologiaPersona } from "@/hook/usePropiedadesStore";
import { normalizeText } from "@/helpers/strings";
import { formatDate } from "@/helpers/FormatDate";
import { useFechaActual } from "@/hook/useFechaActual";
import { InputCR } from "@/components/TextFields/InputCR";
import { InputSelectCR } from "@/components/TextFields/InputSelectCR";
import { ID_SUBTIPO_ASISTENCIA_POR_DEFECTO, ID_TIPO_COLABORADOR } from "../store/asistenciasSlice";
import { ButtonCR } from "@/components/Button/ButtonCR";
import { BuscadorPersona } from "@/components/BuscadorPersona/BuscadorPersona";
import type { ItemResultado } from "@/components/ModalSearching/ModalSearching";
import type { OpcionesSelect } from "@/types/props";
import { useAsistenciasStore } from "../hook/useAsistenciasStore";
import { TIPO_EVENTO_MANUAL } from "@/hook/useRegistrarAsistencia";

type ModalCustomAsistenciaProps = {
  id: number
  show: boolean
  onHide: () => void
  /** Colaborador elegido en el buscador de "Registrar asistencia" */
  colaborador?: ItemResultado | null
}

/** Id del tipo de evento "Manual" dentro de la terminología (0 si no está) */
const buscarIdManual = (tipos: OpcionesSelect[]) =>
  tipos.find((tipo) => normalizeText(tipo.label) === TIPO_EVENTO_MANUAL)?.value ?? 0

/**
 * Registrar la asistencia de un colaborador (o editar una): llega con el colaborador ya elegido en el buscador
 * (se puede cambiar por otro colaborador) y se elige el Tipo (Entrada, Salida...).
 * Los clientes no pasan por aquí: se registran al elegirlos en el buscador (ver BuscadorRegistrarAsistencia).
 * Internamente: tipo de evento "Manual" y dispositivo '' al registrar; al editar se conservan los que ya tiene.
 * La fecha y hora las pone el backend al crear: aquí solo se muestran (al registrar, la actual, cambia cada minuto;
 * al editar, la guardada). Se monta al abrirse (ver App): arranca con los valores correctos.
 */
export const ModalCustomAsistencia = ({ id, show, onHide, colaborador = null }: ModalCustomAsistenciaProps) => {
  const { asistencias, guardarAsistencia } = useAsistenciasStore()
  const { data: dataTiposEvento, cargar: cargarTiposEvento } = useTerminologiaPersona('tipoEventoAsistencia')
  const { data: dataSubtipos, cargar: cargarSubtipos } = useTerminologiaPersona('subtipoAsistencia')
  const esEdicion = id !== 0
  // La fila del listado ya trae todos los datos (incluido el nombre de la persona)
  const asistencia = asistencias.find((a) => a.id === id)

  const [persona, setPersona] = useState<ItemResultado | null>(() => asistencia
    ? { id: asistencia.id_persona, nombre: asistencia.label_nombres_apellidos_persona ?? '', telefono: '', email_personal: '', dni: '' }
    : colaborador)
  // Tipo (Entrada, Salida...): al editar el que ya tiene; al registrar, Entrada
  const [idSubtipo, setIdSubtipo] = useState(() => asistencia?.id_subtipo || ID_SUBTIPO_ASISTENCIA_POR_DEFECTO)
  const [errorSubtipo, setErrorSubtipo] = useState('')
  const [errorPersona, setErrorPersona] = useState('')
  const [errorTipoEvento, setErrorTipoEvento] = useState('')
  const [guardando, setGuardando] = useState(false)
  // Al registrar corre el reloj; al editar se muestra la fecha guardada
  const ahora = useFechaActual(!esEdicion)
  const fechaMostrada = asistencia ? new Date(asistencia.fecha_registro) : ahora

  useEffect(() => {
    cargarTiposEvento()
    cargarSubtipos()
  }, [])

  /** Tipo de evento que se envía (no se muestra): al editar el que ya tiene; al registrar, "Manual" */
  const obtenerIdTipoEvento = async () => {
    if (asistencia?.id_tipo_evento) return asistencia.id_tipo_evento
    // Si todavía no llegaron los tipos de evento, se esperan
    const tipos = dataTiposEvento.length ? dataTiposEvento : (await cargarTiposEvento()) ?? []
    return buscarIdManual(tipos)
  }

  /** Valida y guarda la asistencia; si se guardó, cierra el modal */
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (guardando) return
    if (!persona) {
      setErrorPersona('Selecciona al colaborador')
      return
    }
    if (!idSubtipo) {
      setErrorSubtipo('Este campo es obligatorio')
      return
    }
    setGuardando(true)
    const idTipoEvento = await obtenerIdTipoEvento()
    if (!idTipoEvento) {
      setGuardando(false)
      setErrorTipoEvento('Falta el tipo de evento "Manual" en la terminología (persona / asistencia / tipo)')
      return
    }
    setErrorTipoEvento('')
    const guardado = await guardarAsistencia({
      id,
      id_persona: persona.id,
      id_tipo_evento: idTipoEvento,
      id_subtipo: idSubtipo,
      // Registro manual: sin dispositivo
      deviceSN: asistencia?.deviceSN ?? '',
    })
    setGuardando(false)
    if (guardado) onHide()
  }

  return (
    <ModalCR onHide={onHide} show={show} size='md' position='center'>
      <ModalCR.Header>
        <ModalCR.Title>{esEdicion ? 'Editar asistencia' : 'Registrar asistencia'}</ModalCR.Title>
      </ModalCR.Header>
      <ModalCR.Body>
        <form onSubmit={onSubmit}>
          <Row className="g-2">
            <Col lg={12}>
              {/* Al registrar solo colaboradores (los clientes se registran desde el buscador); al editar, cualquiera */}
              <BuscadorPersona
                label={esEdicion ? 'Persona' : 'Colaborador'}
                idTipo={esEdicion ? undefined : ID_TIPO_COLABORADOR}
                required
                soloNombre
                value={persona}
                onSelect={(elegida) => {
                  setPersona(elegida)
                  setErrorPersona('')
                }}
              />
              {errorPersona && <span className="text-danger fw-bold px-2" style={{ fontSize: '11px' }}>{errorPersona}</span>}
            </Col>
            <Col lg={12}>
              <InputSelectCR
                label='Tipo'
                required
                options={dataSubtipos}
                defaultValue={String(idSubtipo)}
                onChange={(e) => {
                  setIdSubtipo(Number(e.target.value))
                  setErrorSubtipo('')
                }}
                messageErrors={errorSubtipo}
              />
            </Col>
            <Col lg={12}>
              {/* Solo informativo: la fecha la pone el backend */}
              <InputCR label='Fecha y hora' value={formatDate(fechaMostrada, 'yyyy-mm-dd', 'dd/mm/yyyy hh:mm')} readOnly disabled />
            </Col>
          </Row>
          {errorTipoEvento && <div className="text-danger fw-bold small mt-2">{errorTipoEvento}</div>}
          <div className="d-flex align-items-center mt-3">
            <ButtonCR label={guardando ? 'Guardando...' : 'Guardar'} type='submit' disabled={guardando} />
            <ButtonCR label='Cancelar' variant='link' onClick={onHide} disabled={guardando} />
          </div>
        </form>
      </ModalCR.Body>
    </ModalCR>
  )
}
