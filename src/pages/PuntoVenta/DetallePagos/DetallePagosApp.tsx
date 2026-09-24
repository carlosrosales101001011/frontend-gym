import { Col, Row } from "react-bootstrap"
import { ResumenVenta } from "../DetalleItemsVenta/ResumenVenta"
import { ItemsPagos } from "./ItemsPagos"
import { InformacionCliente } from "../DetalleItemsVenta/InformacionCliente"

export const DetallePagosApp = () => {
  return (
    <div className="h-100" style={{minHeight: 0}}>
      <Row className="h-100">
        <Col lg={3} className="h-100">
          <ItemsPagos/>
        </Col>
        <Col lg={6} className="h-100">
          <ResumenVenta/>
        </Col>
        <Col lg={3}>
          <InformacionCliente/>
        </Col>
      </Row>
    </div>
  )
}

