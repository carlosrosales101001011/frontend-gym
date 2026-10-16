import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import ModalCR from "@/components/Modal/ModalCR";
import { useTerminologiaPersona } from "@/hook/usePropiedadesStore";
import { normalizeText } from "@/helpers/strings";
import { formatDate } from "@/helpers/FormatDate";
import { useFechaActual } from "@/hook/useFechaActual";
import { InputCR } from "@/components/TextFields/InputCR";
import { InputSelectCR } from "@/components/TextFields/InputSelectCR";
import { ID_SUBTIPO_ASISTENCIA_POR_DEFECTO } from "../store/asistenciasSlice";
import { ButtonCR } from "@/components/Button/ButtonCR";
import { BuscadorPersona } from "@/components/BuscadorPersona/BuscadorPersona";
import type { ItemResultado } from "@/components/ModalSearching/ModalSearching";
import { useAsistenciasStore } from "../hook/useAsistenciasStore";
import { useMembresiaActual } from "../hook/useMembresiaActual";
import { TIPO_EVENTO_MANUAL } from "@/hook/useRegistrarAsistencia";
import { CardMembresiaAsistencia } from "./CardMembresiaAsistencia";

const ID_TIPO_COLABORADOR = 1
/** Cuánto se ve la membresía del cliente guardado al elegirlo antes de cerrar el modal */
const SEGUNDOS_MOSTRAR_MEMBRESIA = 3

type ModalCustomAsistenciaProps = {
  id: number
  show: boolean
  onHide: () => void
}

/**
 * Registrar o editar una asistencia: se elige la persona (se busca entre todas: clientes y colaboradores).
 * Al registrar, un cliente se guarda al elegirlo (como Entrada) y el modal se cierra tras mostrar su membresía unos
 * segundos; a un colaborador se le elige el Tipo y se guarda con el botón.
 * Internamente: tipo de evento "Manual" y dispositivo '' al registrar; al editar se conservan los que ya tiene.
 * La fecha y hora las pone el backend al crear: aquí solo se muestran (al registrar, la actual, cambia cada minuto;
 * al editar, la guardada). Se monta al abrirse (ver App): arranca con los valores correctos.
 */
export const ModalCustomAsistencia = ({ id, show, onHide }: ModalCustomAsistenciaProps) => {
  const { asistencias, guardarAsistencia } = useAsistenciasStore()
  const { data: dataTiposEvento, cargar: cargarTiposEvento } = useTerminologiaPersona('tipoEventoAsistencia')
  const { data: dataSubtipos, cargar: cargarSubtipos } = useTerminologiaPersona('subtipoAsistencia')
  const esEdicion = id !== 0
  // La fila del listado ya trae todos los datos (incluido el nombre de la persona)
  const asistencia = asistencias.find((a) => a.id === id)

  const [persona, setPersona] = useState<ItemResultado | null>(() => asistencia
    ? { id: asistencia.id_persona, nombre: asistencia.label_nombres_apellidos_persona ?? '', telefono: '', email_personal: '', dni: '' }
    : null)
  // Tipo (Entrada, Salida...): al editar el que ya tiene; al registrar, Entrada
  const [idSubtipo, setIdSubtipo] = useState(() => asistencia?.id_subtipo || ID_SUBTIPO_ASISTENCIA_POR_DEFECTO)
  const [errorSubtipo, setErrorSubtipo] = useState('')
  const [errorPersona, setErrorPersona] = useState('')
  const [errorTipoEvento, setErrorTipoEvento] = useState('')
  const [guardando, setGuardando] = useState(false)
  // Cliente guardado al elegirlo: se muestra su membresía unos segundos antes de cerrar
  const [registradoAuto, setRegistradoAuto] = useState(false)
  // Al registrar corre el reloj; al editar se muestra la fecha guardada
  const ahora = useFechaActual(!esEdicion)
  const fechaMostrada = asistencia ? new Date(asistencia.fecha_registro) : ahora
  // Membresía (programa, plan y si está pagada) solo para clientes: los colaboradores no tienen
  const esColaborador = persona?.idTipo === ID_TIPO_COLABORADOR
  const { membresia, cargando: cargandoMembresia } = useMembresiaActual(esColaborador ? undefined : persona?.id)

  useEffect(() => {
    cargarTiposEvento()
    cargarSubtipos()
  }, [])

  // Cierra a los segundos de que la membresía terminó de cargar (si se cierra antes, se cancela)
  useEffect(() => {
    if (!registradoAuto || cargandoMembresia) return
    const timer = setTimeout(onHide, SEGUNDOS_MOSTRAR_MEMBRESIA * 1000)
    return () => clearTimeout(timer)
  }, [registradoAuto, cargandoMembresia])

  // Tipo de evento que se envía (no se muestra): al editar el que ya tiene; al registrar, "Manual"
  const idManual = dataTiposEvento.find((tipo) => normalizeText(tipo.label) === TIPO_EVENTO_MANUAL)?.value ?? 0
  const idTipoEvento = asistencia?.id_tipo_evento ?? idManual

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    guardar(persona)
  }

  /** Valida y guarda la asistencia de la persona; si se guardó, cierra el modal (auto: después de mostrar la membresía) */
  const guardar = async (persona: ItemResultado | null, auto = false) => {
    if (!persona) {
      setErrorPersona('Selecciona a la persona')
      return
    }
    if (!idSubtipo) {
      setErrorSubtipo('Este campo es obligatorio')
      return
    }
    if (!idTipoEvento) {
      setErrorTipoEvento('Falta el tipo de evento "Manual" en la terminología (persona / asistencia / tipo)')
      return
    }
    setErrorTipoEvento('')
    setGuardando(true)
    const guardado = await guardarAsistencia({
      id,
      id_persona: persona.id,
      id_tipo_evento: idTipoEvento,
      id_subtipo: idSubtipo,
      // Registro manual: sin dispositivo
      deviceSN: asistencia?.deviceSN ?? '',
    })
    setGuardando(false)
    if (!guardado) return
    if (auto) setRegistradoAuto(true)
    else onHide()
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
              {/* Sin idTipo: busca entre todas las personas (clientes y colaboradores) */}
              <BuscadorPersona
                label='Cliente o colaborador'
                required
                soloNombre
                // Al registrar, el buscador se abre solo con el cursor listo para escribir
                abrirAlMontar={!esEdicion}
                value={persona}
                onSelect={(elegida) => {
                  setPersona(elegida)
                  setErrorPersona('')
                  // Al registrar, un cliente se guarda al elegirlo (como Entrada); el colaborador elige el tipo
                  if (!esEdicion && elegida && elegida.idTipo !== ID_TIPO_COLABORADOR) guardar(elegida, true)
                }}
              />
              {errorPersona && <span className="text-danger fw-bold px-2" style={{ fontSize: '11px' }}>{errorPersona}</span>}
            </Col>
            {persona && !esColaborador && (
              <Col lg={12}>
                <CardMembresiaAsistencia membresia={membresia} cargando={cargandoMembresia} />
              </Col>
            )}
            {(esEdicion || esColaborador) && (
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
            )}
            <Col lg={12}>
              {/* Solo informativo: la fecha la pone el backend */}
              <InputCR label='Fecha y hora' value={formatDate(fechaMostrada, 'yyyy-mm-dd', 'dd/mm/yyyy hh:mm')} readOnly disabled />
            </Col>
          </Row>
          {errorTipoEvento && <div className="text-danger fw-bold small mt-2">{errorTipoEvento}</div>}
          {registradoAuto && <div className="text-success fw-bold small mt-2">Asistencia registrada como Entrada</div>}
          <div className="d-flex align-items-center mt-3">
            <ButtonCR label={guardando ? 'Guardando...' : 'Guardar'} type='submit' disabled={guardando || registradoAuto} />
            <ButtonCR label={registradoAuto ? 'Cerrar' : 'Cancelar'} variant='link' onClick={onHide} disabled={guardando} />
          </div>
        </form>
      </ModalCR.Body>
    </ModalCR>
  )
}
