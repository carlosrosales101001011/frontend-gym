import { useState } from "react";
import httpClient from "@/common/helpers/httpClient";
import { useQueryParams } from "@/hook/useQueryParams";
import { querys } from "@/types/parametros";
import { useDispatch } from "react-redux";
import type { UnknownAction } from "@reduxjs/toolkit";
import { onSetItemsLen, onSetTotalShow } from "@/stores/ui/uiSlice";
import { removeNull } from "@/helpers/removeNull";

export const useCrudhook = <T,>(model: string,  action?: (payload: T[]) => UnknownAction) => {
    const [dataxID, setdataxID] = useState<T>()
    const { get,
    } = useQueryParams();
    
    const querySearch = (get(querys.search)||'')
    const page = Number(get(querys.page))||1;
    const show = Number(get(querys.show))||20;
    const dispatch = useDispatch();
    const obtenerAll = async() => {
        const {data} = await httpClient.get(`${model}`)
        console.log({data});
        
        if (typeof action === 'function') {
            dispatch(action(data.lista));
        }
        return data;
    }
    const obtener = async(ultimoId=10) => {
        const offset = ((page-1)*show)
        const {data} = await httpClient.get(`${model}/`, {
            params: {
            show,
            offset,
            cursor: ultimoId
            }
        })
        if (typeof action === 'function') {
            dispatch(action(data.lista));
        }
        return data;
    }
    const searcher = async (signal?: AbortSignal) => {
            const safeShow = Math.max(1, Number(show) || 20);
            const safePage = Math.max(1, Number(page) || 1);
            const q = querySearch || '';
            const offset = (safePage - 1) * safeShow;
            
            console.log({q});
            const { data } = await httpClient.get(`${model}/search`, {
                params: { q, show: safeShow, offset },
                signal,
            });
            console.log({data, offset, safeShow, safePage}, 'en parametros: ',{q, show, page});
            
            if (typeof action === 'function') {
                dispatch(action(data.items));
                dispatch(onSetTotalShow(data.total));
                dispatch(onSetItemsLen(data.items.length));
            }
            return data;
        };
    return {
        postBulk: async(values: T[]) => {
            const data = await httpClient.post(`${model}/bulk`, values)
            return data;
        },
        post: async(values: object) => {
                const data = await httpClient.post(`${model}`, removeNull(values))
                console.log({data});
                
                await searcher()
            return data;
        },
        obtener,
        searcher: searcher,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- uuid ya no se usa en la URL (el backend no tiene esa ruta), se mantiene por compatibilidad con los llamadores existentes
        patch: async(values: object, id:number, _uuid?:string) => {
            console.log({values});

                const data = await httpClient.patch(`${model}/id/${id}`, values)
                await searcher()
            return data;
        },
        remove: async( id:number) => {
                const data = await httpClient.delete(`${model}/id/${id}`)
                await searcher()
            return data;
        },
        obtenerxID: async(id:number) => {
                const data = await httpClient.get(`${model}/id/${id}`)
                setdataxID(data.data)
            return data;
        },
        dataxID,
        page,
        show,
        obtenerAll
    };
};