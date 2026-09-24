import { addDays, differenceInCalendarDays, isSunday, parseISO } from 'date-fns'
import { DataTableSimple2, type ColumnaSimple2 } from '@/components/DataTableSimple/DataTableSimple2'
import type { SeguimientoMembresiaProps } from './store/seguimientoMembresiaSlice'
import { formatDate } from '@/helpers/FormatDate'

type Props = {
    data: SeguimientoMembresiaProps[]
    /** activo: muestra sesiones disponibles; inactivo: muestra dias vencidos */
    tipo: 'activo' | 'inactivo'
}

/**
 * Dias transcurridos desde la fecha de vencimiento hasta hoy (cuenta domingos).
 * Se usa para separar activos (<= 0) de inactivos (> 0).
 */
export const diasVencidos = (fecha_vencimiento: string) =>
    differenceInCalendarDays(new Date(), parseISO(fecha_vencimiento))

/** Cuenta los dias de (desde, hasta] sin contar los domingos; 0 si hasta <= desde */
const contarDiasSinDomingo = (desde: Date, hasta: Date) => {
    const total = differenceInCalendarDays(hasta, desde)
    let dias = 0
    for (let i = 1; i <= total; i++) {
        if (!isSunday(addDays(desde, i))) dias++
    }
    return dias
}

/** Dias que faltan desde hoy (fecha_actual) hasta la fecha de vencimiento, sin domingos */
export const sesionesDisponibles = (fecha_vencimiento: string) =>
    contarDiasSinDomingo(new Date(), parseISO(fecha_vencimiento))

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
                </div>
            ),
            searchValue: (row) => `${row.label_nombres_apellidos_cli ?? ''} ${row.email_cli ?? ''} ${row.telefono_cli ?? ''}`,
        },
        tipo === 'activo'
            ? {
                id: 1,
                header: <div className='' style={{width: '140px'}}>Sesiones disponibles</div>,
                render: (row) => <div className=''><span className='fs-4'>{sesionesDisponibles(row.fecha_vencimiento)}</span> Sesiones</div>,
                sortValue: (row) => sesionesDisponibles(row.fecha_vencimiento),
                searchValue: (row) => String(sesionesDisponibles(row.fecha_vencimiento)),
            }
            : {
                id: 1,
                header: 'Dias vencidos',
                render: (row) =><div className=''><span className='fs-4'>{-diasVencidos(row.fecha_vencimiento)}</span> Dias</div>,
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
