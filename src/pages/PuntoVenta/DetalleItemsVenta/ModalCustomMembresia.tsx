import ModalCR from '@/components/Modal/ModalCR'
import { TiendaMembresia } from './TiendaMembresia/TiendaMembresia'

type ModalCustomMembresiaProps = {
  show: boolean
  onHide: () => void
}

export const ModalCustomMembresia = ({ show, onHide }: ModalCustomMembresiaProps) => {
  return (
    <ModalCR  show={show} onHide={onHide} size="xl"  position='top'>
      <ModalCR.Header>
        Agregar membresía
      </ModalCR.Header>
      <ModalCR.Body style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        <TiendaMembresia onAgregar={onHide} />
      </ModalCR.Body>
    </ModalCR>
  )
}
