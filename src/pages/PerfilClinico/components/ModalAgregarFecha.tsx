import { useState, type FormEvent } from 'react'
import { Col, Row } from 'react-bootstrap'
import ModalCR from '@/components/Modal/ModalCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { BtnAdd } from '@/components/Button/buttonsCrud'
import { InputCR } from '@/components/TextFields/InputCR'
import { formatDate } from '@/helpers/FormatDate'
import { usePerfilNutricional } from '../hook/usePerfilNutricional'

type ModalAgregarFechaProps = {
  show: boolean
  onHide: () => void
  /** Paciente (PERSONA.id) */
  id_cli: number
}

const MAX_NOMBRE = 80
const hoy = () => formatDate(new Date(), 'yyyy-mm-dd', 'yyyy-mm-dd')

/** Agrega una fecha al perfil nutricional del paciente: fecha y nombre del perfil (ej. "Evaluación inicial") */
export const ModalAgregarFecha = ({ show, onHide, id_cli }: ModalAgregarFechaProps) => {
  const { agregarFecha } = usePerfilNutricional()
  const [fecha, setFecha] = useState(hoy)
  const [nombrePerfil, setNombrePerfil] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const errorFecha = enviado && !fecha ? 'La fecha es obligatoria' : ''
  const errorNombre = enviado && !nombrePerfil.trim() ? 'El nombre del perfil es obligatorio' : ''

  const cerrar = () => {
    setFecha(hoy())
    setNombrePerfil('')
    setEnviado(false)
    onHide()
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setEnviado(true)
    if (!fecha || !nombrePerfil.trim()) return
    setGuardando(true)
    const guardado = await agregarFecha(id_cli, { fecha, nombrePerfil: nombrePerfil.trim() })
    setGuardando(false)
    if (guardado) cerrar()
  }

  return (
    <ModalCR show={show} onHide={cerrar} size="sm">
      <ModalCR.Header>
        <ModalCR.Title>Agregar fecha</ModalCR.Title>
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
            <BtnAdd label="Agregar fecha" type="submit" disabled={guardando} />
            <ButtonCR label="Cancelar" variant="link" className="ms-auto" onClick={cerrar} />
          </div>
        </form>
      </ModalCR.Body>
    </ModalCR>
  )
}
