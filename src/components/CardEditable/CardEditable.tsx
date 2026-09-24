import type { ReactNode } from 'react'
import classNames from 'classnames'
import { Card } from 'react-bootstrap'
import { ButtonCR } from '@/components/Button/ButtonCR'

type CardEditableProps = {
  titulo: ReactNode
  editando: boolean
  onEditar: () => void
  /** Cancela la edición (o la termina, si no hay `onGuardar`). */
  onCancelar: () => void
  /** Si se pasa, muestra Guardar / Cancelar; si no, solo "Listo" (edición con guardado por ítem). */
  onGuardar?: () => void
  guardando?: boolean
  /** Botones extra que se muestran en el header mientras se edita (ej. "Agregar"). */
  acciones?: ReactNode
  /** Oculta el botón Editar (ej. mientras carga). */
  deshabilitado?: boolean
  className?: string
  children: ReactNode
}

// Card con modo lectura / edición controlado por el padre.
export const CardEditable = ({
  titulo,
  editando,
  onEditar,
  onCancelar,
  onGuardar,
  guardando = false,
  acciones,
  deshabilitado = false,
  className,
  children,
}: CardEditableProps) => {
  return (
    <Card className={classNames('card-mode-actual', className)}>
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-1 mb-2">
          <Card.Title style={{ fontSize: '17px' }} className="fw-bolder m-0">
            {titulo}
          </Card.Title>
          <div className="d-flex align-items-center flex-wrap">
            {!editando && !deshabilitado && (
              <ButtonCR label="Editar" variant="outline-primary" onClick={onEditar} />
            )}
            {editando && acciones}
            {editando && onGuardar && (
              <>
                <ButtonCR label={guardando ? 'Guardando...' : 'Guardar'} onClick={onGuardar} disabled={guardando} />
                <ButtonCR label="Cancelar" variant="link" onClick={onCancelar} disabled={guardando} />
              </>
            )}
            {editando && !onGuardar && (
              <ButtonCR label="Listo" variant="outline-secondary" onClick={onCancelar} />
            )}
          </div>
        </div>
        {children}
      </Card.Body>
    </Card>
  )
}
