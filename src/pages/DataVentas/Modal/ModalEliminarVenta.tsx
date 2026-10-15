import { useEffect, useState } from 'react'
import ModalCR from '@/components/Modal/ModalCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import type { UseVentaDetalle } from '../hook/useVentaDetalle'
import { useFormasPago } from '../hook/useFormasPago'
import type { VentaRelacionadosProps } from '../types'
import { formatearFecha, formatearMoneda, totalVenta } from '../helpers'

type ModalEliminarVentaProps = {
  show: boolean
  onHide: () => void
  /** Tras eliminar (ej. cerrar también el modal de la venta) */
  onEliminada: () => void
} & Pick<UseVentaDetalle, 'obtenerRelacionados' | 'eliminarVenta'>

/** Muestra todo lo conectado a la venta y, si se confirma, la elimina con todo eso */
export const ModalEliminarVenta = ({ show, onHide, ...props }: ModalEliminarVentaProps) => (
  <ModalCR show={show} onHide={onHide}>
    <ModalCR.Header>
      <ModalCR.Title>¿Eliminar la venta?</ModalCR.Title>
    </ModalCR.Header>
    <ModalCR.Body>
      {/* Se monta al abrir: cada apertura vuelve a pedir lo relacionado */}
      {show && <ContenidoEliminarVenta onHide={onHide} {...props} />}
    </ModalCR.Body>
  </ModalCR>
)

const ContenidoEliminarVenta = ({ onHide, onEliminada, obtenerRelacionados, eliminarVenta }: Omit<ModalEliminarVentaProps, 'show'>) => {
  const [relacionados, setRelacionados] = useState<VentaRelacionadosProps | null>(null)
  const [eliminando, setEliminando] = useState(false)
  const { labelFormaPago } = useFormasPago()

  useEffect(() => {
    // Si no se pudo cargar, el hook ya mostró el error
    obtenerRelacionados().then((data) => (data ? setRelacionados(data) : onHide()))
  }, [])

  const onEliminar = async () => {
    setEliminando(true)
    const ok = await eliminarVenta()
    setEliminando(false)
    if (ok) onEliminada()
  }

  if (!relacionados) return <div className="text-center text-secondary py-4">Cargando lo conectado a la venta...</div>

  const { venta, membresias, productos, pagos, extensiones, seguimientos } = relacionados

  return (
    <>
      <p className="mb-2">Se eliminará:</p>
      <SeccionEliminar
        titulo="Venta"
        items={[`${venta.label_nombres_apellidos_cli} · ${venta.n_comprobante || 'Sin comprobante'} · ${formatearMoneda(totalVenta(venta))}`]}
      />
      <SeccionEliminar
        titulo="Membresías"
        items={membresias.map((m) => `${m.label_programa} · ${m.label_plan} · ${formatearFecha(m.fecha_inicio)} – ${formatearFecha(m.fecha_fin)}`)}
      />
      <SeccionEliminar
        titulo="Productos"
        items={productos.map((p) => `${p.label_producto} x${p.cantidad} · ${formatearMoneda(p.montoTotal)}`)}
      />
      <SeccionEliminar
        titulo="Pagos"
        items={pagos.map((p) => `${formatearMoneda(p.monto)} · ${labelFormaPago(p.id_forma_pago)} · ${formatearFecha(p.fecha_pago)}`)}
      />
      <SeccionEliminar
        titulo="Extensiones"
        items={extensiones.map((e) => `${e.label_tipo_extension} · ${formatearFecha(e.fecha_inicio)} – ${formatearFecha(e.fecha_fin)}`)}
      />
      <SeccionEliminar
        titulo="Seguimientos"
        items={seguimientos.map((s) => `Vence ${formatearFecha(s.fecha_vencimiento)} · ${s.sesiones_pendientes} sesiones pendientes`)}
      />
      <div className="d-flex justify-content-end mt-3">
        <ButtonCR label="Cancelar" variant="link" onClick={onHide} disabled={eliminando} />
        <ButtonCR label={eliminando ? 'Eliminando...' : 'Eliminar'} variant="danger" onClick={onEliminar} disabled={eliminando} />
      </div>
    </>
  )
}

const SeccionEliminar = ({ titulo, items }: { titulo: string, items: string[] }) => (
  <div className="mb-2">
    <div className="fw-bold">{titulo} ({items.length})</div>
    {items.length > 0
      ? <ul className="mb-0">{items.map((item, i) => <li key={i}>{item}</li>)}</ul>
      : <div className="text-secondary small ps-3">Ninguno</div>}
  </div>
)
