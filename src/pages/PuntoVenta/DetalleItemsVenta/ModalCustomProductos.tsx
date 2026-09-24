import ModalCR from '@/components/Modal/ModalCR'
import { TiendaProductos } from './TiendaProductos/TiendaProductos'

type ModalCustomProductosProps = {
  show: boolean
  onHide: () => void
}

export const ModalCustomProductos = ({ show, onHide }: ModalCustomProductosProps) => {
  return (
    <ModalCR show={show} onHide={onHide} size="xl">
      <ModalCR.Header>
        Agregar productos
      </ModalCR.Header>
      <ModalCR.Body>
        <TiendaProductos />
      </ModalCR.Body>
    </ModalCR>
  )
}
