import { useMemo } from "react"
import Swal from "sweetalert2"
import { useCrudhook } from "@/hook/usecrudhook"
import { useAppSelector } from "@/stores/Store"
import { onSetDataExtRegalos, type ExtRegaloProps } from "@/pages/GestionExtensionRegalos/store/extRegaloSlice"
import { useSeguimientoMembresiaStore } from "@/pages/SeguimientoMembresia/useSeguimientoMembresiaStore"
import { diasVencidos } from "@/pages/SeguimientoMembresia/DataTableSeguimiento"
import type { SeguimientoMembresiaProps } from "@/pages/SeguimientoMembresia/store/seguimientoMembresiaSlice"

const mensajeError = (error: unknown) =>
  Array.isArray(error) ? error.join('<br/>') : String(error)

export const useExtRegaloStore = () => {
    const { extRegalos } = useAppSelector((state) => state.EXT_REGALO)
    const { post, dataxID, obtenerxID, remove, patch, searcher } = useCrudhook<ExtRegaloProps>('/membresia-extension', onSetDataExtRegalos)
    const { obtenerMembresiaSeguimiento, SeguimientoMembresias } = useSeguimientoMembresiaStore()

    /**
     * Una membresía activa por cliente (la de mayor id, igual que el backend al extender).
     * Activa: hoy <= fecha_vencimiento (misma regla que SeguimientoMembresia).
     */
    const membresiasActivas = useMemo(() => {
      const porCliente = new Map<number, SeguimientoMembresiaProps>()
      SeguimientoMembresias
        .filter((m) => m.id_cli && m.fecha_vencimiento && diasVencidos(m.fecha_vencimiento) <= 0)
        .forEach((m) => {
          const actual = porCliente.get(m.id_cli!)
          if (!actual || (m.id ?? 0) > (actual.id ?? 0)) porCliente.set(m.id_cli!, m)
        })
      return [...porCliente.values()]
    }, [SeguimientoMembresias])

    /** Crea o edita según el id. Devuelve true si se guardó. */
    const guardarExtRegalo = async (extRegalo: ExtRegaloProps) => {
      const { id, dias_habiles, observacion, id_cli, id_venta, id_tipo_extension } = extRegalo
      try {
        if (id !== 0) {
          // Solo se edita el motivo: el backend no recalcula el vencimiento al editar los días
          await patch({ observacion }, id)
        } else {
          await post({ id_tipo_extension, id_cli, id_venta, dias_habiles, observacion })
          // El backend movió la fecha de vencimiento: se refresca el seguimiento
          await obtenerMembresiaSeguimiento()
        }
        return true
      } catch (e) {
        await Swal.fire({ icon: 'error', title: 'No se pudo guardar', html: mensajeError(e) })
        return false
      }
    }

    /** Pide confirmación y elimina. */
    const eliminarExtRegalo = async (id: number) => {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        title: '¿Eliminar?',
        text: 'Se eliminará la extensión de regalo.',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      })
      if (!isConfirmed) return
      try {
        await remove(id)
      } catch (e) {
        await Swal.fire({ icon: 'error', title: 'No se pudo eliminar', html: mensajeError(e) })
      }
    }

  return {
    extRegalos,
    searcher,
    dataxID,
    obtenerxID,
    guardarExtRegalo,
    eliminarExtRegalo,
    obtenerMembresiaSeguimiento,
    membresiasActivas,
  }
}
