import { useEffect, useEffectEvent } from 'react'
import { crearSocket } from '@/common/helpers/socketClient'

/** Aviso del backend cuando cualquier usuario crea, edita o elimina una cita */
export type CambioAgenda = { accion: 'crear' | 'editar' | 'eliminar', id: number }

/**
 * Mientras la agenda está abierta escucha los cambios de citas (de cualquier usuario, incluido uno mismo),
 * llama a recargar (las citas que la pantalla esté mostrando: su rango y, si hay, la búsqueda) y a onCambio
 * para que la pantalla reaccione (ej. cerrar el modal).
 */
export const useAgendaTiempoReal = (recargar: () => void, onCambio: (cambio: CambioAgenda) => void) => {
  // useEffectEvent: el socket se crea una sola vez, pero siempre llama a la versión actual de recargar y onCambio
  const alCambiar = useEffectEvent((cambio: CambioAgenda) => {
    recargar()
    onCambio(cambio)
  })
  // Lo que se perdió mientras no había conexión
  const alReconectar = useEffectEvent(() => {
    recargar()
  })

  useEffect(() => {
    const socket = crearSocket('agenda-nutricionista')
    socket.on('agenda:cambio', (cambio: CambioAgenda) => alCambiar(cambio))
    socket.io.on('reconnect', () => alReconectar())
    socket.connect()
    return () => {
      socket.io.off('reconnect')
      socket.disconnect()
    }
  }, [])
}
