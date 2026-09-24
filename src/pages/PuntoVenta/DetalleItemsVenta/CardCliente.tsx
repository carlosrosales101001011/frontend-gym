import { BuscadorPersona } from '@/components/BuscadorPersona/BuscadorPersona'
import { useVentasStore } from '../hook/useVentasStore'

const ID_TIPO_CLIENTE = 2

export const CardCliente = () => {
  const { clienteSeleccionado, onSelectCliente } = useVentasStore()

  return (
    <BuscadorPersona
      idTipo={ID_TIPO_CLIENTE}
      label='Cliente'
      placeholder='Buscar Cliente por nombre, DNI o Telefono'
      value={clienteSeleccionado}
      onSelect={onSelectCliente}
    />
  )
}
