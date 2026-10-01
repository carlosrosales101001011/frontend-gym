import { useDispatch } from "react-redux";
import httpClient from "@/common/helpers/httpClient";
import { onSetModulos, onSetSecciones, type moduloProp, type SeccionProp } from "@/stores/permisos/permisoSlice";
import { useRef, useState } from "react";

/** Las url de sección se comparan sin la "/" inicial (en la base se guardan sin ella) */
const sinBarra = (url: string) => url.replace(/^\//, '');

export const usePermisosStore = () => {
    const dispatch = useDispatch()
    const [loadingSecciones, setLoadingSecciones] = useState(true);
    const [loadingModulos, setLoadingModulos] = useState(true);
    // Número de la última petición de secciones: si llega tarde una respuesta vieja, se descarta
    const ultimaPeticionSecciones = useRef(0);
    
      const hasModule = (id: number, misModulos:moduloProp[]):boolean =>{
        return misModulos.some((m) => m.id === id);
      }
      const hasSeccion = (url:string, id_modulo: number, secciones:SeccionProp[]):boolean=>{
        return secciones.some((m) => sinBarra(m.seccion.url) === sinBarra(url) && m.id_modulouser===id_modulo);
      }
      const hasSeccionxURL = (url:string, secciones:SeccionProp[]):boolean=>{
        return secciones.some((m) => sinBarra(m.seccion.url) === sinBarra(url));
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
          setLoadingModulos(true);
          const {data} = await httpClient.get(`/modulo-x-user/user/`)
          dispatch(onSetModulos(data))
        } catch (error) {
            console.log(error);
        }finally {
          setLoadingModulos(false);
        }
      }
      /** Secciones del módulo (uid de modulo_x_user); el backend solo las devuelve si el módulo es del usuario */
      const obtenerSeccionesxUidModulo = async(uid_modulo:string)=>{
        const peticion = ++ultimaPeticionSecciones.current;
        const esLaUltima = () => peticion === ultimaPeticionSecciones.current;
        try {
          setLoadingSecciones(true);
          const {data} = await httpClient.get(`/seccion-x-modulouser/user/modulo/uid/${uid_modulo}`)
          if (esLaUltima()) dispatch(onSetSecciones(data))
        } catch (error) {
            console.log(error);
            // Sin secciones: ProtectedRoutes manda al home (y no se queda con las del módulo anterior)
            if (esLaUltima()) dispatch(onSetSecciones([]))
        } finally {
          if (esLaUltima()) setLoadingSecciones(false);
        }
      }
  return {
    obtenerModulos,
    obtenerSeccionesxUidModulo,
    obtenerEntidades,
    hasSeccionxURL,
    hasModule,
    hasSeccion,
    loadingSecciones,
    loadingModulos
  }
}
