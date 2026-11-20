import { useState, type FormEvent } from 'react'
import { Col, Row } from 'react-bootstrap'
import ModalCR from '@/components/Modal/ModalCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { BtnAdd, BtnUpdate } from '@/components/Button/buttonsCrud'
import { InputCR } from '@/components/TextFields/InputCR'
import { formatDate } from '@/helpers/FormatDate'
import { usePerfilNutricional } from '../hook/usePerfilNutricional'
import type { PerfilNutricional } from '../hook/usePerfilNutricionalStore'

type ModalAgregarFechaProps = {
  show: boolean
  onHide: () => void
  /** Paciente (PERSONA.id) */
  id_cli: number
  /** Fecha a editar; sin ella, el modal agrega una nueva */
  registroEditar?: PerfilNutricional | null
}

const MAX_NOMBRE = 80
const hoy = () => formatDate(new Date(), 'yyyy-mm-dd', 'yyyy-mm-dd')

/**
 * Agrega o edita una fecha del perfil nutricional del paciente: fecha y nombre del perfil (ej. "Evaluación inicial").
 * Al editar arranca con los datos de la fecha (montar con un key distinto por fecha para que los tome).
 */
export const ModalAgregarFecha = ({ show, onHide, id_cli, registroEditar = null }: ModalAgregarFechaProps) => {
  const { agregarFecha, editarFecha } = usePerfilNutricional()
  const inicialFecha = () => registroEditar?.fecha.slice(0, 10) ?? hoy()
  const inicialNombre = () => registroEditar?.nombrePerfil ?? ''
  const [fecha, setFecha] = useState(inicialFecha)
  const [nombrePerfil, setNombrePerfil] = useState(inicialNombre)
  const [enviado, setEnviado] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const errorFecha = enviado && !fecha ? 'La fecha es obligatoria' : ''
  const errorNombre = enviado && !nombrePerfil.trim() ? 'El nombre del perfil es obligatorio' : ''

  const cerrar = () => {
    setFecha(inicialFecha())
    setNombrePerfil(inicialNombre())
    setEnviado(false)
    onHide()
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setEnviado(true)
    if (!fecha || !nombrePerfil.trim()) return
    setGuardando(true)
    const datos = { fecha, nombrePerfil: nombrePerfil.trim() }
    const guardado = registroEditar ? await editarFecha(registroEditar, datos) : await agregarFecha(id_cli, datos)
    setGuardando(false)
    if (guardado) cerrar()
  }

  return (
    <ModalCR show={show} onHide={cerrar} size="sm">
      <ModalCR.Header>
        <ModalCR.Title>{registroEditar ? 'Editar fecha' : 'Agregar fecha'}</ModalCR.Title>
      </ModalCR.Header>
      <ModalCR.Body>
        <form onSubmit={onSubmit}>
          <Row>
            <Col xs={12}>
              <InputCR type="date" label="Fecha" required value={fecha} messageErrors={errorFecha} onChange={(e) => setFecha(e.target.value)} />
              <span className="text-danger fw-bold px-2" style={{ fontSize: '11px' }}>{errorFecha}</span>
            </Col>
            <Col xs={12}>
              <InputCR
                label="Nombre del perfil"
                required
                maxLength={MAX_NOMBRE}
                value={nombrePerfil}
                messageErrors={errorNombre}
                onChange={(e) => setNombrePerfil(e.target.value)}
              />
              <span className="text-danger fw-bold px-2" style={{ fontSize: '11px' }}>{errorNombre}</span>
            </Col>
          </Row>
          <div className="d-flex align-items-center mt-2">
            {registroEditar ? (
              <BtnUpdate label="Guardar cambios" type="submit" disabled={guardando} />
            ) : (
              <BtnAdd label="Agregar fecha" type="submit" disabled={guardando} />
            )}
            <ButtonCR label="Cancelar" variant="link" className="ms-auto" onClick={cerrar} />
          </div>
        </form>
      </ModalCR.Body>
    </ModalCR>
  )
}
