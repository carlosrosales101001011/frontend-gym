import ModalCR from '@/components/Modal/ModalCR'
import { TiendaMembresia } from './TiendaMembresia/TiendaMembresia'

type ModalCustomMembresiaProps = {
  show: boolean
  onHide: () => void
}

export const ModalCustomMembresia = ({ show, onHide }: ModalCustomMembresiaProps) => {
  return (
    <ModalCR show={show} onHide={onHide} size="xl">
      <ModalCR.Header>
        Agregar membresía
      </ModalCR.Header>
      <ModalCR.Body>
        <TiendaMembresia onAgregar={onHide} />
      </ModalCR.Body>
    </ModalCR>
  )
}
