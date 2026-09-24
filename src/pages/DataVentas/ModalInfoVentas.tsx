import ModalCR from '@/components/Modal/ModalCR'
import type { modalCustom } from '@/types/props'
import { Tab, Tabs } from 'react-bootstrap'
import { TabInfoVenta } from './Modal/Tabs/TabInfoVenta'
import { TabDetalleVenta } from './Modal/Tabs/TabDetalleVenta'
import { TabDetallePagos } from './Modal/Tabs/TabDetallePagos'
import { useVentaDetalle } from './hook/useVentaDetalle'

type ModalInfoVentasProps = modalCustom & {
  /** Se llama tras cada cambio guardado (ej. refrescar la tabla de ventas). */
  onCambio?: () => void
}

export const ModalInfoVentas = ({ show, onHide, id, onCambio }: ModalInfoVentasProps) => {
  const ventaDetalle = useVentaDetalle(show ? id : 0, onCambio)
  const { data, loading, error, recargar } = ventaDetalle

  return (
    <ModalCR show={show} onHide={onHide} size="xl">
        <ModalCR.Header>
            <ModalCR.Title>
                Información de la venta {data?.venta.n_comprobante ? `· ${data.venta.n_comprobante}` : ''}
            </ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            {error && (
              <div className="alert alert-danger d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => recargar()}>Reintentar</button>
              </div>
            )}
            {!data && loading && <div className="text-center text-secondary py-5">Cargando venta...</div>}
            {data && (
              <Tabs defaultActiveKey="info" mountOnEnter>
                  <Tab eventKey="info" title="Información de la venta">
                      <TabInfoVenta
                        key={data.venta.id}
                        venta={data.venta}
                        actualizarVenta={ventaDetalle.actualizarVenta}
                      />
                  </Tab>
                  <Tab eventKey="detalle" title="Detalle de la venta">
                      <TabDetalleVenta
                        membresias={data.membresias}
                        productos={data.productos}
                        guardarMembresia={ventaDetalle.guardarMembresia}
                        eliminarMembresia={ventaDetalle.eliminarMembresia}
                        guardarProducto={ventaDetalle.guardarProducto}
                        eliminarProducto={ventaDetalle.eliminarProducto}
                      />
                  </Tab>
                  <Tab eventKey="pagos" title="Detalle de pagos">
                      <TabDetallePagos
                        venta={data.venta}
                        pagos={data.pagos}
                        guardarPago={ventaDetalle.guardarPago}
                        eliminarPago={ventaDetalle.eliminarPago}
                      />
                  </Tab>
              </Tabs>
            )}
        </ModalCR.Body>
    </ModalCR>
  )
}
