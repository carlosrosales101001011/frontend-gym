import Swal from "sweetalert2"
import httpClient from "@/common/helpers/httpClient"
import { useCrudhook } from "@/hook/usecrudhook"
import { mensajeError } from "@/helpers/mensajeError"
import { useAppDispatch, useAppSelector } from "@/stores/Store"
import { onSetDataOpcionesProgramas, onSetDataPlanes, type FormPlanEntrenamientoProps, type PlanEntrenamientoProps } from "@/pages/GestionPlanesEntrenamiento/store/planEntrenamientoSlice"
import type { ProgramaBaseBackend } from "@/pages/GestionProgramasEntrenamiento/store/programaSlice"

export const usePlanEntrenamientoStore = () => {
    const dispatch = useAppDispatch()
    const { planes, opcionesProgramas } = useAppSelector((state) => state.PLAN_ENTRENAMIENTO)
    const { patch, remove, searcher } = useCrudhook<PlanEntrenamientoProps>('/entrenamiento-plan', onSetDataPlanes)
    const { obtenerAll: obtenerProgramas } = useCrudhook<ProgramaBaseBackend>('/programa-entrenamiento')

    const obtenerOpProgramas = async () => {
      try {
        const data = await obtenerProgramas()
        dispatch(onSetDataOpcionesProgramas(data.lista.map((programa: ProgramaBaseBackend) => ({ value: programa.id, label: programa.nombre }))))
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * Crea un plan por cada programa elegido (el backend guarda un id_programa por plan),
     * o actualiza el plan si ya existe. Devuelve true si se guardó.
     * Los label_* se quitan: el backend rechaza campos que no están en su DTO (forbidNonWhitelisted).
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- los label_* solo son para mostrar
    const guardarPlan = async ({ id, id_programas, id_programa, label_programa, label_tipo_tarifa, ...datos }: FormPlanEntrenamientoProps) => {
      try {
        if (id !== 0) {
          await patch({ ...datos, id_programa }, id)
        } else {
          await Promise.all(id_programas.map((idPrograma) =>
            httpClient.post('/entrenamiento-plan', { ...datos, id_programa: idPrograma })))
          // Un solo refresco del listado al final (post del hook refrescaría una vez por plan)
          await searcher()
        }
        return true
      } catch (e) {
        await Swal.fire({ icon: 'error', title: 'No se pudo guardar', html: mensajeError(e) })
        return false
      }
    }

    /** Pide confirmación y elimina. */
    const eliminarPlan = async (id: number) => {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        title: '¿Eliminar?',
        text: 'Se eliminará el plan de entrenamiento.',
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
    planes,
    opcionesProgramas,
    searcher,
    obtenerOpProgramas,
    guardarPlan,
    eliminarPlan,
  }
}
