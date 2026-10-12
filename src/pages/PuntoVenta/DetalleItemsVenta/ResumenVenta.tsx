import { useEffect, useState } from 'react'
import { Alert, Card } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@/stores/Store'
import { onOcultarAvisoVerificarMembresia } from '../store/ventaSlice'
import { BsPlusLg } from 'react-icons/bs'
import { Carrito, formatoMoneda } from './Carrito/Carrito'
import { useVentasStore } from '../hook/useVentasStore'
import { ModalCustomMembresia } from './ModalCustomMembresia'
import { ModalCustomProductos } from './ModalCustomProductos'
import { calcularMontosVenta } from '../helpers/montosVenta'
import { getFormatMoney } from '@/helpers/getFormatMoney'

/** Cuánto se ve el aviso "Verificar la membresía" de una venta repetida */
const DURACION_AVISO_MEMBRESIA_MS = 5000

type ResumenVentaProps = {
  /** Muestra (una sola vez, 5 s) el aviso "Verificar la membresía" si la venta repetida tiene membresía */
  avisoMembresia?: boolean
}

export const ResumenVenta = ({ avisoMembresia = false }: ResumenVentaProps) => {
  const dispatch = useDispatch()
  const avisoPendiente = useAppSelector((state) => state.VENTA.avisoVerificarMembresia)
  // Al entrar al paso: se muestra 5 s y se marca como visto para no volver a salir
  const [mostrarAviso, setMostrarAviso] = useState(() => avisoMembresia && avisoPendiente)
  useEffect(() => {
    if (!mostrarAviso) return
    dispatch(onOcultarAvisoVerificarMembresia())
    const espera = setTimeout(() => setMostrarAviso(false), DURACION_AVISO_MEMBRESIA_MS)
    return () => clearTimeout(espera)
  }, [])
  const [showModalMembresia, setShowModalMembresia] = useState(false)
  const [showModalProductos, setShowModalProductos] = useState(false)
  const { venta } = useVentasStore()
  const { total, saldoPendiente, vuelto } = calcularMontosVenta(venta)

  return (
    <>
      {/* La card ocupa el alto de la columna: el cuerpo hace scroll en Y y el TOTAL
          va en el footer, fijo abajo sin moverse con el scroll */}
      <Card className='card-mode-actual h-100'>
          <Card.Body className='scroll-mode-actual overflow-x-hidden' style={{ minHeight: 0 }}>
              <div className='d-flex align-items-center gap-2 flex-wrap mb-2'>
                <Card.Title style={{fontSize: '17px'}} className='fw-bolder mb-0'>
                    Resumen de la venta
                </Card.Title>
                {mostrarAviso && (
                  <Alert variant='warning' className='py-1 px-2 mb-0 small fw-semibold'>
                    Verificar la membresía
                  </Alert>
                )}
              </div>
            {/* Mismo estilo que "Agregar pago" */}
            <div className="d-flex gap-2 mt-1 mb-1">
              <Card role="button" tabIndex={0} className="add-item-card flex-fill " onClick={() => setShowModalMembresia(true)}>
                <span className="d-flex align-items-center gap-2">
                  <BsPlusLg size={18} />
                  <span>Agregar membresía</span>
                </span>
              </Card>
              <Card role="button" tabIndex={0} className="add-item-card flex-fill" onClick={() => setShowModalProductos(true)}>
                <span className="d-flex align-items-center gap-2">
                  <BsPlusLg size={18} />
                  <span>Agregar productos</span>
                </span>
              </Card>
            </div>
            <Carrito/>
          </Card.Body>
          <Card.Footer
            className='px-4'
            style={{ backgroundColor: 'transparent', borderTop: '1px solid var(--cr-card-border)' }}
          >
            <div className='d-flex justify-content-between'>
              <span className='fs-3'>TOTAL</span>
              <span className='fs-3'>{formatoMoneda.format(total)}</span>
            </div>
            {/* Si se pagó de más se muestra el vuelto en lugar del saldo pendiente */}
            {vuelto > 0 ? (
              <div className='d-flex justify-content-between fs-5 text-danger'>
                <span>Vuelto</span>
                <span>{getFormatMoney(vuelto)}</span>
              </div>
            ) : (
              <div className='d-flex justify-content-between fs-5'>
                <span>Saldo pendiente</span>
                <span>{getFormatMoney(saldoPendiente)}</span>
              </div>
            )}
          </Card.Footer>
      </Card>
      <ModalCustomMembresia show={showModalMembresia} onHide={() => setShowModalMembresia(false)} />
      <ModalCustomProductos show={showModalProductos} onHide={() => setShowModalProductos(false)} />
    </>
  )
}
