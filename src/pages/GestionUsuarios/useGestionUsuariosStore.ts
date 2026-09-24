import { useState } from "react";
import httpClient from "@/common/helpers/httpClient";
import { useCrudhook } from "@/hook/usecrudhook";
import { onSetDataUsers, type SeccionesEntidadProps, type SeccionxModuloProps, type UserProps } from "@/pages/GestionUsuarios/store/usuariosSlice";
import { useAppDispatch } from "@/stores/Store";
import type { EntidadProp } from "@/stores/permisos/permisoSlice";
// import { useSelector } from "react-redux";

export const useGestionStore = () => {
  // const {entidades} = useSelector((state: RootState)=>state.USER.user)
  const [seccionesxModulo, setseccionesxModulo] = useState<SeccionxModuloProps[]>([])
  const { post, obtener, patch, remove, searcher } = useCrudhook<UserProps>('/user', onSetDataUsers)
  const dispatch = useAppDispatch()
  const obtenerSeccionesxMe = async()=>{
    try {
      const { data } = await httpClient.get(`/seccion-x-modulo/user/modulo/:id_moduloUser`)
    } catch (error) {
      console.log(error);
    }
  }
  const obtenerSeccionxModuloUser = async()=>{
    try {
      const { data } = await httpClient.get(`/modulo-x-user/user/secciones`)
      const { data:dataEntidadxUser } = await httpClient.get(`/entidad-x-user/user/all`)
      console.log({obtenerSeccionxModuloUser: agruparPorModulo(data, dataEntidadxUser), entitiesDeSeccionxModuloUser: agruparPorModulo(data, dataEntidadxUser).flatMap(e=>e.sections).flatMap(e=>e.entities), data, dataEntidadxUser});
      setseccionesxModulo(agruparPorModulo(data, dataEntidadxUser))
    } catch (error) {
      console.log(error);
    }
  }
  const postUsuario = async (user:UserProps, modulos:SeccionesEntidadProps[], seccionesxModulo: {id_modulouser:number, id_seccion?: number}[], entidadesCRUD: EntidadProp[])=>{
    try {
      const { data }  = await httpClient.post(`/user/register`, user)
      const formModulo = modulos.map(item=>{
        return {
          id_user: data.id,
          id_modulo: item.id_modulo,
          is_fijado: 0,
          is_favorito: 0,
        }
      })
      console.log({formModulo});
      const {data:dataModulo} = await httpClient.post(`/modulo-x-user/bulk`, formModulo)
      const seccionesxModuloForm = seccionesxModulo.map(item=>{
        return {
          id_modulouser: dataModulo.find((f:SeccionesEntidadProps)=>f.id_modulo===item?.id_modulouser)?.id||0,
          id_seccion: item?.id_seccion,
        }
      })
      const entidadesCRUDForm = entidadesCRUD.map(item=>{
        return {
          ...item,
          id_user: data.id,
        }
      })
      await httpClient.post(`/entidad-x-user/bulk`, entidadesCRUDForm)
      await httpClient.post(`/seccion-x-modulouser/bulk`, seccionesxModuloForm)
      return data
    } catch (error) {
      console.log(error);
    }
  }
  return {
    postUsuario,
    seccionesxModulo,
    obtenerSeccionxModuloUser,
    dispatch,
    obtenerSeccionesxMe,
    searcher,
    // obtenerEntidadesxMe,
    post,
    obtener,
    patch,
    remove,
  }
}

function agruparPorModulo(array:any[], arrayEntidadxUser:any[] = []) {
  const mapa = new Map();

  for (const item of array) {
    const idModulo = item.id_modulouser;

    if (!mapa.has(idModulo)) {
      mapa.set(idModulo, {
        id: idModulo,
        sections: []
      });
    }

    mapa.get(idModulo).sections.push(item);
  }

  return Array.from(mapa.values())
  .map(({ id, sections }) => {
    const labelModulo = sections[0].moduloUser.modulo.label||'';
    return {
      id,
      label: labelModulo,
      sections: sections.map(({ id, seccion }: { id: number; seccion: { label: string, entidades: Array<any> } }) => ({
        id: id,
        label: seccion?.label || '',
        entities: (seccion?.entidades || []).map(entidad=>{
          return {
            ...entidad,
            ...arrayEntidadxUser.find(e=>e.id_entidad===entidad.id_entidad)
          }
        })
      })).filter((f: { entities: unknown[] })=>f.entities.length>0)
    }
  });
}