import { useEffect } from 'react'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import type { OpcionesSelect } from '@/types/props'

/** Formas de pago de la venta (para el select) y su nombre a partir del id */
export const useFormasPago = () => {
  const { cargar, data } = useTerminologiaPersona('formaPagoVenta')
  const formasPago = data as OpcionesSelect[]

  useEffect(() => {
    cargar()
  }, [cargar])

  const labelFormaPago = (id: number) => formasPago.find((f) => f.value === id)?.label ?? `#${id}`

  return { formasPago, labelFormaPago }
}
