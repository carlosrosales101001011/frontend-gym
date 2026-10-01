import { Button, ButtonGroup } from 'react-bootstrap'
import type { MedidaReporte } from '../helpers/medidaReporte'

const OPCIONES: { value: MedidaReporte, label: string }[] = [
  { value: 'monto', label: 'Monto' },
  { value: 'cantidad', label: 'Cantidad' },
]

/** Botones "Monto / Cantidad" para cambiar qué mide un gráfico del reporte */
export const SelectorMedida = ({ medida, onChange }: { medida: MedidaReporte, onChange: (medida: MedidaReporte) => void }) => (
  <ButtonGroup size="sm" aria-label="Medir por">
    {OPCIONES.map((opcion) => (
      <Button
        key={opcion.value}
        variant={medida === opcion.value ? 'primary' : 'outline-secondary'}
        // El inactivo usa el texto/borde del tema (el gris de Bootstrap casi no se lee en modo nocturno)
        style={medida === opcion.value ? undefined : { color: 'var(--cr-color)', borderColor: 'var(--cr-border)' }}
        onClick={() => onChange(opcion.value)}
        aria-pressed={medida === opcion.value}
      >
        {opcion.label}
      </Button>
    ))}
  </ButtonGroup>
)
