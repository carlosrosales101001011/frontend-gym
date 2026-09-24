import { useEffect } from 'react'
import { useAppSelector } from '@/stores/Store'
import type { EgresosProps } from '@/pages/GestionEgresos/store/egresosSlice';
import { NumberFormatMoney } from '@/components/Formats/NumberFormat';
import { useEgresosStore } from '@/pages/GestionEgresos/useEgresosStore';
import IconCR from '@/components/Icons/IconCR';
import { DataTableTest } from '@/components/DataTableTest/DataTableTest';
type Props = {
    onOpenModalCustomEgreso: (id:number)=>void;
    otrosBotones: React.ReactNode;
}
export const DataTableEgreso = ({ onOpenModalCustomEgreso, otrosBotones }:Props) => {
    const val = useAppSelector((state)=>state.EGRESO.egresos)
    const { obtenerGastos, deleteGastos } = useEgresosStore()
    useEffect(() => {
        obtenerGastos()
    }, [])
    const columns=[
        {
            header: 'Id',
            id: 0,
            sortable: false,
            render:(row:EgresosProps)=>{
                return (
                    <div className="d-flex">
                        {row.id}
                    </div>
                )
            }
        },
        {
            header: 'N° de comprobante',
            id: 1,
            sortable: false,
            render:(row:EgresosProps)=>{
                return (
                    <div className="d-flex">
                        {row.n_comprobante}
                    </div>
                )
            }
        },
        {
            header: 'Tipo de comprobante',
            id: 2,
            sortable: false,
            render:(row:EgresosProps)=>{
                return (
                    <div className="d-flex">
                        {row.tipoComprobante?.valor||''}
                    </div>
                )
            }
        },
        {
            header: 'Fecha de comprobante',
            id: 3,
            sortable: false,
            render:(row:EgresosProps)=>{
                return (
                    <div className="d-flex">
                        {row.fecha_comprobante}
                    </div>
                )
            }
        },
        {
            header: 'Moneda',
            id: 4,
            sortable: false,
            render:()=>{
                return (
                    <div className="d-flex">
                        
                    </div>
                )
            }
        },
        {
            header: 'Monto Detalle',
            id: 5,
            sortable: false,
            widthEditable: true,
            render:(row:EgresosProps)=>{
                return (
                    <div className="d-flex">
                        <NumberFormatMoney value={row.monto_detalle}/>
                    </div>
                )
            }
        },
        {
            header: 'Monto Pagado',
            id: 6,
            sortable: false,
            widthEditable: true,
            render:(row:EgresosProps)=>{
                return (
                    <div className="d-flex">
                        <NumberFormatMoney value={row.monto_pagos}/>
                    </div>
                )
            }
        },
        {
            header: 'Estado',
            id: 7,
            sortable: false,
            render:(row:EgresosProps)=>{
                return (
                    <div className="d-flex">
                        <NumberFormatMoney value={row.monto_pagos}/>
                    </div>
                )
            }
        },
        {
            header: 'Observacion',
            id: 8,
            sortable: false,
            widthEditable: true,
            render:(row:EgresosProps)=>{
                return (
                    <div className="d-flex">
                        {row.observacion}
                    </div>
                )
            },
        },
        {
            header: 'Action',
            id: 9,
            sortable: false,
            render:(row:EgresosProps)=>{
                return (
                    <div className="d-flex">
                        <div onClick={()=>onEdit(row.id)}  style={{width: '28px', height: '28px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'}} className="cursor-pointer me-2 bg-primary">
                            <IconCR name="edit" size={14}/>
                        </div>
                        <div onClick={()=>onDelete(row.id)} className='bg-danger cursor-pointer' style={{width: '28px', height: '28px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'}}>
                            <IconCR name="delete" size={14}/>
                        </div>
                    </div>
                )
            },
        }
    ]
    const onDelete = (id:number)=>{
        console.log({id});
        deleteGastos(id)
    }
    const onEdit = (id:number)=>{
        console.log({id});
        onOpenModalCustomEgreso(id)
    }
  return (
    <div className='m-2'>
        <DataTableTest
            congelarColumnas
            permitirOcultarColumnas
            permitirReordenarColumnas
            persistKey='term'
            mostrarFlechas
            classNameTablePagination='sticky-bottom-1'
            classNameToolBar="sticky-top-1"
            otrosBotones={
                otrosBotones
            }
            columns={columns} 
            data={val} 
         />
    </div>
  )
}
