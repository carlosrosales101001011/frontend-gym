import { useState } from 'react'
import { Card } from 'react-bootstrap'
import { BsPlusLg } from 'react-icons/bs'
import { Carrito, formatoMoneda } from './Carrito/Carrito'
import { useVentasStore } from '../hook/useVentasStore'
import { ModalCustomMembresia } from './ModalCustomMembresia'
import { ModalCustomProductos } from './ModalCustomProductos'

export const ResumenVenta = () => {
  const [showModalMembresia, setShowModalMembresia] = useState(false)
  const [showModalProductos, setShowModalProductos] = useState(false)
  const { venta } = useVentasStore()
  const { detalleventa_productos, detalleventa_membresias } = venta
  const total = detalleventa_productos.reduce((acc, item) => acc + Number(item.precio_unitario) * item.cantidad, 0) + detalleventa_membresias.montoTotal

  return (
    <>
      {/* La card ocupa el alto de la columna: el cuerpo hace scroll en Y y el TOTAL
          va en el footer, fijo abajo sin moverse con el scroll */}
      <Card className='card-mode-actual h-100'>
          <Card.Body className='scroll-mode-actual overflow-x-hidden' style={{ minHeight: 0 }}>
              <Card.Title style={{fontSize: '17px'}} className='fw-bolder'>
                  Resumen de la venta
              </Card.Title>
            {/* Mismo estilo que "Agregar pago" */}
            <div className="d-flex gap-2 mt-1 mb-1">
              <Card role="button" tabIndex={0} className="add-item-card flex-fill " onClick={() => setShowModalMembresia(true)}>
                <span className="d-flex align-items-center gap-2">
                  <BsPlusLg size={18} />
                  <span>Agregar membresía</span>
                </span>
              </Card>
              <Card role="button" tabIndex={0} className="add-item-card flex-fill" onClick={() => setShowModalProductos(true)}>
                <span className="d-flex align-items-center gap-2">
                  <BsPlusLg size={18} />
                  <span>Agregar productos</span>
                </span>
              </Card>
            </div>
            <Carrito/>
          </Card.Body>
          <Card.Footer
            className='fs-3 px-4 d-flex justify-content-between'
            style={{ backgroundColor: 'transparent', borderTop: '1px solid var(--cr-card-border)' }}
          >
            <span className='fs-3'>TOTAL</span>
            <span className='fs-3'>{formatoMoneda.format(total)}</span>
          </Card.Footer>
      </Card>
      <ModalCustomMembresia show={showModalMembresia} onHide={() => setShowModalMembresia(false)} />
      <ModalCustomProductos show={showModalProductos} onHide={() => setShowModalProductos(false)} />
    </>
  )
}
