import httpClient from '@/common/helpers/httpClient'
import type { HorariosProps, PlanProps, ProductoProps, ProgramaProps, SucursalProps } from '@/pages/PuntoVenta/store/ventaSlice'

/** Listas que usan los formularios del detalle de una venta (programas, planes, horarios, productos, sucursales) */
export const useOpcionesVenta = () => {
  const obtenerProgramas = async () => {
    const { data }: { data: { lista: ProgramaProps[] } } = await httpClient.get('/programa-entrenamiento')
    return data.lista
  }

  /** Planes y horarios de un programa, pedidos en paralelo */
  const obtenerPlanesYHorarios = async (id_programa: number) => {
    const [{ data: dataPlanes }, { data: dataHorarios }]: [{ data: { lista: PlanProps[] } }, { data: { lista: HorariosProps[] } }] = await Promise.all([
      httpClient.get(`/entrenamiento-plan/id_programa/${id_programa}`),
      httpClient.get(`/entrenamiento-horario/id_programa/${id_programa}`),
    ])
    return { planes: dataPlanes.lista, horarios: dataHorarios.lista }
  }

  const obtenerProductos = async () => {
    const { data }: { data: { lista: ProductoProps[] } } = await httpClient.get('/producto')
    return data.lista
  }

  const obtenerSucursales = async () => {
    const { data }: { data: { lista: SucursalProps[] } } = await httpClient.get('/empresa-sucursal')
    return data.lista
  }

  return { obtenerProgramas, obtenerPlanesYHorarios, obtenerProductos, obtenerSucursales }
}
