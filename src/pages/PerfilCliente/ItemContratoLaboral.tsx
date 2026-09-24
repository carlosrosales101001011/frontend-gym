import React from 'react'
import { Card } from 'react-bootstrap'

export const ItemContratoLaboral = () => {
  return (
    <Card className='bg-body '>
        <Card.Body>
            <div className='d-flex flex-column'>
                <span className='fw-bold fs-4'>Cargo: Contador</span>
                <span className='fw-bold'>Inicio: <span>21 de septiembre del 2024</span></span>
                <span className='fw-bold'>Fin: <span className=''>15 de noviembre del 2026</span></span>
                <span className='fw-bold'>Fin: <span className=''>15 de noviembre del 2026</span></span>
            </div>
        </Card.Body>
    </Card>
  )
}
