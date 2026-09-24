import type { ReactNode } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FieldInfo } from './FieldInfo'

export type CampoFieldGrid = {
  label: string
  value: ReactNode
  /** Ancho de la columna (1-12) en pantallas md+. Por defecto usa `colDefault`. */
  col?: number
}

type FieldGridProps = {
  campos: CampoFieldGrid[]
  colDefault?: number
  /** Texto a mostrar cuando el valor viene vacío. */
  vacio?: string
}

// Grilla de pares label / valor en modo lectura.
export const FieldGrid = ({ campos, colDefault = 6, vacio = '-' }: FieldGridProps) => {
  return (
    <Row className="g-0">
      {campos.map((campo) => (
        <Col key={campo.label} xs={12} md={campo.col ?? colDefault}>
          <FieldInfo
            label={campo.label}
            value={campo.value === null || campo.value === undefined || campo.value === '' ? vacio : campo.value}
          />
        </Col>
      ))}
    </Row>
  )
}
