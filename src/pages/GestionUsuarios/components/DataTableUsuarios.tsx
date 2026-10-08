import { useState } from 'react';
import { Link } from 'react-router-dom';
import IconCR from '@/components/Icons/IconCR';
import { ButtonCR } from '@/components/Button/ButtonCR';
import { ModalAsignarPassword } from './ModalAsignarPassword';
import { ModalDetalleUsuario } from './ModalDetalleUsuario';
import { BadgeEstado } from '@/components/Badge/BadgeEstado';
import { ID_ESTADO_ACTIVO, type UserProps } from '../store/usuariosSlice';
import { DataTableTest } from '@/components/DataTableTest/DataTableTest';
import { useAppSelector } from '@/stores/Store';
// import { useGestionUsuariosStore } from '../hook/useGestionUsuariosStore';

type Props ={
    otrosBotones: React.ReactNode;
}
export const DataTableUsuarios = ({ otrosBotones}:Props) => {
    const [, uid_modulo, ] = location.pathname.split('/');
    const { users } = useAppSelector((state)=>state.USER)
    // const { usuario: usuarioSesion } = useAppSelector((state)=>state.SESION)
    // const { eliminarUsuario } = useGestionUsuariosStore()
    // Usuario al que se le cambia la contraseña (null = modal cerrado)
    const [usuarioPassword, setUsuarioPassword] = useState<{ id: number, nombre: string } | null>(null)
    // Usuario cuyo detalle se ve (null = modal cerrado)
    const [usuarioDetalle, setUsuarioDetalle] = useState<UserProps | null>(null)
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
        {header: 'Nombres y Apellidos', campoBusqueda: ['nombres', 'apellidos'],id: 1,  render: (row:UserProps)=>{
            return (
                <>
                {row.nombres} {row.apellidos}
                </>
            )
        }},
        {header: 'Correo electronico', campoBusqueda: 'email',id: 2,  render: (row:UserProps)=>{
            return (
                <>
                {row.email}
                </>
            )
        }},
        {header: 'Correo corporativo', campoBusqueda: 'email_corporativo',id: 3,  render: (row:UserProps)=>{
            return (
                <>
                {row.email_corporativo}
                </>
            )
        }},
        {header: 'Creado por', campoBusqueda: 'label_nombres_apellidos_userParent', id: 4,  render: (row:UserProps)=>{
            return (
                <>
                {row.label_nombres_apellidos_userParent || <span className="opacity-50">—</span>}
                </>
            )
        }},
        {header: 'Fecha creado',id: 5,  render: (row:UserProps)=>{
            return (
                <>
                {row.fecha_creacion}
                </>
            )
        }},
        {header: 'Estado',id: 6, widthEditable: true, render: (row:UserProps)=>{
            return <BadgeEstado activo={row.id_estado === ID_ESTADO_ACTIVO} />
        }},
        // {header: 'Ver', id: 7, sortable: false, render: (row:UserProps)=>{
        //     return (
        //         <ButtonCR
        //             label='Ver'
        //             icon={<IconCR name='eye' size={12} className='' />}
        //             variant='outline-primary'
        //             className='btn-sm'
        //             onClick={() => setUsuarioDetalle(row)}
        //         />
        //     )
        // }},
        {header: 'Cambiar contraseña', id: 8, render: (row:UserProps)=>{
            return (
                <ButtonCR
                    label='Cambiar'
                    icon={<IconCR name='lock' size={12} className='' />}
                    variant='outline-primary'
                    className='btn-sm'
                    onClick={() => setUsuarioPassword({ id: row.id ?? 0, nombre: `${row.nombres} ${row.apellidos}`.trim() })}
                />
            )
        }},
        {header: '', widthEditable: true,
            sortable: false, id: 9, render: (row:UserProps)=>{
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
            {usuarioDetalle && <ModalDetalleUsuario usuario={usuarioDetalle} onHide={() => setUsuarioDetalle(null)} />}
            {usuarioPassword && <ModalAsignarPassword usuario={usuarioPassword} onHide={() => setUsuarioPassword(null)} />}
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
