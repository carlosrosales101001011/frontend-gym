import { Badge } from "react-bootstrap";
import { useAppSelector } from "@/stores/Store";
import type { ColaboradorProps } from "@/pages/GestionColaboradores/store/colaboradoresSlice"
import { Link, useLocation } from "react-router-dom";
import { DataTableTest } from "@/components/DataTableTest/DataTableTest";
type Props = {
    otrosBotones?: React.ReactNode
}
export const DataTableColaborador = ({otrosBotones}:Props) => {
    const val = useAppSelector((state)=>state.COLABORADOR.colaboradores)
    const location = useLocation();
    const [, uid_modulo, ] = location.pathname.split('/');
  const columns = [
    {
        header: 'Id',
        id: 0,
        sortable: false,
        render:(row:ColaboradorProps)=>{
            return (
                <div className="d-flex">
                    {row.id}
                </div>
            )
        }
    },
    {
        header: 'Nombres y Apellidos',
        id: 1,
        sortable: false,
        render:(row:ColaboradorProps)=>{
            return (
                <div className="">
                    {row.nombres} {row.apellido_paterno} {row.apellido_materno}
                </div>
            )
        }
    },
    {
        header: 'Email personal',
        id: 2,
        sortable: false,
        render:(row:ColaboradorProps)=>{
            return (
                <>
                    {row.email_personal}
                </>
            )
        }
    },
    {
        header: 'Email corporativo',
        id: 3,
        sortable: false,
        render:(row:ColaboradorProps)=>{
            return (
                <>
                    {row.email_corporativo}
                </>
            )
        }
    },
    {
        header: 'Telefono principal',
        id: 4,
        sortable: false,
        render:(row:ColaboradorProps)=>{
            return (
                <>
                    {row.telefono}
                </>
            )
        }
    },
    {
        header: 'Estado',
        id: 5,
        sortable: false,
        render:()=>{
            return (
                <>
                    <Badge className="p-2 fs-6 bg-success">Activo</Badge>
                </>
            )
        }
    },
    {
        header: '',
        widthEditable: true,
        id: 6,
        sortable: false,
        render:(row:ColaboradorProps)=>{
            return (
                <>
                    <Link to={`/${uid_modulo}/perfil-colaborador/${row.uid}`} className="fw-bold px-2" >Ver perfil</Link>
                </>
            )
        }
    },
  ]
  return (
    <div>
        <DataTableTest 
        
            congelarColumnas
            permitirOcultarColumnas
            permitirReordenarColumnas
            persistKey='term'
            mostrarFlechas
            classNameTablePagination='sticky-bottom-1'
            classNameToolBar="sticky-top-1"
            otrosBotones={otrosBotones}
        columns={columns} data={val}/>
    </div>
  )
}
