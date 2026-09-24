import React, { useCallback, useEffect, useState } from 'react'
import { querys } from '@/types/parametros'
import { useQueryParams } from '@/hook/useQueryParams'
import { InputCR } from '@/components/TextFields/InputCR'
type prop={
    onSearchChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void
    /** Columnas (strings) en las que se debe buscar. Vacío = buscar en todas */
    columnasBusqueda?: string[]
}
export const SearchedCR = ({onSearchChange, columnasBusqueda}:prop) => {
    const [search, setSearch] = useState('')
    const { set, get } = useQueryParams();
    const querySearch = (get(querys.search)||'')
    // Si el search cambia desde fuera, sincronizamos el input
    useEffect(() => {
        setSearch(querySearch)
    }, [querySearch])
    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearch(value)
        // Actualiza ?search=...
        set({[querys.search]: value, [querys.page]: 1})
        console.log('SearchedCR ->', { valor: value, columnasBusqueda: columnasBusqueda ?? [] })
        onSearchChange?.(value, e)
        },
        [set, onSearchChange, columnasBusqueda]
    )
  return (
    <InputCR
        label="Buscar..."
        value={search}
        onChange={handleSearchChange}
        style={{ maxWidth: 220 }}
    />
  )
}
