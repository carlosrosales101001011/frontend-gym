import { useState } from 'react'
import { ButtonCR } from '@/components/Button/ButtonCR'
import IconCR from '@/components/Icons/IconCR'
import { ModalCustomClientes, type ClienteCreado } from '@/pages/GestionClientes/ModalCustomClientes'
import { useVentasStore } from '../hook/useVentasStore'

/**
 * Botón "Cliente nuevo" del punto de venta (al lado del buscador de cliente): abre el modal de "Agregar cliente"
 * y, al guardarlo, el cliente recién creado queda elegido en la venta.
 */
type BotonClienteNuevoProps = {
  /** Solo el "+" (sin texto), para espacios angostos como "Información de la venta" */
  soloIcono?: boolean
}

export const BotonClienteNuevo = ({ soloIcono = false }: BotonClienteNuevoProps = {}) => {
  const { onSelectCliente } = useVentasStore()
  const [abierto, setAbierto] = useState(false)

  const alCrear = (cliente: ClienteCreado) => {
    onSelectCliente({
      id: cliente.id,
      nombre: [cliente.nombres, cliente.apellido_paterno, cliente.apellido_materno].filter(Boolean).join(' ').trim(),
      dni: cliente.numero_documento ?? '',
      telefono: cliente.telefono ?? '',
      email_personal: cliente.email_personal ?? '',
      idTipo: 2,
    })
  }

  return (
    <>
      <ButtonCR
        label={soloIcono ? undefined : "Cliente nuevo"}
        icon={<IconCR name="plus" size={14} />}
        className="text-nowrap"
        style={{ height: 40 }}
        onClick={() => setAbierto(true)}
      />
      {/* Se monta al abrir para que el form arranque limpio */}
      {abierto && <ModalCustomClientes id={0} show onHide={() => setAbierto(false)} onCreado={alCrear} />}
    </>
  )
}
