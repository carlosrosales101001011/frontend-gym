import type { ReactNode } from 'react'
import { ButtonGroup } from 'react-bootstrap'
import { ButtonCR } from '@/components/Button/ButtonCR'
import IconCR from '@/components/Icons/IconCR'
import { tituloVista, VISTAS_CALENDARIO, type VistaCalendario } from '../helpers/agendaHelpers'

type CalendarioToolbarProps = {
  vista: VistaCalendario
  fecha: Date
  onCambiarVista: (vista: VistaCalendario) => void
  onAnterior: () => void
  onSiguiente: () => void
  onHoy: () => void
  /** Contenido centrado en la fila (ej: la leyenda de colores) */
  centro?: ReactNode
}

export const CalendarioToolbar = ({ vista, fecha, onCambiarVista, onAnterior, onSiguiente, onHoy, centro }: CalendarioToolbarProps) => {
  return (
    // Izquierda y derecha con flex: 1 para que el centro quede centrado de verdad
    <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
      <div className="d-flex align-items-center gap-1 flex-grow-1" style={{ flexBasis: 0 }}>
        <ButtonCR variant="outline-secondary" onClick={onAnterior} icon={<IconCR name="arrowLeft" size={16} />} />
        <ButtonCR variant="outline-secondary" label="Hoy" onClick={onHoy} />
        <ButtonCR variant="outline-secondary" onClick={onSiguiente} icon={<IconCR name="arrowRight" size={16} />} />
        <h5 className="fw-bold m-0 ms-2 text-nowrap">{tituloVista(vista, fecha)}</h5>
      </div>
      {centro}
      <div className="d-flex align-items-center justify-content-end flex-grow-1" style={{ flexBasis: 0 }}>
        <ButtonGroup>
          {VISTAS_CALENDARIO.map((opcion) => (
            <ButtonCR
              key={opcion.value}
              label={opcion.label}
              variant={vista === opcion.value ? 'primary' : 'outline-secondary'}
              onClick={() => onCambiarVista(opcion.value)}
            />
          ))}
        </ButtonGroup>
      </div>
    </div>
  )
}
