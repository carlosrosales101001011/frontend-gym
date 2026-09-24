import type { AxiosResponse } from "axios"
import { useDispatch } from "react-redux"
import httpClient from "@/common/helpers/httpClient"
import { useCrudhook } from "@/hook/usecrudhook"
import {
  onSetDataOpcionesEmpleado,
  onSetDataOpcionesSucursal,
  onSetDataProductos,
  addProducto,
  onSetOriginales,
  type EmpleadoProps,
  type programaProps,
  type OriginalesPrograma,
  type ProgramaBaseBackend,
} from "./store/programaSlice"
import type { SucursalProps } from "@/pages/GestionSucursal/store/sucursalSlice"
import { sincronizarColeccion } from "./helpers/sincronizarColeccion"

type ListaConTotal<T> = { lista: T[], total: number }
type ProgramaCreadoResponse = { ok: boolean, msg: string, id: number, uid_avatar: string }

type CategoriaProgramaBackend = { id: number, id_programa: number, id_categoria: number, label_categoria: string }
type SucursalProgramaBackend = { id: number, id_programa: number, id_sucursal: number, label_sucursal: string }
type PlanProgramaBackend = { id: number, id_programa: number, nMeses: number, precioTotal: number, id_tipo_tarifa: number, label_tipo_tarifa: string, citas_nutricion_regalo: number, dias_congelamiento_regalo: number, estado: boolean }
type HorarioProgramaBackend = {
  id: number, id_programa: number, horarioInicio: string, horarioFin: string, id_empl: number, label_empl: string,
  is_lunes: boolean, is_martes: boolean, is_miercoles: boolean, is_jueves: boolean, is_viernes: boolean, is_sabado: boolean, is_domingo: boolean,
  estado: boolean,
}

export const useProgramaEntrenamientoStore = () => {
    const dispatch = useDispatch()

    // Mismo hook que usa el resto de gestiones (ver GestionImpuestos, GestionEgresos, etc.):
    // el programa (tabla padre) y sus 4 colecciones hijas comparten la misma forma de API REST.
    const {
      post: crearPrograma,
      patch: actualizarPrograma,
      remove: eliminarProgramaBase,
      obtenerxID: obtenerProgramaBase,
      obtener: obtenerListaProgramas,
    } = useCrudhook<ProgramaBaseBackend>('/programa-entrenamiento', onSetDataProductos)
    const { post: crearCategoria, remove: eliminarCategoria } = useCrudhook<CategoriaProgramaBackend>('/entrenamiento-categoria')
    const { post: crearSucursal, remove: eliminarSucursal } = useCrudhook<SucursalProgramaBackend>('/entrenamiento-sucursales')
    const { post: crearPlan, patch: actualizarPlan, remove: eliminarPlan } = useCrudhook<PlanProgramaBackend>('/entrenamiento-plan')
    const { post: crearHorario, patch: actualizarHorario, remove: eliminarHorario } = useCrudhook<HorarioProgramaBackend>('/entrenamiento-horario')

    const { obtener:obtenerEmpleadosxDepartamento } = useCrudhook<EmpleadoProps>('/contrato-empleado/id_departamento/6062')
    const { obtener:obtenerSucursalesEmpresa } = useCrudhook<SucursalProps>('/empresa-sucursal')
    const obtenerEntrenadores = async()=>{
        try {
            const data = await obtenerEmpleadosxDepartamento()
            dispatch(onSetDataOpcionesEmpleado([
                {value:0, label:'Rotativo'},
                ...data.lista.map((sucursal:EmpleadoProps)=>({value:sucursal.id_empl, label:sucursal.label_empl}))
            ]))
            } catch (error) {
            console.log(error);
            }
    }
    const obtenerSucursales = async()=>{
        try {
            const data = await obtenerSucursalesEmpresa()
            dispatch(onSetDataOpcionesSucursal(data.lista.map((sucursal:SucursalProps)=>({value:sucursal.id, label:sucursal.nombre}))))
            } catch (error) {
            console.log(error);
            }
    }

    // Subida del avatar: multipart, no encaja en la forma generica del hook.
    const subirAvatar = (uid_avatar: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return httpClient.post(`/programa-entrenamiento/avatar/${uid_avatar}`, formData);
    }

    // Listar hijos por id_programa: tampoco encaja en el hook (no es "buscar por su propio id").
    const listarCategoriasPrograma = (id_programa: number) =>
        httpClient.get(`/entrenamiento-categoria/id_programa/${id_programa}`) as Promise<AxiosResponse<ListaConTotal<CategoriaProgramaBackend>>>
    const listarSucursalesPrograma = (id_programa: number) =>
        httpClient.get(`/entrenamiento-sucursales/id_programa/${id_programa}`) as Promise<AxiosResponse<ListaConTotal<SucursalProgramaBackend>>>
    const listarPlanesPrograma = (id_programa: number) =>
        httpClient.get(`/entrenamiento-plan/id_programa/${id_programa}`) as Promise<AxiosResponse<ListaConTotal<PlanProgramaBackend>>>
    const listarHorariosPrograma = (id_programa: number) =>
        httpClient.get(`/entrenamiento-horario/id_programa/${id_programa}`) as Promise<AxiosResponse<ListaConTotal<HorarioProgramaBackend>>>

    // Trae un programa existente con sus categorias/sucursales/planes/horarios para poder editarlo
    const obtenerProgramaCompleto = async (id: number) => {
        const [{ data: programa }, { data: categorias }, { data: sucursales }, { data: planes }, { data: horarios }] = await Promise.all([
            obtenerProgramaBase(id) as Promise<AxiosResponse<ProgramaBaseBackend>>,
            listarCategoriasPrograma(id),
            listarSucursalesPrograma(id),
            listarPlanesPrograma(id),
            listarHorariosPrograma(id),
        ])

        const originales: OriginalesPrograma = {
            categorias: categorias.lista.map((item) => ({ id: item.id, id_categoria: item.id_categoria })),
            sucursales: sucursales.lista.map((item) => ({ id: item.id, id_sucursal: item.id_sucursal })),
            planes: planes.lista.map((item) => ({
                id: item.id,
                nMeses: item.nMeses,
                precioTotal: item.precioTotal,
                id_tipo_tarifa: item.id_tipo_tarifa,
                label_tipo_tarifa: item.label_tipo_tarifa,
                citas_nutricion_regalo: item.citas_nutricion_regalo,
                dias_congelamiento_regalo: item.dias_congelamiento_regalo,
                estado: item.estado,
            })),
            horarios: horarios.lista.map((item) => ({
                id: item.id,
                horarioInicio: item.horarioInicio,
                horarioFin: item.horarioFin,
                id_empl: item.id_empl,
                label_empl: item.label_empl,
                is_lunes: item.is_lunes,
                is_martes: item.is_martes,
                is_miercoles: item.is_miercoles,
                is_jueves: item.is_jueves,
                is_viernes: item.is_viernes,
                is_sabado: item.is_sabado,
                is_domingo: item.is_domingo,
                estado: item.estado,
            })),
        }

        dispatch(addProducto({
            id: programa.id,
            uid_avatar: programa.uid_avatar,
            url_avatar: programa.url_avatar,
            nombre: programa.nombre,
            sigla: programa.sigla,
            descripcion: programa.descripcion,
            minutos: String(programa.minutos ?? ''),
            estado: !!programa.estado,
            categorias: originales.categorias.map((item) => ({ ...item })),
            sucursales: originales.sucursales.map((item) => ({ ...item })),
            planes: originales.planes.map((item) => ({ ...item })),
            horarios: originales.horarios.map((item) => ({ ...item })),
        }))
        dispatch(onSetOriginales(originales))
    }

    // Crea o actualiza el programa (datos base + avatar) y sincroniza sus 4 colecciones hijas
    const guardarProgramaCompleto = async (producto: programaProps, originales: OriginalesPrograma, avatarFile: File | null) => {
        const payloadBase = {
            nombre: producto.nombre,
            sigla: producto.sigla,
            descripcion: producto.descripcion,
            minutos: Number(producto.minutos),
            estado: producto.estado,
        }

        let id_programa = producto.id;
        let uid_avatar = producto.uid_avatar;
        if (id_programa === 0) {
            const { data } = await crearPrograma(payloadBase) as AxiosResponse<ProgramaCreadoResponse>
            id_programa = data.id
            uid_avatar = data.uid_avatar
        } else {
            await actualizarPrograma(payloadBase, id_programa, '')
        }

        if (avatarFile && uid_avatar) {
            await subirAvatar(uid_avatar, avatarFile)
        }

        await Promise.all([
            sincronizarColeccion(originales.categorias, producto.categorias, {
                crear: (item) => crearCategoria({ id_programa, id_categoria: item.id_categoria }),
                eliminar: (id) => eliminarCategoria(id),
            }),
            sincronizarColeccion(originales.sucursales, producto.sucursales, {
                crear: (item) => crearSucursal({ id_programa, id_sucursal: item.id_sucursal }),
                eliminar: (id) => eliminarSucursal(id),
            }),
            sincronizarColeccion(originales.planes, producto.planes, {
                crear: (item) => crearPlan({ id_programa, nMeses: item.nMeses, precioTotal: item.precioTotal, id_tipo_tarifa: item.id_tipo_tarifa, citas_nutricion_regalo: item.citas_nutricion_regalo, dias_congelamiento_regalo: item.dias_congelamiento_regalo, estado: item.estado }),
                actualizar: (id, item) => actualizarPlan({ id_programa, nMeses: item.nMeses, precioTotal: item.precioTotal, id_tipo_tarifa: item.id_tipo_tarifa, citas_nutricion_regalo: item.citas_nutricion_regalo, dias_congelamiento_regalo: item.dias_congelamiento_regalo, estado: item.estado }, id, ''),
                eliminar: (id) => eliminarPlan(id),
            }),
            sincronizarColeccion(originales.horarios, producto.horarios, {
                crear: (item) => crearHorario({
                    id_programa, horarioInicio: item.horarioInicio, horarioFin: item.horarioFin, id_empl: item.id_empl,
                    is_lunes: item.is_lunes, is_martes: item.is_martes, is_miercoles: item.is_miercoles, is_jueves: item.is_jueves,
                    is_viernes: item.is_viernes, is_sabado: item.is_sabado, is_domingo: item.is_domingo, estado: item.estado,
                }),
                actualizar: (id, item) => actualizarHorario({
                    id_programa, horarioInicio: item.horarioInicio, horarioFin: item.horarioFin, id_empl: item.id_empl,
                    is_lunes: item.is_lunes, is_martes: item.is_martes, is_miercoles: item.is_miercoles, is_jueves: item.is_jueves,
                    is_viernes: item.is_viernes, is_sabado: item.is_sabado, is_domingo: item.is_domingo, estado: item.estado,
                }, id, ''),
                eliminar: (id) => eliminarHorario(id),
            }),
        ])

        return id_programa
    }

    const eliminarPrograma = (id: number) => eliminarProgramaBase(id)

  return {
    obtenerEntrenadores,
    obtenerSucursales,
    obtenerProgramaCompleto,
    guardarProgramaCompleto,
    eliminarPrograma,
    obtenerListaProgramas,
    listarCategoriasPrograma,
    listarPlanesPrograma,
    listarHorariosPrograma,
  }
}
