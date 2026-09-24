import { useState } from "react";
import httpClient from "@/common/helpers/httpClient";
import type { IconName } from "@/components/Icons/IconCR";
import { onSetModulos, type moduloProps } from "@/routes/store/moduloSlice";
import { useDispatch } from "react-redux";
import { onSetSecciones } from "@/routes/store/seccionSlice";
export type Option = {
  id: number;
  id_modulo: number;
  id_user: number;
  is_favorito: boolean;
  is_fijado:boolean;
  modulo: Modulo
};
export type Modulo = {
    label: string;
    icono: IconName; // puedes usar SVG o clases
    descripcion: string;
    url: string;
    id_tipo: number;
}

export type SeccionType = {
  id_modulouser:number;
  id_seccion: number;
  seccion:{
    id: number;
    subSeccion: string;
    label: string;
    url:string
  }
}

export const useUserModuloStore = () => {
    const [loadingSecciones, setLoadingSecciones] = useState(true);
    const [loadingModulos, setLoadingModulos] = useState(true);
      const dispatch = useDispatch()
    const obtenerModulos = async()=>{
      try {
          setLoadingModulos(true);
          const {data} = await httpClient.get(`/modulo-x-user/user/`)
          dispatch(onSetModulos(data))
      } catch (error) {
          console.log(error);
      } finally {
        setLoadingModulos(false);
      }
    }
  const hasModule = (id: number, misModulos:moduloProps[]):boolean =>{
    return misModulos.some((m) => m.id_modulo === id);
  }
  const hasSeccion = (url:string, id_modulo: number, secciones:SeccionType[]):boolean=>{
    return secciones.some((m) => m.seccion.url === url && m.id_modulouser===id_modulo);
  }
  const hasSeccionxURL = (url:string, secciones:SeccionType[]):boolean=>{
    return secciones.some((m) => m.seccion.url === url);
  }
  const obtenerSeccionesxModulo = async(id_modulouser:number)=>{
    
    try {
            setLoadingSecciones(true);
            const {data} = await httpClient.get(`/seccion-x-modulouser/user/modulo/${id_modulouser}`)
            console.log({data});
            
            dispatch(onSetSecciones(data))
        } catch (error) {
            console.log(error);
        } finally {
          setLoadingSecciones(false);
        }
  }
  return {
    obtenerModulos,
    hasSeccionxURL,
    obtenerSeccionesxModulo,
    hasSeccion,
    hasModule,
    loadingSecciones,
    loadingModulos
  }
}


