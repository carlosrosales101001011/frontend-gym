import { Card } from "react-bootstrap"
import { BsDashLg, BsPlusLg, BsQuestionLg, BsTrash } from "react-icons/bs"
import { getBlobUrl } from "@/helpers/blobUrl"
import { useVentasStore } from "../../hook/useVentasStore"
import type { DetalleMembresiaVentaProps, DetalleProductoVentaProps } from "../../store/ventaSlice"

export const formatoMoneda = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
})

const formatearFecha = (fecha: string) => {
  if (!fecha) return ""
  const partes = new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(new Date(`${fecha}T00:00:00`))
  const obtener = (tipo: Intl.DateTimeFormatPartTypes) => partes.find((parte) => parte.type === tipo)?.value ?? ""
  return `${obtener("day")} ${obtener("month")} ${obtener("year")}`
}

export const Carrito = () => {
  const { venta, onQuitarMembresia, onSumarProducto, onRestarProducto } = useVentasStore()
  const { detalleventa_membresias, detalleventa_productos } = venta
  const hayMembresia = Boolean(detalleventa_membresias.id_plan)

  if (!hayMembresia && detalleventa_productos.length === 0) {
    return <span className="text-muted">Aún no agregaste ninguna membresía ni producto.</span>
  }

  return (
    <div className="d-flex flex-column gap-2">
      {hayMembresia && (
        <ItemMembresia membresia={detalleventa_membresias} onQuitar={onQuitarMembresia} />
      )}
      {detalleventa_productos.map((producto) => (
        <ItemProductos
          key={producto.id_producto}
          producto={producto}
          onSumar={() => onSumarProducto(producto.id_producto)}
          onRestar={() => onRestarProducto(producto.id_producto)}
        />
      ))}
    </div>
  )
}

type ItemMembresiaProps = {
  membresia: DetalleMembresiaVentaProps
  onQuitar: () => void
}

export const ItemMembresia = ({ membresia, onQuitar }: ItemMembresiaProps) => {
  return (
    <Card className="card-mode-actual">
      <Card.Body className="d-flex align-items-center gap-3">
        <div className="flex-grow-1 overflow-hidden" style={{ minWidth: 0 }}>
          <div className="fw-bolder text-truncate fs-5">{membresia.label_programa}</div>
          <div className="small">{membresia.label_nmeses}</div>
          <div className="small text-capitalize">
            {formatearFecha(membresia.fecha_inicio)} - {formatearFecha(membresia.fecha_fin)}
          </div>
          <button
            type="button"
            className="carrito__stepper mt-1"
            onClick={onQuitar}
            title="Quitar membresía"
            aria-label="Quitar membresía"
          >
            <BsTrash />
          </button>
        </div>
          <div className="fw-bolder fs-5">{membresia.label_precio}</div>
      </Card.Body>
    </Card>
  )
}

type ItemProductosProps = {
  producto: DetalleProductoVentaProps
  onSumar: () => void
  onRestar: () => void
}

export const ItemProductos = ({ producto, onSumar, onRestar }: ItemProductosProps) => {
  const imagen = getBlobUrl(producto.url_avatar)
  const alcanzoStock = producto.stock_actual !== undefined && producto.cantidad >= producto.stock_actual

  return (
    <Card className="card-mode-actual">
      <Card.Body className="d-flex align-items-center gap-3">
        {imagen ? (
          <img src={imagen} alt={producto.label_producto} className="tienda-producto__imagen" />
        ) : (
          <div className="tienda-producto__imagen tienda-producto__imagen--vacia">
            <BsQuestionLg />
          </div>
        )}
        <div className="flex-grow-1 overflow-hidden" style={{ minWidth: 0 }}>
          <div className="fw-bolder text-truncate" title={producto.label_producto}>
            {producto.label_producto}
          </div>
          <div className="small">{formatoMoneda.format(Number(producto.precio_unitario_producto))} c/u</div>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="carrito__stepper"
              onClick={onRestar}
              disabled={producto.cantidad <= 1}
            >
              <BsDashLg />
            </button>
            <span className="fw-bolder" style={{ minWidth: "18px", textAlign: "center" }}>
              {producto.cantidad}
            </span>
            <button
              type="button"
              className="carrito__stepper"
              onClick={onSumar}
              disabled={alcanzoStock}
            >
              <BsPlusLg />
            </button>
          </div>
        </div>
          <div className="fw-bolder fs-5">{formatoMoneda.format(producto.montoTotal)}</div>
      </Card.Body>
    </Card>
  )
}
