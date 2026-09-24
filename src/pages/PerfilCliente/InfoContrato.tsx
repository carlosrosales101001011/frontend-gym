import React from 'react'
import { FieldInfo } from '@/components/FieldText/FieldInfo'
import { Col, Row } from 'react-bootstrap'

export const InfoContrato = () => {
  return (
    <div style={{marginTop: '40px'}}>
        <Row>
            <Col lg={4}>
                <FieldInfo label='Cargo' value='Desarrollador de sistema'/>
            </Col>
            <Col lg={4}>
                <FieldInfo label='Departamento' value='Sistemas'/>
            </Col>
            <Col lg={4}>
                <FieldInfo label='Fecha de inicio' value='21 de septiembre del 2024'/>
            </Col>
            <Col lg={4}>
                <FieldInfo label='Fecha de fin' value='21 de septiembre del 2026'/>
            </Col>
            <Col lg={4}>
                <FieldInfo label='Sueldo' value='1,300.00'/>
            </Col>
        </Row>
    </div>
  )
}
