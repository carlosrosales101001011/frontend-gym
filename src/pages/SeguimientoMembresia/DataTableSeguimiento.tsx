import { Link, useLocation } from 'react-router-dom'
import { DataTableSimple2, type ColumnaSimple2 } from '@/components/DataTableSimple/DataTableSimple2'
import type { SeguimientoMembresiaProps } from './store/seguimientoMembresiaSlice'
import { formatDate } from '@/helpers/FormatDate'
import { diaEnCurso, diasVencidos, sesionesDisponibles } from '@/helpers/diasMembresia'

type Props = {
    data: SeguimientoMembresiaProps[]
    /** activo: muestra sesiones disponibles; inactivo: muestra dias vencidos */
    tipo: 'activo' | 'inactivo'
}

/** Resalta la fila según la extensión en curso hoy: congelamiento (azul hielo) o regalo (rojo) */
const claseFila = (row: SeguimientoMembresiaProps) =>
    row.es_congelado ? 'fila-congelada' : row.es_regalo ? 'fila-regalo' : undefined

/** "Está en congelamiento: 3/10 días" (o regalo) debajo del vencimiento; nada si no hay extensión en curso */
const ExtensionEnCurso = ({ row }: { row: SeguimientoMembresiaProps }) => {
    if (!(row.es_congelado || row.es_regalo) || !row.fecha_inicio_extension_actual || !row.dias_extension_actual) return null
    const total = row.dias_extension_actual
    // Un regalo termina el día después de su último día: no pasar del total
    const dia = Math.min(Math.max(diaEnCurso(row.fecha_inicio_extension_actual), 1), total)
    return (
        <div style={{ fontSize: '12px' }}>
            Está en {row.es_congelado ? 'congelamiento' : 'regalo'}: <span className='fw-bold'>{dia}/{total}</span> {total === 1 ? 'día' : 'días'}
        </div>
    )
}

export const DataTableSeguimiento = ({ data, tipo }: Props) => {
    const location = useLocation()
    const [, uid_modulo] = location.pathname.split('/')
    const columns: ColumnaSimple2<SeguimientoMembresiaProps>[] = [
        {
            id: 0,
            header: 'Cliente',
            render: (row) => (
                <div className=''>
                    <div>
                        {row.uid_cli
                            ? <Link to={`/${uid_modulo}/perfil-cliente/${row.uid_cli}`} className='fw-bold'>{row.label_nombres_apellidos_cli}</Link>
                            : row.label_nombres_apellidos_cli}
                        {row.es_congelado && <span className='badge-congelado ms-2'>Congelado</span>}
                        {row.es_regalo && <span className='badge-regalo ms-2'>Regalo</span>}
                    </div>
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
            render: (row) => (
                <>
                    <div>{formatDate(row.fecha_vencimiento, 'yyyy-mm-dd', 'DDDD dd [de] MMMM [del] yyyy')}</div>
                    <ExtensionEnCurso row={row} />
                </>
            ),
            searchValue: (row) => formatDate(row.fecha_vencimiento, 'yyyy-mm-dd', 'DDDD dd [de] MMMM [del] yyyy'),
        },
    ]
    return (
        <div>
            <DataTableSimple2 columns={columns} data={data} rowClassName={claseFila} defaultSort={{ id: 1, dir: tipo === 'activo' ? 'asc' : 'desc' }} />
        </div>
    )
}
