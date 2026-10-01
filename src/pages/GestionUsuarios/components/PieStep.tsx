import { ButtonCR } from '@/components/Button/ButtonCR'

type PieStepProps = {
  /** Sin onAtras no se muestra "Atrás" (primer paso) */
  onAtras?: () => void
  labelSiguiente?: string
  /** Sin onSiguiente el botón es submit del form del paso */
  onSiguiente?: () => void
  disabled?: boolean
}

/** Botones de cada paso del modal de usuario: "Atrás" y "Siguiente" alineados a la derecha, separados por una línea */
export const PieStep = ({ onAtras, labelSiguiente = 'Siguiente', onSiguiente, disabled }: PieStepProps) => (
  <div className="d-flex justify-content-end align-items-center gap-2 mt-4 pt-3" style={{ borderTop: '1px solid var(--cr-card-border)' }}>
    {onAtras && <ButtonCR label="Atrás" variant="link" onClick={onAtras} disabled={disabled} />}
    <ButtonCR label={labelSiguiente} type={onSiguiente ? 'button' : 'submit'} onClick={onSiguiente} disabled={disabled} />
  </div>
)
