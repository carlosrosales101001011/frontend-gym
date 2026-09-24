import httpClient from '@/common/helpers/httpClient';
import type { RootState } from '@/stores/Store';
import { onSetDataOpcionesSucursales, onSetDataPersona, type SucursalProps } from '@/pages/PuntoVenta/store/ventaSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useCrudhook } from '@/hook/usecrudhook';

export const usePersonaStore = (id_tipo: number) => {
  const dispatch = useDispatch();
  const { personas, sucursales } = useSelector((state: RootState) => state.VENTA);
  const { obtener:obtenerSucursales } = useCrudhook<SucursalProps>('/empresa-sucursal')
  const buscarPersona = async (q: string, signal?: AbortSignal) => {
    try {
      const { data } = await httpClient.get(`/persona/id_tipo/${id_tipo}/search/box`, {
        params: { q },
        signal,
      });
      dispatch(onSetDataPersona(data.items));
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const obtenerOpSucursales = async()=>{
        try {
          const data = await obtenerSucursales()
          console.log(data.lista);
          dispatch(onSetDataOpcionesSucursales(data.lista.map((sucursal:SucursalProps)=>({value:sucursal.id, label:sucursal.nombre}))))
        } catch (error) {
          console.log(error);
        }
      }
  return {
    personas,
    sucursales,
    buscarPersona,
    obtenerOpSucursales,
  };
};
