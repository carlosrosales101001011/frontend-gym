import { DataTableSimple } from '@/components/DataTableSimple/DataTableSimple'
import React from 'react'

export const DataMembresias = () => {
    const columns = [
        {
            header: 'Programa',
            
        },
        {
            header: 'Plan'
        },
        {
            header: 'Fecha de inicio'
        },
        {
            header: 'Fecha de fin'
        },
        {
            header: 'Dias para congelar'
        },
        {
            header: 'Dias regalos nutricion'
        },
        {
            header: 'Monto'
        },
    ]
  return (
    <div>
        <DataTableSimple
            columns={columns}
        />
    </div>
  )
}
