import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { DataTableSimple2, type ColumnaSimple2 } from '@/components/DataTableSimple/DataTableSimple2'
import { formatDate } from '@/helpers/FormatDate'
import type { ClienteActivoProps } from '../hook/useClientesActivos'
import { diasPorVencer } from '../helpers/resumenClientesActivos'
import { CardReporte } from '../components/CardReporte'

type TablaClientesActivosProps = {
  clientes: ClienteActivoProps[]
  loading: boolean
  error: string
}

/** Programa y plan de la membresía ('POR DEFINIR' si la venta no los tiene) */
const programaPlan = (cliente: ClienteActivoProps) =>
  [cliente.label_programa?.trim(), cliente.n_plan?.trim()].filter(Boolean).join(' · ') || 'POR DEFINIR'

/** Tabla de clientes activos: cliente (link a su perfil), programa/plan, asesor, vencimiento y días por vencer */
export const TablaClientesActivos = ({ clientes, loading, error }: TablaClientesActivosProps) => {
  const location = useLocation()
  const [, uid_modulo] = location.pathname.split('/')

  const columnas = useMemo<ColumnaSimple2<ClienteActivoProps>[]>(() => [
    {
      id: 'cliente',
      header: 'Cliente',
      render: (cliente) => (
        <div>
          {cliente.uid_cli
            ? <Link to={`/${uid_modulo}/perfil-cliente/${cliente.uid_cli}`} className="fw-bold">{cliente.label_nombres_apellidos_cli}</Link>
            : <span className="fw-bold">{cliente.label_nombres_apellidos_cli}</span>}
          {cliente.es_congelado && <span className="badge-congelado ms-2">Congelado</span>}
          {cliente.es_regalo && <span className="badge-regalo ms-2">Regalo</span>}
          {cliente.telefono_cli?.trim() && <div className="small opacity-75">{cliente.telefono_cli}</div>}
        </div>
      ),
      sortValue: (cliente) => cliente.label_nombres_apellidos_cli ?? '',
      searchValue: (cliente) => `${cliente.label_nombres_apellidos_cli ?? ''} ${cliente.telefono_cli ?? ''}`,
    },
    {
      id: 'programa',
      header: 'Programa / Plan',
      render: programaPlan,
      sortValue: programaPlan,
      searchValue: programaPlan,
    },
    {
      id: 'asesor',
      header: 'Asesor',
      render: (cliente) => cliente.label_nombres_apellidos_empl?.trim() || <span className="opacity-75">Sin asesor</span>,
      sortValue: (cliente) => cliente.label_nombres_apellidos_empl ?? '',
      searchValue: (cliente) => cliente.label_nombres_apellidos_empl ?? '',
    },
    {
      id: 'vencimiento',
      header: 'Vencimiento',
      render: (cliente) => formatDate(cliente.fecha_vencimiento, 'yyyy-mm-dd', 'dd/mm/yyyy'),
      sortValue: (cliente) => cliente.fecha_vencimiento,
    },
    {
      id: 'por-vencer',
      header: 'Días por vencer',
      render: (cliente) => {
        const dias = diasPorVencer(cliente)
        return <span className={dias <= 7 ? 'fw-bold text-danger' : undefined}>{dias} {dias === 1 ? 'día' : 'días'}</span>
      },
      sortValue: diasPorVencer,
    },
  ], [uid_modulo])

  return (
    <CardReporte titulo={`Clientes activos (${clientes.length})`} loading={loading} error={error} vacio={clientes.length === 0}>
      <DataTableSimple2 data={clientes} columns={columnas} defaultSort={{ id: 'por-vencer', dir: 'asc' }} />
    </CardReporte>
  )
}
