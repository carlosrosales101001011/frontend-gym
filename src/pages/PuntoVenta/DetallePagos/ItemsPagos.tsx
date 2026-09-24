import { useEffect, useState } from "react"
import { Card } from "react-bootstrap"
import { BsPlusLg, BsTrash } from "react-icons/bs"
import { useTerminologiaPersona } from "@/hook/usePropiedadesStore"
import { useVentasStore } from "../hook/useVentasStore"
import { ModalCustomPago } from "./ModalCustomPago"
import type { DetallePagoVentaProps } from "../store/ventaSlice"

const formatoMoneda = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
})

export const ItemsPagos = () => {
  const { cargar: cargarFormaPago, data: dataFormaPago } = useTerminologiaPersona('formaPagoVenta')
  const { venta, onEliminarPago } = useVentasStore()
  const { detalleventa_pagos } = venta
  const [showModalPago, setShowModalPago] = useState(false)

  useEffect(() => {
    cargarFormaPago()
  }, [])

  return (
    <div className="d-flex flex-column gap-2">
      <Card
        role="button"
        tabIndex={0}
        className="add-item-card"
        onClick={() => setShowModalPago(true)}
      >
        <div className="d-flex align-items-center gap-2">
          <BsPlusLg size={18} />
          <span>Agregar pago</span>
        </div>
      </Card>
      {detalleventa_pagos.map((pago, index) => (
        <ItemPago
          key={index}
          pago={pago}
          labelFormaPago={dataFormaPago.find((opcion) => opcion.value === pago.id_forma_pago)?.label ?? '-'}
          onEliminar={() => onEliminarPago(index)}
        />
      ))}
      <ModalCustomPago show={showModalPago} onHide={() => setShowModalPago(false)} />
    </div>
  )
}

type ItemPagoProps = {
  pago: DetallePagoVentaProps
  labelFormaPago: string
  onEliminar: () => void
}

export const ItemPago = ({ pago, labelFormaPago, onEliminar }: ItemPagoProps) => {
  return (
    <Card className="card-mode-actual">
      <Card.Body className="d-flex align-items-center gap-3">
        <div className="flex-grow-1 overflow-hidden" style={{ minWidth: 0 }}>
          <div className="fw-bolder text-truncate" title={labelFormaPago}>{labelFormaPago}</div>
          <div className="small">{formatoMoneda.format(pago.montoPagos)}</div>
        </div>
        <BsTrash
          role="button"
          size={18}
          className="text-danger"
          onClick={onEliminar}
        />
      </Card.Body>
    </Card>
  )
}
