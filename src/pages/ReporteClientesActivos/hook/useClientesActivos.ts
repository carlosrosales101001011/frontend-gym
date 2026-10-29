import { useEffect, useState } from 'react'
import httpClient from '@/common/helpers/httpClient'

/** GET /membresia-seguimiento/activos: un cliente activo con su membresía que vence más tarde (vence después de hoy) */
export type ClienteActivoProps = {
  /** id del seguimiento (membresia_seguimiento) */
  id: number
  id_cli: number
  /** Link a su perfil */
  uid_cli: string | null
  label_nombres_apellidos_cli: string | null
  telefono_cli: string | null
  /** 0 / '' si la venta no los tiene */
  id_programa: number
  label_programa: string
  n_plan: string
  /** Asesor de la venta */
  id_empl: number | null
  label_nombres_apellidos_empl: string | null
  /** yyyy-mm-dd */
  fecha_vencimiento: string
  /** Tipo de cliente de la venta: Nuevo, Renovación, Reinscripción (terminología tipoClienteVenta) */
  id_tipo_cli: number | null
  label_tipo_cli: string | null
  /** Datos personales del cliente (persona); null o '' si no los tiene */
  label_genero: string | null
  label_estado_civil: string | null
  label_distrito: string | null
  /** yyyy-mm-dd */
  fecha_nacimiento: string | null
  /** Lo vendido en membresías en su venta (con descuento; misma base que "Total vendido" del reporte de ventas) */
  monto_membresia: number
  /** Hoy está en una extensión de congelamiento / regalo */
  es_congelado: boolean
  es_regalo: boolean
}

/** Clientes activos (se cargan una vez al montar) */
export const useClientesActivos = () => {
  const [clientes, setClientes] = useState<ClienteActivoProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let vigente = true
    httpClient.get('/membresia-seguimiento/activos')
      .then(({ data }) => { if (vigente) setClientes(data) })
      .catch((e) => { if (vigente) setError(String(e)) })
      .finally(() => { if (vigente) setLoading(false) })
    return () => { vigente = false }
  }, [])

  return { clientes, loading, error }
}
