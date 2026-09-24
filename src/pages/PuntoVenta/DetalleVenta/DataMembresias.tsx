import { DataTableSimple, type ColumnaSimple } from '@/components/DataTableSimple/DataTableSimple'

// TODO: tipar con la membresía real y pintar cada campo en su render
type MembresiaRow = Record<string, unknown>

export const DataMembresias = () => {
    const columns: ColumnaSimple<MembresiaRow>[] = [
        { id: 0, header: 'Programa', render: () => null },
        { id: 1, header: 'Plan', render: () => null },
        { id: 2, header: 'Fecha de inicio', render: () => null },
        { id: 3, header: 'Fecha de fin', render: () => null },
        { id: 4, header: 'Dias para congelar', render: () => null },
        { id: 5, header: 'Dias regalos nutricion', render: () => null },
        { id: 6, header: 'Monto', render: () => null },
    ]
  return (
    <div>
        <DataTableSimple
            data={[]}
            columns={columns}
        />
    </div>
  )
}
