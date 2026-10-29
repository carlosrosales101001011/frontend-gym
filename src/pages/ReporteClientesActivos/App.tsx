import { useMemo, useState } from 'react'
import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'
import { HeaderApp } from './components/HeaderApp'
import { Header2App } from './components/Header2App'
import { BodyApp } from './components/BodyApp'
import { useClientesActivos } from './hook/useClientesActivos'
import { filtrarClientes, type DimensionCliente, type FiltrosClientes } from './helpers/resumenClientesActivos'

/**
 * Reporte de clientes activos: los que tienen una membresía que vence después de hoy. Se filtra haciendo click
 * en las filas de las tablas de las cards (los filtros se ven como badges en el header).
 */
export const App = () => {
  const { clientes, loading, error } = useClientesActivos()
  const [filtros, setFiltros] = useState<FiltrosClientes>({})

  // Click en una fila: filtra por ese grupo; si ya era el filtro de esa dimensión, lo quita
  const filtrar = (dimension: DimensionCliente, grupo: string) =>
    setFiltros(({ [dimension]: actual, ...resto }) => (actual === grupo ? resto : { ...resto, [dimension]: grupo }))
  const quitar = (dimension: DimensionCliente) =>
    setFiltros((actuales) => {
      const resto = { ...actuales }
      delete resto[dimension]
      return resto
    })

  const filtrados = useMemo(() => filtrarClientes(clientes, filtros), [clientes, filtros])

  return (
    <div className="p-2">
      <PageBreadCumb title="Reporte de clientes activos"/>
      <HeaderApp filtros={filtros} onQuitar={quitar} onLimpiar={() => setFiltros({})}/>
      <Header2App clientes={filtrados} loading={loading} error={error}/>
      <BodyApp clientes={clientes} filtros={filtros} onFiltrar={filtrar} loading={loading} error={error}/>
    </div>
  )
}
