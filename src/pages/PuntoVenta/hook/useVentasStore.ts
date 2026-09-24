import { useState } from "react";
import Swal from "sweetalert2";
import httpClient from "@/common/helpers/httpClient";
import { useCrudhook } from "@/hook/usecrudhook";
import { onSetDataOpcionesSucursales, onSetClienteSeleccionado, onSetAsesorSeleccionado, onActualizarVentaCampo, onSetDataProgramas, onSetDataPlanes, onSetProgramaSeleccionado, onSetDataProductos, onSetMembresiaVenta, onQuitarMembresiaVenta, onAgregarProductoVenta, onSumarProductoVenta, onRestarProductoVenta, onQuitarProductoVenta, onAgregarPagoVenta, onActualizarPagoVenta, onEliminarPagoVenta, onResetVenta, type SucursalProps, type ProgramaProps, type ProductoProps, type DetalleMembresiaVentaProps, type DetallePagoVentaProps, type VentaProps, onSetDataHorario, type HorariosProps, type DetalleProductoVentaProps, type DataVentaProps } from "../store/ventaSlice";
import { useAppSelector } from "@/stores/Store";
import { useDispatch } from "react-redux";
import type { ItemResultado } from "@/components/ModalSearching/ModalSearching";

const DURACION_MINIMA_LOADING_MS = 1500

export const useVentasStore = () => {
  const dispatch = useDispatch();
  const [loadingVenta, setLoadingVenta] = useState(false);
  const { sucursales, clienteSeleccionado, asesorSeleccionado, programas, planes, idProgramaSeleccionado, productos, venta, horarios } = useAppSelector((state) => state.VENTA);
      const { obtener:obtenerSucursales } = useCrudhook<SucursalProps>('/empresa-sucursal')
      const {
            obtener: obtenerListaProgramas,
          } = useCrudhook<ProgramaProps>('/programa-entrenamiento')
      const {
            obtener: obtenerListaProductos,
          } = useCrudhook<ProductoProps>('/producto')
      const {
            post:postVenta,
            patch:patchVenta,
          } = useCrudhook<DataVentaProps>('/venta')
      const {
            post:postDetalleVentaMembresia
          } = useCrudhook<DetalleMembresiaVentaProps>('/detalleventa-membresias')
      const {
            postBulk:postBulkDetalleVentaProductos
          } = useCrudhook<DetalleProductoVentaProps>('/detalleventa-productos')
      const {
            postBulk:postBulkDetalleVentaPagos
          } = useCrudhook<DetallePagoVentaProps>('/detalleventa-pagos')
      
      const obtenerOpSucursales = async()=>{
            try {
              const data = await obtenerSucursales()
              console.log(data.lista);
              dispatch(onSetDataOpcionesSucursales(data.lista.map((sucursal:SucursalProps)=>({value:sucursal.id, label:sucursal.nombre}))))
            } catch (error) {
              console.log(error);
            }
          }
      const obtenerProgramas = async()=>{
            try {
              const data = await obtenerListaProgramas()
              dispatch(onSetDataProgramas(data.lista))
            } catch (error) {
              console.log(error);
            }
          }
      const obtenerProductos = async()=>{
            try {
              const data = await obtenerListaProductos()
              dispatch(onSetDataProductos(data.lista))
            } catch (error) {
              console.log(error);
            }
          }
      const obtenerPlanProgramas = async(id_programa: number)=>{
            try {
              const { data } = await httpClient.get(`/entrenamiento-plan/id_programa/${id_programa}`)
              dispatch(onSetDataPlanes(data.lista))
            } catch (error) {
              console.log(error);
            }
          }
      const obtenerHorarios = async(id_programa: number)=>{
            try {
              const { data } = await httpClient.get(`/entrenamiento-horario/id_programa/${id_programa}`)
              dispatch(onSetDataHorario(data.lista.map((sucursal:HorariosProps)=>({value:sucursal.id, label:`${sucursal.horarioInicio} - ${sucursal.horarioFin} | ${obtenerDiaStr(sucursal)}`, id_sucursal: sucursal.id}))))
            } catch (error) {
              console.log(error);
            }
          }
      const onSelectCliente = (cliente: ItemResultado | null) => {
        dispatch(onSetClienteSeleccionado(cliente))
      }
      const onSelectAsesor = (asesor: ItemResultado | null) => {
        dispatch(onSetAsesorSeleccionado(asesor))
      }
      const onActualizarVenta = (name: 'id_origen' | 'id_sucursal' | 'id_tipo_comprobante' | 'n_comprobante' | 'observacion', value: VentaProps[typeof name]) => {
        dispatch(onActualizarVentaCampo({ name, value }))
      }
      const onSelectPrograma = (id_programa: number) => {
        dispatch(onSetProgramaSeleccionado(id_programa))
      }
      const onSetMembresia = (membresia: DetalleMembresiaVentaProps) => {
        dispatch(onSetMembresiaVenta(membresia))
      }
      const onQuitarMembresia = () => {
        dispatch(onQuitarMembresiaVenta())
      }
      const onAgregarProducto = (producto: ProductoProps) => {
        dispatch(onAgregarProductoVenta(producto))
      }
      const onSumarProducto = (id_producto: number) => {
        dispatch(onSumarProductoVenta(id_producto))
      }
      const onRestarProducto = (id_producto: number) => {
        dispatch(onRestarProductoVenta(id_producto))
      }
      const onQuitarProducto = (id_producto: number) => {
        dispatch(onQuitarProductoVenta(id_producto))
      }
      const onAgregarPago = (pago: DetallePagoVentaProps) => {
        dispatch(onAgregarPagoVenta(pago))
      }
      const onActualizarPago = (index: number, name: keyof DetallePagoVentaProps, value: number) => {
        dispatch(onActualizarPagoVenta({ index, name, value }))
      }
      const onEliminarPago = (index: number) => {
        dispatch(onEliminarPagoVenta(index))
      }
      const onRegistrarVenta = async () => {
        const camposFaltantes = [
          !venta.id_cli && 'Cliente',
          !venta.id_empl && 'Asesor / Vendedor',
          !venta.id_sucursal && 'Sucursal',
          !venta.id_tipo_comprobante && 'Tipo de comprobante',
          !venta.n_comprobante && 'N° de comprobante',
        ].filter(Boolean) as string[]

        if (camposFaltantes.length > 0) {
          await Swal.fire({
            icon: 'warning',
            title: 'Faltan datos',
            html: `Falta completar: <span class='text-black'>${camposFaltantes.join(', ')}</span>`,
          })
          return
        }

        setLoadingVenta(true)
        const inicio = Date.now()
        try {
          const { detalleventa_membresias, detalleventa_productos, detalleventa_pagos, montoTotal, ...ventaData } = venta
          const dataVenta = await postVenta(ventaData)
          const id_venta = dataVenta?.data?.id

          if (detalleventa_membresias.id_programa) {
            const { label_horario, label_nmeses, label_precio, label_programa, ...membresiaData } = detalleventa_membresias
            // El backend crea el membresia-seguimiento de la venta al registrar la membresía.
            await postDetalleVentaMembresia({ ...membresiaData, id_venta })
          }

          if (detalleventa_productos.length > 0) {
            await postBulkDetalleVentaProductos(
              detalleventa_productos.map(({ stock_actual, url_avatar, ...productoData }) => ({
                ...productoData,
                id_venta,
              }))
            )
          }

          if (detalleventa_pagos.length > 0) {
            await postBulkDetalleVentaPagos(
              [...detalleventa_pagos.map(({ ...productoData }) => ({
                ...productoData,
                monto: productoData.montoPagos,
                id_venta,
                fecha_pago: new Date(),
                observacion: ''
              }))]
            )
          }

          const montoTotal_membresia = detalleventa_membresias.id_programa ? detalleventa_membresias.montoTotal : 0
          const montoTotal_productos = detalleventa_productos.reduce((acc, producto) => acc + producto.montoTotal, 0)
          const montoPagos = detalleventa_pagos.reduce((acc, pago) => acc + Number(pago.montoPagos), 0)
          console.log({montoPagos, montoTotal_membresia, montoTotal_productos, detalleventa_pagos});
          
          await patchVenta({ montoTotal_membresia, montoTotal_productos, montoPagos }, id_venta)

          dispatch(onResetVenta())

          return dataVenta
        } finally {
          const transcurrido = Date.now() - inicio
          const restante = DURACION_MINIMA_LOADING_MS - transcurrido
          if (restante > 0) {
            await new Promise((resolve) => setTimeout(resolve, restante))
          }
          setLoadingVenta(false)
        }
      }
  return {
    horarios,
    obtenerHorarios,
    obtenerOpSucursales,
    obtenerProgramas,
    obtenerPlanProgramas,
    obtenerProductos,
    sucursales,
    programas,
    planes,
    productos,
    idProgramaSeleccionado,
    onSelectPrograma,
    clienteSeleccionado,
    onSelectCliente,
    asesorSeleccionado,
    onSelectAsesor,
    onActualizarVenta,
    venta,
    onSetMembresia,
    onQuitarMembresia,
    onAgregarProducto,
    onSumarProducto,
    onRestarProducto,
    onQuitarProducto,
    onAgregarPago,
    onActualizarPago,
    onEliminarPago,
    onRegistrarVenta,
    loadingVenta,
  }
}

function obtenerDiaStr(dataHorario:HorariosProps) {
  const dias = [
    { activo: dataHorario.is_lunes, label: 'LUN' },
    { activo: dataHorario.is_martes, label: 'MAR' },
    { activo: dataHorario.is_miercoles, label: 'MIER' },
    { activo: dataHorario.is_jueves, label: 'JUE' },
    { activo: dataHorario.is_viernes, label: 'VIE' },
    { activo: dataHorario.is_sabado, label: 'SAB' },
    { activo: dataHorario.is_domingo, label: 'DOM' },
  ]
  return dias.filter((dia) => dia.activo).map((dia) => dia.label).join('-')
}