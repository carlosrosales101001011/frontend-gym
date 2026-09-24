import { useDispatch } from "react-redux";
import httpClient from "@/common/helpers/httpClient";
import { onSetModulos, onSetSecciones, type moduloProp, type SeccionProp } from "@/stores/permisos/permisoSlice";
import { useState } from "react";

export const usePermisosStore = () => {
    const dispatch = useDispatch()
    const [loadingSecciones, setLoadingSecciones] = useState(true);
    const [loadingModulos, setLoadingModulos] = useState(true);
    
      const hasModule = (id: number, misModulos:moduloProp[]):boolean =>{
        console.log({misModulos, id});
        
        return misModulos.some((m) => m.id === id);
      }
      const hasSeccion = (url:string, id_modulo: number, secciones:SeccionProp[]):boolean=>{
        return secciones.some((m) => m.seccion.url === url && m.id_modulouser===id_modulo);
      }
      const hasSeccionxURL = (url:string, secciones:SeccionProp[]):boolean=>{
        return secciones.some((m) => m.seccion.url === url);
      }
      const obtenerEntidades = async()=>{
        try {     
          console.log('permisos');
          const { data } = await httpClient.get(`/entidad-x-user/user/`)
          
          console.log({data});
          
        } catch (error) {
          console.log(error);
        }
      }
      const obtenerModulos = async()=>{
        try {
          console.log('aaa');
          setLoadingModulos(true);
          const {data} = await httpClient.get(`/modulo-x-user/user/`)
          console.log({data});
          
          dispatch(onSetModulos(data))
        } catch (error) {
            console.log(error);
        }finally {
          setLoadingModulos(false);
        }
      }
      const obtenerSeccionesxIDModulo = async(id_modulo:number)=>{
        try {
          setLoadingSecciones(true);
          const {data} = await httpClient.get(`/seccion-x-modulouser/user/modulo/${id_modulo}`)
          console.log({data});
          dispatch(onSetSecciones(data))
            // dispatch(onSetModulos(data))
        } catch (error) {
            console.log(error);
        } finally {
          setLoadingSecciones(false);
        }
      }
  return {
    obtenerModulos,
    obtenerSeccionesxIDModulo,
    obtenerEntidades,
    hasSeccionxURL,
    hasModule,
    hasSeccion,
    loadingSecciones,
    loadingModulos
  }
}
