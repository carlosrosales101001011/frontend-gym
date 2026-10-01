import { TabsCR } from '@/components/Tabs/TabsCR'
import { TabCR } from '@/components/Tabs/TabCR'
import { Card  } from 'react-bootstrap'
import { TiendaMembresia } from './TiendaMembresia/TiendaMembresia'
import { TiendaProductos } from './TiendaProductos/TiendaProductos'

export const CardItemsVenta = () => {
  return (
    <Card className='card-mode-actual card-items-venta h-100 d-flex flex-column'>
      <Card.Body className="flex-grow-1" style={{minHeight: 0}}>
        <Card.Title className='fs-5 fw-bolder'>
          Agregar items
        </Card.Title>
        <TabsCR defaultActiveKey="membresia" variant="pildora">
          <TabCR eventKey="membresia" title={<div className='px-4'>Membresia</div>}>
            <TiendaMembresia />
          </TabCR>
          <TabCR eventKey="productos" title={<div className='px-4'>Productos</div>}>
            <TiendaProductos/>
          </TabCR>
        </TabsCR>
      </Card.Body>
    </Card>
  )
}
