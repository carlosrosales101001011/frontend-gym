import Swal from "sweetalert2"
import { useCrudhook } from "@/hook/usecrudhook"
import { mensajeError } from "@/helpers/mensajeError"
import { useAppSelector } from "@/stores/Store"
import { onSetDataIngredientes, type IngredienteProps } from "@/pages/GestionIngredientes/store/ingredienteSlice"

export const useIngredienteStore = () => {
    const { ingredientes } = useAppSelector((state) => state.INGREDIENTE)
    const { post, remove, patch, searcher } = useCrudhook<IngredienteProps>('/ingredientes', onSetDataIngredientes)

    /**
     * Crea o edita según el id. Se envían las unidades y alérgenos completos: el backend reemplaza
     * los anteriores por estos. Los label_* los pone el backend. Devuelve true si se guardó.
     */
    const guardarIngrediente = async (ingrediente: IngredienteProps) => {
      const { id, nombre, kcal, proteinas_g, carbohidratos_g, grasas_g, unidades, alergenos } = ingrediente
      const valores = {
        nombre: nombre.trim(),
        kcal: Number(kcal) || 0,
        proteinas_g: Number(proteinas_g) || 0,
        carbohidratos_g: Number(carbohidratos_g) || 0,
        grasas_g: Number(grasas_g) || 0,
        unidades: unidades.map((u) => ({ id_unidad: u.id_unidad, gramos: Number(u.gramos) })),
        alergenos: alergenos.map((a) => a.id_alergeno),
      }
      try {
        if (id !== 0) await patch(valores, id)
        else await post(valores)
        return true
      } catch (e) {
        await Swal.fire({ icon: 'error', title: 'No se pudo guardar', html: mensajeError(e) })
        return false
      }
    }

    /** Pide confirmación y elimina (borrado lógico). El backend no deja si una receta lo usa. */
    const eliminarIngrediente = async (id: number) => {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        title: '¿Eliminar?',
        text: 'Se eliminará el ingrediente.',
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
    ingredientes,
    searcher,
    guardarIngrediente,
    eliminarIngrediente,
  }
}
