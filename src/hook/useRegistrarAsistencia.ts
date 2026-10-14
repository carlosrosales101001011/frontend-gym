import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import httpClient from '@/common/helpers/httpClient'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { normalizeText } from '@/helpers/strings'
import { formatDate } from '@/helpers/FormatDate'
import { mensajeError } from '@/helpers/mensajeError'
import { alertaMembresia, membresiaVigente } from '../helpers/alertaMembresia'
import type { MembresiaActualProps } from './useMembresiaActual'

/** Tipo de evento de una asistencia registrada a mano (terminología persona/asistencia/tipo) */
export const TIPO_EVENTO_MANUAL = 'manual'

/**
 * Registro rápido de asistencia (ej. desde el buscador): un click y queda registrada como "Manual", sin
 * dispositivo; la fecha y hora las pone el backend.
 * Cliente: antes se consulta su membresía; sin membresía vigente NO se registra (alerta roja "No asiste…").
 * Con vigente se registra y sale la alerta (verde pagada; roja con deuda). Colaborador: se registra y sale un toast.
 */
export const useRegistrarAsistencia = () => {
  const { data: tiposEvento, cargar: cargarTiposEvento } = useTerminologiaPersona('tipoEventoAsistencia')
  // Persona que se está registrando (para deshabilitar su botón y evitar doble click)
  const [registrandoId, setRegistrandoId] = useState<number | null>(null)

  useEffect(() => {
    cargarTiposEvento()
  }, [])

  /** Membresía actual del cliente; null si no tiene. Si la consulta falla, lanza el error */
  const obtenerMembresia = async (idCliente: number): Promise<MembresiaActualProps | null> => {
    const { data } = await httpClient.get(`/membresia-seguimiento/id_cli/${idCliente}/resumen-actual`)
    return data || null
  }

  const registrarAsistencia = async (idPersona: number, nombre: string, esCliente: boolean) => {
    const idManual = tiposEvento.find((tipo) => normalizeText(tipo.label) === TIPO_EVENTO_MANUAL)?.value
    if (!idManual) {
      await Swal.fire({ icon: 'error', title: 'No se pudo registrar', text: 'Falta el tipo de evento "Manual" en la terminología (persona / asistencia / tipo)' })
      return false
    }
    setRegistrandoId(idPersona)
    try {
      if (esCliente) {
        // Primero la membresía: sin una vigente el cliente no asiste y no se registra nada
        const membresia = await obtenerMembresia(idPersona)
        if (!membresiaVigente(membresia)) {
          await Swal.fire(alertaMembresia(nombre, membresia))
          return false
        }
        await httpClient.post('/persona-eventos-asistencia', { id_persona: idPersona, id_tipo_evento: idManual, deviceSN: '' })
        await Swal.fire(alertaMembresia(nombre, membresia))
        return true
      }
      await httpClient.post('/persona-eventos-asistencia', { id_persona: idPersona, id_tipo_evento: idManual, deviceSN: '' })
      await Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Asistencia registrada',
        text: `${nombre} · ${formatDate(new Date(), 'yyyy-mm-dd', 'hh:mm')}`,
        timer: 2500,
        showConfirmButton: false,
      })
      return true
    } catch (e) {
      await Swal.fire({ icon: 'error', title: 'No se pudo registrar la asistencia', html: mensajeError(e) })
      return false
    } finally {
      setRegistrandoId(null)
    }
  }

  return { registrarAsistencia, registrandoId }
}
