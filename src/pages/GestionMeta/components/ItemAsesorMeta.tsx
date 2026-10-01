import { Card, Col, Row } from 'react-bootstrap'
import { BsTrash } from 'react-icons/bs'
import { BuscadorPersona } from '@/components/BuscadorPersona/BuscadorPersona'
import { InputMontoCR } from '@/components/TextFields/InputMontoCR'
import { useAppDispatch } from '@/stores/Store'
import { onRemoveAsesor, onSetAsesor, onSetMontoAsesor, onSetPorcentajeAsesor, type AsesorMetaProps } from '@/pages/GestionMeta/store/metaSlice'

const ID_TIPO_COLABORADOR = 1

type ItemAsesorMetaProps = {
  index: number
  asesor: AsesorMetaProps
  /** Mensaje si el asesor falta o está repetido */
  messageErrors?: string
}

/** Meta de un asesor dentro de la meta: asesor + porcentaje + monto. Mismo estilo que los planes en GestionProgramasEntrenamiento */
export const ItemAsesorMeta = ({ index, asesor, messageErrors = '' }: ItemAsesorMetaProps) => {
  const dispatch = useAppDispatch()
  const persona = asesor.id_empl
    ? { id: asesor.id_empl, nombre: asesor.label_empl, dni: '', email_personal: '', telefono: '' }
    : null

  return (
    <Card className="card-mode-actual item-form-card item-asesor-meta mb-3">
      <Card.Body>
        <Row className="g-2 align-items-center">
          <Col lg={5} className="item-asesor-meta__col">
            <BuscadorPersona
              idTipo={ID_TIPO_COLABORADOR}
              label="Asesor"
              placeholder="Buscar Asesor por nombre o dni"
              value={persona}
              onSelect={(p) => dispatch(onSetAsesor({ index, id_empl: p.id, label_empl: p.nombre }))}
              soloNombre
              required
            />
            {messageErrors && <span className="item-asesor-meta__error text-danger fw-bold px-2">{messageErrors}</span>}
          </Col>
          <Col lg={2} className="item-asesor-meta__con-label">
            <InputMontoCR
              label="%"
              value={asesor.porcentaje}
              onChange={(porcentaje) => dispatch(onSetPorcentajeAsesor({ index, porcentaje }))}
            />
          </Col>
          <Col lg={4} className="item-asesor-meta__con-label">
            <InputMontoCR
              label="Meta (S/)"
              value={asesor.monto}
              onChange={(monto) => dispatch(onSetMontoAsesor({ index, monto }))}
            />
          </Col>
          <Col lg={1} className="item-asesor-meta__con-label d-flex justify-content-center align-items-center">
            <BsTrash
              role="button"
              size={18}
              className="text-danger"
              title="Quitar asesor"
              onClick={() => dispatch(onRemoveAsesor(index))}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
