import type { ReactNode } from 'react'
import classNames from 'classnames'
import { Card } from 'react-bootstrap'
import { NumberFormatMoney } from '@/components/Formats/NumberFormat'

export type ItemResumenMonto = {
  label: string
  monto: number | string | null | undefined
  /**
   * normal: fila simple · descuento: en rojo con signo "-" ·
   * total: separada con borde superior · resaltado: total destacado (ej. saldo pendiente)
   */
  tipo?: 'normal' | 'descuento' | 'total' | 'resaltado'
}

type ResumenMontosProps = {
  titulo?: ReactNode
  items: ItemResumenMonto[]
  moneda?: string
  className?: string
}

// Bloque de resumen de montos (subtotales, descuentos, totales, saldo).
export const ResumenMontos = ({ titulo, items, moneda = 'S/', className }: ResumenMontosProps) => {
  return (
    <Card className={classNames('card-mode-actual', className)}>
      <Card.Body className="py-2">
        {titulo && (
          <Card.Title style={{ fontSize: '15px' }} className="fw-bolder mb-2">
            {titulo}
          </Card.Title>
        )}
        {items.map(({ label, monto, tipo = 'normal' }) => (
          <div
            key={label}
            className={classNames('d-flex justify-content-between align-items-center py-1', {
              'text-danger': tipo === 'descuento',
              'border-top mt-1 pt-2 fw-bold': tipo === 'total' || tipo === 'resaltado',
              'fs-6 fw-bolder text-primary': tipo === 'resaltado',
            })}
            style={{ fontSize: '14px' }}
          >
            <span>{label}</span>
            <span>
              {tipo === 'descuento' && '- '}
              {moneda}
              <NumberFormatMoney value={monto ?? 0} />
            </span>
          </div>
        ))}
      </Card.Body>
    </Card>
  )
}
