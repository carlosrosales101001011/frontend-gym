import type { CSSProperties, ReactNode } from 'react'
import { Card } from 'react-bootstrap'

type Card1Props = {
  children: ReactNode
  /** Alto fijo del card (ej. 400, '50vh'): el body ocupa el espacio que dejan header y footer y hace scroll */
  height?: CSSProperties['height']
  /** Clases extra del card (ej. mb-3, h-100) */
  className?: string
}

type Card1BodyProps = {
  children: ReactNode
  /** Alto máximo del body (ej. 300, '40vh'): pasado ese alto aparece el scroll */
  maxHeight?: CSSProperties['maxHeight']
  className?: string
}

type Card1SeccionProps = {
  children: ReactNode
  className?: string
}

const Card1Header = ({ children, className = '' }: Card1SeccionProps) => (
  <Card.Header className={`fw-bold fs-5 py-3 flex-shrink-0 ${className}`}>{children}</Card.Header>
)

/** Contenido con scroll vertical: por maxHeight, o por el alto del card (height en Card1) */
const Card1Body = ({ children, maxHeight, className = '' }: Card1BodyProps) => (
  <Card.Body className={`overflow-auto flex-grow-1 ${className}`} style={{ maxHeight, minHeight: 0 }}>
    {children}
  </Card.Body>
)

const Card1Footer = ({ children, className = '' }: Card1SeccionProps) => (
  <Card.Footer className={`flex-shrink-0 ${className}`}>{children}</Card.Footer>
)

/**
 * Card básico: header, body con scroll y footer.
 * @example
 * <Card1 height={400}>
 *   <Card1.Header>Título</Card1.Header>
 *   <Card1.Body>...</Card1.Body>
 *   <Card1.Footer>Acciones</Card1.Footer>
 * </Card1>
 */
export const Card1 = ({ children, height, className = '' }: Card1Props) => (
  <Card className={`border-rounded-4 overflow-hidden ${className}`} style={{ height }}>
    {children}
  </Card>
)

Card1.Header = Card1Header
Card1.Body = Card1Body
Card1.Footer = Card1Footer
