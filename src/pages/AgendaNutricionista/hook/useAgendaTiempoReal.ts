import { useEffect, useEffectEvent } from 'react'
import { crearSocket } from '@/common/helpers/socketClient'
import { useAgendaNutricionistaStore } from './useAgendaNutricionistaStore'

/** Aviso del backend cuando cualquier usuario crea, edita o elimina una cita */
export type CambioAgenda = { accion: 'crear' | 'editar' | 'eliminar', id: number }

/**
 * Mientras la agenda está abierta escucha los cambios de citas (de cualquier usuario, incluido uno mismo),
 * recarga el calendario y llama a onCambio para que la pantalla reaccione (ej. cerrar el modal).
 */
export const useAgendaTiempoReal = (onCambio: (cambio: CambioAgenda) => void) => {
  const { obtenerEventos } = useAgendaNutricionistaStore()
  // useEffectEvent: el socket se crea una sola vez, pero siempre llama a la versión actual de onCambio
  const alCambiar = useEffectEvent((cambio: CambioAgenda) => {
    obtenerEventos()
    onCambio(cambio)
  })
  // Lo que se perdió mientras no había conexión
  const alReconectar = useEffectEvent(() => {
    obtenerEventos()
  })

  useEffect(() => {
    const socket = crearSocket('/agenda-nutricionista')
    socket.on('agenda:cambio', (cambio: CambioAgenda) => alCambiar(cambio))
    socket.io.on('reconnect', () => alReconectar())
    socket.connect()
    return () => {
      socket.io.off('reconnect')
      socket.disconnect()
    }
  }, [])
}
