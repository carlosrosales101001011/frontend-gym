import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { DataTableSimple2, type ColumnaSimple2 } from '@/components/DataTableSimple/DataTableSimple2'
import type { SeguimientoMembresiaProps } from './store/seguimientoMembresiaSlice'
import { formatDate } from '@/helpers/FormatDate'
import { diasVencidos, sesionesDisponibles } from '@/helpers/diasMembresia'
import { extensionEnCurso } from './helpers/seguimiento'

type Props = {
    data: SeguimientoMembresiaProps[]
    /** activo: muestra sesiones disponibles; inactivo: muestra dias vencidos */
    tipo: 'activo' | 'inactivo'
    /** Filas que quedan tras el buscador y el orden (para exportarlas) */
    onFilasVisibles?: (rows: SeguimientoMembresiaProps[]) => void
}

/** Resalta la fila según la extensión en curso hoy: congelamiento (azul hielo) o regalo (rojo) */
const claseFila = (row: SeguimientoMembresiaProps) =>
    row.es_congelado ? 'fila-congelada' : row.es_regalo ? 'fila-regalo' : undefined

/** "Está en congelamiento: 3/10 días" (o regalo) debajo del vencimiento; nada si no hay extensión en curso */
const ExtensionEnCurso = ({ row }: { row: SeguimientoMembresiaProps }) => {
    const extension = extensionEnCurso(row)
    if (!extension) return null
    const { tipo, dia, total } = extension
    return (
        <div style={{ fontSize: '12px' }}>
            Está en {tipo}: <span className='fw-bold'>{dia}/{total}</span> {total === 1 ? 'día' : 'días'}
        </div>
    )
}

/** "Programa, plan" de la membresía ('' si la venta no los tiene) */
// const programaPlan = (row: SeguimientoMembresiaProps) =>
//     [row.label_programa?.trim(), row.n_plan?.trim()].filter(Boolean).join(<br />)

/** Programa y plan arriba de los días; nada si la venta no los tiene */
const ProgramaPlan = ({ row }: { row: SeguimientoMembresiaProps }) => {
    const texto = row.label_programa?.trim()
    return texto ? <div className='fw-semibold' style={{ fontSize: '14px' }}>{row.label_programa?.trim()} <br/> {row.n_plan?.trim()}</div> : 'POR DEFINIR'
}

export const DataTableSeguimiento = ({ data, tipo, onFilasVisibles }: Props) => {
    const location = useLocation()
    const [, uid_modulo] = location.pathname.split('/')
    // Memorizadas: si cambiaran en cada render, la tabla avisaría filas nuevas sin parar (onFilasVisibles)
    const columns = useMemo<ColumnaSimple2<SeguimientoMembresiaProps>[]>(() => [
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
                render: (row) => (
                    <>
                        <ProgramaPlan row={row} />
                        <div className=''><span className='fs-4'>{sesionesDisponibles(row.fecha_vencimiento)}</span> {sesionesDisponibles(row.fecha_vencimiento)===1?'día':'días'}</div>
                    </>
                ),
                sortValue: (row) => sesionesDisponibles(row.fecha_vencimiento),
                searchValue: (row) => `${sesionesDisponibles(row.fecha_vencimiento)} ${row.label_programa?.trim()} ${row.n_plan?.trim()}`,
            }
            : {
                id: 1,
                header: 'Dias vencidos',
                render: (row) => (
                    <>
                        <ProgramaPlan row={row} />
                        <div className=''><span className='fs-4'>{-diasVencidos(row.fecha_vencimiento)}</span> {diasVencidos(row.fecha_vencimiento)==1?'día':'días'}</div>
                    </>
                ),
                sortValue: (row) => -diasVencidos(row.fecha_vencimiento),
                searchValue: (row) => `${-diasVencidos(row.fecha_vencimiento)} ${row.label_programa?.trim()} ${row.n_plan?.trim()}`,
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
    ], [tipo, uid_modulo])
    return (
        <div>
            <DataTableSimple2 columns={columns} data={data} rowClassName={claseFila} defaultSort={{ id: 1, dir: tipo === 'activo' ? 'asc' : 'desc' }}
                onFilasVisibles={onFilasVisibles} />
        </div>
    )
}
