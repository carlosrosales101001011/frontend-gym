import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import ModalCR from "@/components/Modal/ModalCR";
import { useTerminologiaPersona } from "@/hook/usePropiedadesStore";
import { normalizeText } from "@/helpers/strings";
import { formatDate } from "@/helpers/FormatDate";
import { useFechaActual } from "@/hook/useFechaActual";
import { InputCR } from "@/components/TextFields/InputCR";
import { ButtonCR } from "@/components/Button/ButtonCR";
import { BuscadorPersona } from "@/components/BuscadorPersona/BuscadorPersona";
import type { ItemResultado } from "@/components/ModalSearching/ModalSearching";
import { useAsistenciasStore } from "../hook/useAsistenciasStore";
import { useMembresiaActual } from "../hook/useMembresiaActual";
import { TIPO_EVENTO_MANUAL } from "../hook/useRegistrarAsistencia";
import { CardMembresiaAsistencia } from "./CardMembresiaAsistencia";

const ID_TIPO_COLABORADOR = 1

type ModalCustomAsistenciaProps = {
  id: number
  show: boolean
  onHide: () => void
}

/**
 * Registrar o editar una asistencia: solo se elige la persona (se busca entre todas: clientes y colaboradores).
 * Internamente: tipo de evento "Manual" y dispositivo '' al registrar; al editar se conservan los que ya tiene.
 * La fecha y hora las pone el backend al crear: aquí solo se muestran (al registrar, la actual, cambia cada minuto;
 * al editar, la guardada). Se monta al abrirse (ver App): arranca con los valores correctos.
 */
export const ModalCustomAsistencia = ({ id, show, onHide }: ModalCustomAsistenciaProps) => {
  const { asistencias, guardarAsistencia } = useAsistenciasStore()
  const { data: dataTiposEvento, cargar: cargarTiposEvento } = useTerminologiaPersona('tipoEventoAsistencia')
  const esEdicion = id !== 0
  // La fila del listado ya trae todos los datos (incluido el nombre de la persona)
  const asistencia = asistencias.find((a) => a.id === id)

  const [persona, setPersona] = useState<ItemResultado | null>(() => asistencia
    ? { id: asistencia.id_persona, nombre: asistencia.label_nombres_apellidos_persona ?? '', telefono: '', email_personal: '', dni: '' }
    : null)
  const [errorPersona, setErrorPersona] = useState('')
  const [errorTipoEvento, setErrorTipoEvento] = useState('')
  const [guardando, setGuardando] = useState(false)
  // Al registrar corre el reloj; al editar se muestra la fecha guardada
  const ahora = useFechaActual(!esEdicion)
  const fechaMostrada = asistencia ? new Date(asistencia.fecha_registro) : ahora
  // Membresía (programa, plan y si está pagada) solo para clientes: los colaboradores no tienen
  const esColaborador = persona?.idTipo === ID_TIPO_COLABORADOR
  const { membresia, cargando: cargandoMembresia } = useMembresiaActual(esColaborador ? undefined : persona?.id)

  useEffect(() => {
    cargarTiposEvento()
  }, [])

  // Tipo de evento que se envía (no se muestra): al editar el que ya tiene; al registrar, "Manual"
  const idManual = dataTiposEvento.find((tipo) => normalizeText(tipo.label) === TIPO_EVENTO_MANUAL)?.value ?? 0
  const idTipoEvento = asistencia?.id_tipo_evento ?? idManual

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!persona) {
      setErrorPersona('Selecciona a la persona')
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
              {/* Sin idTipo: busca entre todas las personas (clientes y colaboradores) */}
              <BuscadorPersona
                label='Cliente o colaborador'
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
            {persona && !esColaborador && (
              <Col lg={12}>
                <CardMembresiaAsistencia membresia={membresia} cargando={cargandoMembresia} />
              </Col>
            )}
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
