import Swal from "sweetalert2"
import httpClient from "@/common/helpers/httpClient"
import { useCrudhook } from "@/hook/usecrudhook"
import { sincronizarColeccion } from "@/helpers/sincronizarColeccion"
import { useAppDispatch, useAppSelector } from "@/stores/Store"
import { onResetMeta, onSetDataMetas, onSetMeta, type AsesorMetaProps, type FormMetaProps, type MetaProps } from "@/pages/GestionMeta/store/metaSlice"
import { porcentajesDesdeMontos } from "@/pages/GestionMeta/helpers/repartirMonto"

const mensajeError = (error: unknown) =>
  Array.isArray(error) ? error.join('<br/>') : String(error)

/** Las fechas pueden llegar como ISO ("2026-09-01T00:00:00.000Z"): el form usa yyyy-MM-dd */
const aFechaISO = (fecha?: string) => (fecha ?? '').slice(0, 10)

// Los asesores van con httpClient directo: el post/patch/remove de useCrudhook refresca con
// /search después de cada llamada y /detallemeta-asesor no tiene listado paginado
const crearAsesor = (asesor: object) => httpClient.post('/detallemeta-asesor', asesor)
const actualizarAsesor = (id: number, asesor: object) => httpClient.patch(`/detallemeta-asesor/id/${id}`, asesor)
const eliminarAsesor = (id: number) => httpClient.delete(`/detallemeta-asesor/id/${id}`)

/** Asesores de la meta; el porcentaje no se guarda en el backend, se calcula de los montos */
const listarAsesoresMeta = async (id_meta: number): Promise<AsesorMetaProps[]> => {
  const { data } = await httpClient.get(`/detallemeta-asesor/id_meta/${id_meta}`)
  const montos = (data.lista as AsesorMetaProps[]).map((asesor) => Number(asesor.monto) || 0)
  const porcentajes = porcentajesDesdeMontos(montos)
  return (data.lista as AsesorMetaProps[]).map((asesor, i) => ({
    id: asesor.id,
    id_empl: asesor.id_empl,
    label_empl: asesor.label_empl ?? '',
    monto: montos[i],
    porcentaje: porcentajes[i],
  }))
}

export const useMetaStore = () => {
    const dispatch = useAppDispatch()
    const { metas, meta, asesoresOriginales } = useAppSelector((state) => state.META)
    const { post, patch, remove, searcher } = useCrudhook<MetaProps>('/ventas-meta', onSetDataMetas)

    /** Carga la meta con sus asesores para editarla, o limpia el form para una nueva */
    const cargarMeta = async (id: number) => {
      if (id === 0) {
        dispatch(onResetMeta())
        return
      }
      try {
        const [{ data }, asesores] = await Promise.all([
          httpClient.get(`/ventas-meta/id/${id}`),
          listarAsesoresMeta(id),
        ])
        dispatch(onSetMeta({
          meta: {
            id: data.id,
            nombre: data.nombre,
            fecha_inicio: aFechaISO(data.fecha_inicio),
            fecha_fin: aFechaISO(data.fecha_fin),
            monto_programa: Number(data.monto_programa) || 0,
            asesores,
          },
          asesoresOriginales: asesores,
        }))
      } catch (e) {
        await Swal.fire({ icon: 'error', title: 'No se pudo cargar la meta', html: mensajeError(e) })
      }
    }

    /** Guarda la meta y luego sincroniza sus asesores (crear / actualizar / eliminar). Devuelve true si se guardó. */
    const guardarMeta = async ({ id, nombre, fecha_inicio, fecha_fin, monto_programa, asesores }: FormMetaProps) => {
      const valores = { nombre: nombre.trim(), fecha_inicio, fecha_fin, monto_programa }
      try {
        let id_meta = id
        if (id !== 0) {
          await patch(valores, id)
        } else {
          const { data } = await post(valores)
          id_meta = data.id
        }
        await sincronizarColeccion(asesoresOriginales, asesores, {
          crear: (asesor) => crearAsesor({ id_meta, id_empl: asesor.id_empl, monto: asesor.monto }),
          actualizar: (idAsesor, asesor) => actualizarAsesor(idAsesor, { id_empl: asesor.id_empl, monto: asesor.monto }),
          eliminar: (idAsesor) => eliminarAsesor(idAsesor),
        })
        return true
      } catch (e) {
        await Swal.fire({ icon: 'error', title: 'No se pudo guardar', html: mensajeError(e) })
        return false
      }
    }

    /** Pide confirmación y elimina la meta junto con sus asesores. */
    const eliminarMeta = async (id: number) => {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        title: '¿Eliminar?',
        text: 'Se eliminará la meta y la meta de cada asesor.',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      })
      if (!isConfirmed) return
      try {
        const asesores = await listarAsesoresMeta(id)
        await Promise.all(asesores.map((asesor) => eliminarAsesor(asesor.id!)))
        await remove(id)
      } catch (e) {
        await Swal.fire({ icon: 'error', title: 'No se pudo eliminar', html: mensajeError(e) })
      }
    }

  return {
    metas,
    meta,
    searcher,
    cargarMeta,
    guardarMeta,
    eliminarMeta,
  }
}
