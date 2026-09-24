import React from 'react'
import { Badge, Card, Col, Row } from 'react-bootstrap'
import type { ContratoColaboradorProps } from '@/pages/PerfilColaborador/store/contratoColaboradorSlice'
import IconCR from '@/components/Icons/IconCR'

type Props = {
  contrato: ContratoColaboradorProps
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export const ContratoLaboralCard = ({ contrato, onEdit, onDelete }: Props) => {
  return (
    <Card className="border shadow-sm mb-3 card-mode-actual" style={{ backgroundColor: '#fff' }}>
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div>
            <h6 className="mb-1 fw-bold">{contrato.label_departamento} - {contrato.label_cargo}</h6>
            <Badge pill bg="secondary">{contrato.label_estado}</Badge>
          </div>
          <div className="d-flex gap-2">
            <div onClick={() => onEdit(contrato.id)} className="cursor-pointer">
              <IconCR name="edit" size={14} />
            </div>
            <div onClick={() => onDelete(contrato.id)} className="cursor-pointer">
              <IconCR name="delete" size={14} />
            </div>
          </div>
        </div>
        <Row className="mt-3 gy-2" style={{ fontSize: '13px' }}>
          <Col xs={6} md={3}>
            <div className="text-muted">Tipo de contrato</div>
            <div>{contrato.label_tipo_contrato}</div>
          </Col>
          <Col xs={6} md={3}>
            <div className="text-muted">Frecuencia de pago</div>
            <div>{contrato.label_frecuencia_pago}</div>
          </Col>
          <Col xs={6} md={2}>
            <div className="text-muted">Fecha de inicio</div>
            <div>{contrato.fecha_inicio}</div>
          </Col>
          {contrato.fecha_fin && (
            <Col xs={6} md={2}>
              <div className="text-muted">Fecha de fin</div>
              <div>{contrato.fecha_fin}</div>
            </Col>
          )}
          <Col xs={6} md={2}>
            <div className="text-muted">Sueldo</div>
            <div>{contrato.label_moneda} {contrato.sueldo}</div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
