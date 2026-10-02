import { DataTableSimple2, type ColumnaSimple2 } from '@/components/DataTableSimple/DataTableSimple2'
import type { SeguimientoMembresiaProps } from './store/seguimientoMembresiaSlice'
import { formatDate } from '@/helpers/FormatDate'
import { diasVencidos, sesionesDisponibles } from '@/helpers/diasMembresia'

type Props = {
    data: SeguimientoMembresiaProps[]
    /** activo: muestra sesiones disponibles; inactivo: muestra dias vencidos */
    tipo: 'activo' | 'inactivo'
}

export const DataTableSeguimiento = ({ data, tipo }: Props) => {
    const columns: ColumnaSimple2<SeguimientoMembresiaProps>[] = [
        {
            id: 0,
            header: 'Cliente',
            render: (row) => (
                <div className=''>
                    <div>{row.label_nombres_apellidos_cli}</div>
                    <div style={{ fontSize: '12px' }}>Email: {row.email_cli?.trim() ? `${row.email_cli}` : <span className='text-danger'>Sin email</span>}</div>
                    <div style={{ fontSize: '12px' }}>Telefono: {row.telefono_cli?.trim() ? `${row.telefono_cli}` : <span className='text-danger'>Sin telefono</span>}</div>
                    <div style={{ fontSize: '12px' }}>Asesor: {row.label_nombres_apellidos_empl?.trim() ? row.label_nombres_apellidos_empl : <span className='text-danger'>Sin asesor</span>}</div>
                </div>
            ),
            searchValue: (row) => `${row.label_nombres_apellidos_cli ?? ''} ${row.email_cli ?? ''} ${row.telefono_cli ?? ''} ${row.label_nombres_apellidos_empl ?? ''}`,
        },
        tipo === 'activo'
            ? {
                id: 1,
                header: <div className='' style={{width: '140px'}}>Días por vencer</div>,
                render: (row) => <div className=''><span className='fs-4'>{sesionesDisponibles(row.fecha_vencimiento)}</span> {sesionesDisponibles(row.fecha_vencimiento)===1?'día':'días'}</div>,
                sortValue: (row) => sesionesDisponibles(row.fecha_vencimiento),
                searchValue: (row) => String(sesionesDisponibles(row.fecha_vencimiento)),
            }
            : {
                id: 1,
                header: 'Dias vencidos',
                render: (row) =><div className=''><span className='fs-4'>{-diasVencidos(row.fecha_vencimiento)}</span> {diasVencidos(row.fecha_vencimiento)==1?'día':'días'}</div>,
                sortValue: (row) => -diasVencidos(row.fecha_vencimiento),
                searchValue: (row) => String(-diasVencidos(row.fecha_vencimiento)),
            },
        {
            id: 2,
            header: 'Fecha de vencimiento',
            render: (row) => <>{formatDate(row.fecha_vencimiento, 'yyyy-mm-dd', 'DDDD dd [de] MMMM [del] yyyy')}</>,
            searchValue: (row) => formatDate(row.fecha_vencimiento, 'yyyy-mm-dd', 'DDDD dd [de] MMMM [del] yyyy'),
        },
    ]
    return (
        <div>
            <DataTableSimple2 columns={columns} data={data} />
        </div>
    )
}
