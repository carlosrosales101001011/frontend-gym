import Swal from "sweetalert2"
import httpClient from "@/common/helpers/httpClient"
import { useCrudhook } from "@/hook/usecrudhook"
import { mensajeError } from "@/helpers/mensajeError"
import { useAppSelector } from "@/stores/Store"
import { onSetDataRecetas, type NutricionProps, type RecetaIngredienteProps, type RecetaProps } from "@/pages/GestionRecetas/store/recetaSlice"
import type { IngredienteProps } from "@/pages/GestionIngredientes/store/ingredienteSlice"

/**
 * Nutrición aproximada para mostrar mientras se arma la receta (la oficial la calcula el backend):
 * por cada ingrediente, (gramos / 100) × valor por 100 g; gramos = cantidad × gramos de su unidad.
 */
export const calcularNutricion = (items: RecetaIngredienteProps[], opciones: IngredienteProps[]): NutricionProps => {
  const total: NutricionProps = { kcal: 0, proteinas_g: 0, carbohidratos_g: 0, grasas_g: 0 }
  for (const item of items) {
    const ingrediente = opciones.find((o) => o.id === item.id_ingrediente)
    const unidad = ingrediente?.unidades.find((u) => u.id_unidad === item.id_unidad)
    if (!ingrediente || !unidad) continue
    const factor = (Number(item.cantidad) * Number(unidad.gramos)) / 100
    total.kcal += factor * Number(ingrediente.kcal)
    total.proteinas_g += factor * Number(ingrediente.proteinas_g)
    total.carbohidratos_g += factor * Number(ingrediente.carbohidratos_g)
    total.grasas_g += factor * Number(ingrediente.grasas_g)
  }
  return total
}

export const useRecetaStore = () => {
    const { recetas } = useAppSelector((state) => state.RECETA)
    const { post, remove, patch, searcher } = useCrudhook<RecetaProps>('/recetas', onSetDataRecetas)

    /** Receta completa (con sus ingredientes) para editarla */
    const obtenerReceta = async (id: number, signal?: AbortSignal): Promise<RecetaProps | null> => {
      try {
        const { data } = await httpClient.get(`/recetas/id/${id}`, { signal })
        return data
      } catch (error) {
        if (!signal?.aborted) console.log(error)
        return null
      }
    }

    /** Ingredientes activos con sus unidades y nutrición, para elegirlos en la receta */
    const obtenerOpcionesIngredientes = async (signal?: AbortSignal): Promise<IngredienteProps[]> => {
      try {
        const { data } = await httpClient.get('/ingredientes/opciones', { signal })
        return data
      } catch (error) {
        if (!signal?.aborted) console.log(error)
        return []
      }
    }

    /**
     * Crea o edita según el id. Se envían todos los ingredientes: el backend reemplaza los anteriores
     * y calcula gramos, labels y slug. Devuelve true si se guardó.
     */
    const guardarReceta = async (receta: RecetaProps) => {
      const { id, titulo, porciones, dificultad, ingredientes = [] } = receta
      const valores = {
        titulo: titulo.trim(),
        porciones: Number(porciones),
        dificultad,
        ingredientes: ingredientes.map((i) => ({
          id_ingrediente: i.id_ingrediente,
          id_unidad: i.id_unidad,
          cantidad: Number(i.cantidad),
        })),
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

    /** Pide confirmación y elimina (borrado lógico). */
    const eliminarReceta = async (id: number) => {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        title: '¿Eliminar?',
        text: 'Se eliminará la receta.',
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
    recetas,
    searcher,
    obtenerReceta,
    obtenerOpcionesIngredientes,
    guardarReceta,
    eliminarReceta,
  }
}
