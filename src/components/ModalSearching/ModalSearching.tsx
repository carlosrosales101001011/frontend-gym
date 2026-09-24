import React, { useEffect, useState } from 'react'
import ModalCR from '../Modal/ModalCR';
import { InputSearcherCR } from '../TextFields/InputSearcherCR';
import { ItemSearching } from './ItemSearching';
import { useDebounce } from '@/hook/useDebounce';

export type ItemResultado = {
    id: number;
    nombre: string;
    telefono: string;
    email_personal: string;
    dni: string;
    avatar?: string;
}

type ModalSearchingProps = {
    isOpen: boolean;
    onHide: () => void;
    id: number;
    labelInput?: string;
    items?: ItemResultado[];
    onSelect?: (id: number) => void;
    onSearch?: (query: string, signal?: AbortSignal) => void;
}

const ITEM_HEIGHT = 56
const MAX_VISIBLE_ITEMS = 7

export const ModalSearching = ({isOpen, onHide, id, labelInput='Buscar por nombre, DNI o Telefono', items=[], onSelect, onSearch}:ModalSearchingProps) => {
    const [query, setQuery] = useState('')
    const debouncedQuery = useDebounce(query, 400)

    // dispara la busqueda en el servidor cada vez que cambia el termino (debounced) o se abre el modal
    useEffect(() => {
        if (!isOpen) return
        const controller = new AbortController()
        onSearch?.(debouncedQuery, controller.signal)
        return () => controller.abort()
        // eslint-disable-next-line react-hooks/exhaustive-deps -- onSearch se recrea cada render en el padre, no debe re-disparar el efecto
    }, [debouncedQuery, isOpen])

    useEffect(() => {
        if (!isOpen) setQuery('')
    }, [isOpen])

    const onCancel = ()=>{
        onHide()
        console.log(id);
    }
    const onSelectItem = (idSeleccionado: number) => {
        onSelect?.(idSeleccionado)
        onCancel()
    }
    // cuando hay busqueda por servidor, "items" ya viene filtrado por el backend
    const itemsFiltrados = onSearch
        ? items
        : items.filter((item)=>
            item.nombre.toLowerCase().includes(query.toLowerCase()) ||
            item.dni.toLowerCase().includes(query.toLowerCase())
        )
  return (
    <ModalCR size='md' position='center' show={isOpen} onHide={onCancel}>
        <ModalCR.Header showCloseButton={false}>
            <InputSearcherCR placeholder={labelInput} onSearch={setQuery} />
        </ModalCR.Header>
        <ModalCR.Body>
            <div className="scroll-mode-actual" style={{maxHeight: `${ITEM_HEIGHT * MAX_VISIBLE_ITEMS}px`}}>
                {itemsFiltrados.length === 0 ? (
                    <div className="text-center color-mode-actual py-4">
                        No se encontro ningun item
                    </div>
                ) : (
                    itemsFiltrados.map((item)=>(
                        <ItemSearching
                            key={item.id}
                            id={item.id}
                            nombre={item.nombre}
                            dni={item.dni}
                            avatar={item.avatar}
                            email={item.email_personal}
                            telefono={item.telefono}
                            onClick={onSelectItem}
                        />
                    ))
                )}
            </div>
        </ModalCR.Body>
    </ModalCR>
  )
}
