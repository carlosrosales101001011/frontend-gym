import { Link } from 'react-router-dom';
import type { UserProps } from '@/pages/GestionUsuarios/store/usuariosSlice';
import { DataTableTest } from '@/components/DataTableTest/DataTableTest';
import { useAppSelector } from '@/stores/Store';

type Props ={
    otrosBotones: React.ReactNode;
}
export const DataTableView = ({ otrosBotones}:Props) => {
    const [, uid_modulo, ] = location.pathname.split('/');
    const { users } = useAppSelector((state)=>state.USER)
    const columns = [
        {
            header: 'Id',
            id: 0,
            sortable: false,
            render: (row:UserProps)=>{
                return (
                <>
                {row.id}
                </>
            )
            }
        },
        {header: 'Nombres y Apellidos',id: 1,  render: (row:UserProps)=>{
            return (
                <>
                {row.nombres} {row.apellidos}
                </>
            )
        }},
        {header: 'Correo electronico',id: 2,  render: (row:UserProps)=>{
            return (
                <>
                {row.email}
                </>
            )
        }},
        {header: 'Correo corporativo',id: 3,  render: (row:UserProps)=>{
            return (
                <>
                {row.email_corporativo}
                </>
            )
        }},
        {header: 'Creado por',id: 5,  render: (row:UserProps)=>{
            return (
                <>
                {row.id_userParent}
                </>
            )
        }},
        {header: 'Fecha creado',id: 6,  render: (row:UserProps)=>{
            return (
                <>
                {row.fecha_creacion}
                </>
            )
        }},
        {header: 'Estado',id: 4, widthEditable: true, render: (row:UserProps)=>{
            return (
                <>
                {row.id_estado === 1 ? 'Activo' : 'Inactivo'}
                </>
            )
        }},
        {header: '', widthEditable: true,
            sortable: false, id: 7, render: (row:UserProps)=>{
            return (
                <div>
                    <Link to={`/${uid_modulo}/perfil-usuario/${row.uuid}`} className='text-info' style={{cursor: 'pointer'}}>
                        Ver perfil
                    </Link>
                </div>
            )
        }},
    ]
  return (
    <div>
            <DataTableTest congelarColumnas
            permitirOcultarColumnas
            permitirReordenarColumnas
            persistKey='term'
            mostrarFlechas
            classNameTablePagination='sticky-bottom-1'
            classNameToolBar="sticky-top-1"
            otrosBotones={
                otrosBotones
            }  data={users} columns={columns}/>
    </div>
  )
}
