import { Col, Row } from "react-bootstrap"
import { ResumenVenta } from "./ResumenVenta"
import { InformacionCliente } from "./InformacionCliente"

export const DetalleItemsVentaApp = () => {
  return (
    <div className="h-100" style={{minHeight: 0}}>
      <Row className="h-100">
        <Col lg={4} className="h-100">
          <InformacionCliente/>
        </Col>
        <Col lg={8} className="h-100">
          <ResumenVenta/>
        </Col>
      </Row>
    </div>
  )
}
