import { useState } from 'react'
import Swal from 'sweetalert2'
import httpClient from '@/common/helpers/httpClient'
import { mensajeError } from '@/helpers/mensajeError'

/** Tipos de extensión (terminología extension) */
export const ID_EXTENSION_CONGELAMIENTO = 6089
export const ID_EXTENSION_REGALO = 6090

/** GET /membresia-extension/id_venta/:id_venta */
export type ExtensionMembresiaProps = {
  id: number
  id_tipo_extension: number
  label_tipo_extension: string | null
  dias_habiles: number
  observacion: string | null
  /** yyyy-mm-dd */
  fecha_inicio: string
  fecha_fin: string
}

/** GET /agenda-nutricionista/id_cli/:id_cli */
export type CitaNutricionProps = {
  id: number
  label_nombres_apellidos_empl: string | null
  duracionxmin: number
  label_estado: string | null
  /** yyyy-mm-dd */
  fecha: string
  /** HH:mm */
  hora_inicio: string
}

/** Lo que se envía al registrar: congelamiento con fechas, regalo con días */
export type NuevaExtension =
  | { id_tipo_extension: typeof ID_EXTENSION_CONGELAMIENTO, fecha_inicio: string, fecha_fin: string, observacion: string }
  | { id_tipo_extension: typeof ID_EXTENSION_REGALO, dias_habiles: number, observacion: string }

/** Detalle de una membresía del perfil: sus extensiones (congelamiento / regalo) y las citas de nutrición del cliente */
export const useDetalleMembresia = () => {
  const [extensiones, setExtensiones] = useState<ExtensionMembresiaProps[]>([])
  const [citas, setCitas] = useState<CitaNutricionProps[]>([])
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const obtenerExtensiones = async (id_venta: number) => {
    setCargando(true)
    try {
      const { data } = await httpClient.get(`/membresia-extension/id_venta/${id_venta}`)
      setExtensiones(data)
    } catch (error) {
      console.log(error)
      setExtensiones([])
    } finally {
      setCargando(false)
    }
  }

  const obtenerCitas = async (id_cli: number) => {
    setCargando(true)
    try {
      const { data } = await httpClient.get(`/agenda-nutricionista/id_cli/${id_cli}`)
      setCitas(data)
    } catch (error) {
      console.log(error)
      setCitas([])
    } finally {
      setCargando(false)
    }
  }

  /** Registra la extensión en la venta de la membresía (el backend recalcula el seguimiento). true si se guardó */
  const registrarExtension = async (id_venta: number, id_cli: number, extension: NuevaExtension) => {
    setGuardando(true)
    try {
      await httpClient.post('/membresia-extension', { ...extension, id_venta, id_cli })
      return true
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'No se pudo registrar', html: mensajeError(error) })
      return false
    } finally {
      setGuardando(false)
    }
  }

  return { extensiones, citas, cargando, guardando, obtenerExtensiones, obtenerCitas, registrarExtension }
}
