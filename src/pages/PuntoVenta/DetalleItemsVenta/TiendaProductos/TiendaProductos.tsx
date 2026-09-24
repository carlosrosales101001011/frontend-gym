import { useEffect, useMemo, useState } from "react"
import classNames from "classnames"
import { Card, Col, Row } from "react-bootstrap"
import { BsDashLg, BsPlusLg, BsQuestionLg } from "react-icons/bs"
import { getBlobUrl } from "@/helpers/blobUrl"
import { useVentasStore } from "../../hook/useVentasStore"
import type { ProductoProps } from "../../store/ventaSlice"
import { InputSearcherCR } from "@/components/TextFields/InputSearcherCR"

const TODAS_LAS_CATEGORIAS = "Todos"

export const TiendaProductos = () => {
  const { productos, obtenerProductos, venta, onAgregarProducto, onSumarProducto, onRestarProducto, onQuitarProducto } = useVentasStore()
  const [busqueda, setBusqueda] = useState("")
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(TODAS_LAS_CATEGORIAS)

  useEffect(() => {
    obtenerProductos()
  }, [])

  const categorias = useMemo(() => {
    const unicas = new Set(
      productos.map((producto) => producto.label_categoria).filter((categoria): categoria is string => Boolean(categoria))
    )
    return [TODAS_LAS_CATEGORIAS, ...Array.from(unicas)]
  }, [productos])

  const productosFiltrados = productos.filter((producto) => {
    const texto = busqueda.trim().toLowerCase()
    const coincideBusqueda = !texto
      || producto.nombre.toLowerCase().includes(texto)
      || (producto.label_marca ?? "").toLowerCase().includes(texto)
    const coincideCategoria = categoriaSeleccionada === TODAS_LAS_CATEGORIAS || producto.label_categoria === categoriaSeleccionada
    return coincideBusqueda && coincideCategoria
  })

  const cantidadEnCarrito = new Map(venta.detalleventa_productos.map((item) => [item.id_producto, item.cantidad]))

  return (
    <div className="h-100 overflow-y-auto overflow-x-hidden">
      <div className="mb-3">
        <label>Productos disponibles</label>
        <InputSearcherCR placeholder="Buscar producto..." onSearch={setBusqueda} />
        <div className="d-flex flex-wrap gap-2 my-2">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              className={classNames("tienda-producto__badge-categoria", {
                "tienda-producto__badge-categoria--activo": categoriaSeleccionada === categoria,
              })}
              onClick={() => setCategoriaSeleccionada(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>
        <Row className="g-3">
          {productosFiltrados.map((producto) => (
            <Col key={producto.id} md={4}>
              <ItemProducto
                producto={producto}
                cantidad={cantidadEnCarrito.get(producto.id) ?? 0}
                onSumar={() => {
                  if (cantidadEnCarrito.has(producto.id)) onSumarProducto(producto.id)
                  else onAgregarProducto(producto)
                }}
                onRestar={() => {
                  // De 1 a 0 se quita del carrito (onRestarProducto no baja de 1)
                  if ((cantidadEnCarrito.get(producto.id) ?? 0) <= 1) onQuitarProducto(producto.id)
                  else onRestarProducto(producto.id)
                }}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

type ItemProductoProps = {
  producto: ProductoProps
  /** Cantidad de este producto en el carrito (0 = no está) */
  cantidad: number
  onSumar: () => void
  onRestar: () => void
}

const formatoMoneda = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
})

export const ItemProducto = ({ producto, cantidad, onSumar, onRestar }: ItemProductoProps) => {
  const imagen = getBlobUrl(producto.url_avatar)
  const stock = producto.stock_actual ?? 0
  // El stock mostrado descuenta lo que ya está en el carrito
  const stockDisponible = Math.max(stock - cantidad, 0)
  const detalle = [ producto.label_marca ]
    .filter(Boolean)
    .join(" · ")

  return (
    <Card
      className={classNames("h-100 tienda-producto__item", {
        "tienda-producto__item--seleccionado": cantidad > 0,
      })}
    >
      <span className="tienda-producto__stock">Stock: {stockDisponible}</span>
      <Card.Body className="d-flex align-items-center gap-3">
        {imagen ? (
          <img src={imagen} alt={producto.nombre} className="tienda-producto__imagen" />
        ) : (
          <div className="tienda-producto__imagen tienda-producto__imagen--vacia">
            <BsQuestionLg />
          </div>
        )}
        <div className="flex-grow-1 overflow-hidden" style={{ minWidth: 0 }}>
          <Card.Text className="small mb-1">
            <span className="fw-bolder text-black">
              {formatoMoneda.format(producto.precio_venta_actual ?? 0)}
            </span>
            <br/>
            <span className="text-black text-truncate d-block" title={producto.nombre}>
              {producto.nombre}
            </span>
            {detalle && (
              <span className="text-muted">
                {detalle}
              </span>
            )}
          </Card.Text>
          <div className="d-flex align-items-center justify-content-center gap-2">
            {cantidad > 0 && (
              <button type="button" className="carrito__stepper" onClick={onRestar}>
                <BsDashLg />
              </button>
            )}
            <span className="fw-bolder" style={{ minWidth: "18px", textAlign: "center" }}>
              {cantidad}
            </span>
            {stockDisponible > 0 && (
              <button type="button" className="carrito__stepper" onClick={onSumar}>
                <BsPlusLg />
              </button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}
