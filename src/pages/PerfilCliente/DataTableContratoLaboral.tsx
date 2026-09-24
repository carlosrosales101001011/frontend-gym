import { useSelector } from 'react-redux'
import DataTableCR from '@/components/DataTable/DataTableCR'
import type { RootState } from '@/stores/Store'
import IconCR from '@/components/Icons/IconCR'
import { useState } from 'react'
import { ModalContratoEmpleado } from '@/pages/PerfilCliente/ModalContratoEmpleado'
import type { ContratoColaboradorProps } from '@/pages/PerfilColaborador/store/contratoColaboradorSlice'

export const DataTableContratoLaboral = () => {
  const {contratosColaborador} = useSelector((state: RootState)=>state.CONTRATO_COLABORADOR)
  const [isOpenModalVistaContrato, setisOpenModalVistaContrato] = useState({idContrato: 0, isOpen: false})
    const columns = [
                {id: 1, header: 'id', render: (row:ContratoColaboradorProps)=>{
                    return (
                        <>
                        {row.id}
                        </>
                    )
                }},
                {id: 2, header: 'Cargo', render: (row:ContratoColaboradorProps)=>{
                    return (
                        <>
                        {row.id_cargo}
                        </>
                    )
                }},
                {id: 3, header: 'Departamento', render: (row:ContratoColaboradorProps)=>{
                    return (
                        <>
                        {row.id_departamento}
                        </>
                    )
                }},
                {id: 4, header: 'Fecha de ingreso', render: (row:ContratoColaboradorProps)=>{
                    return (
                        <>
                        {row.fecha_inicio}
                        </>
                    )
                }},
                {id: 5, header: 'Fecha de cese', render: (row:ContratoColaboradorProps)=>{
                    return (
                        <>
                        {row.fecha_fin}
                        </>
                    )
                }},
                {id: 6, header: 'Estado', render: (row:ContratoColaboradorProps)=>{
                    return (
                        <>
                        {row.id_estado}
                        </>
                    )
                }},
                {id: 7, header: 'Sueldo', render: (row:ContratoColaboradorProps)=>{
                    return (
                        <>
                        {row.id_moneda} {row.sueldo}
                        </>
                    )
                }},
                {id: 8, header: '', render: (row:ContratoColaboradorProps)=>{
                    return (
                        <>
                        <div  className='d-flex justify-content-center' onClick={()=>onClickVerContrato(row.id)} style={{cursor: 'pointer'}}>
                            <div>
                                <IconCR name='eye' size={15}/>
                            </div>
                        </div>
                        </>
                    )
                }},
            ]
    const onClickVerContrato = (idContrato:number)=>{
        setisOpenModalVistaContrato({idContrato, isOpen: true})
    }
    const onCloseVerContrato = ()=>{
        setisOpenModalVistaContrato({idContrato: 0, isOpen: false})
    }
  return (
    <div>
        <DataTableCR
        data={contratosColaborador}
        columns={columns}
        totalPages={1}
        countTotal={1}
        />
        <ModalContratoEmpleado show={isOpenModalVistaContrato.isOpen} id={isOpenModalVistaContrato.idContrato} onHide={onCloseVerContrato}/>
    </div>
  )
}
