import { Tab } from '@/components/Tabs/Tab'
import { Tabs } from '@/components/Tabs/Tabs'
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
        <Tabs defaultValue={'membresia'} defaultActiveKey="items-add" classNameActive="bg-primary"
            classNameInactivos="bg-gray" >
          <Tab eventKey="membresia" title={<div className='px-4'>Membresia</div>}>
            <TiendaMembresia />
          </Tab>
          <Tab eventKey="productos" title={<div className='px-4'>Productos</div>}>
            <TiendaProductos/>
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  )
}
