import { Badge } from "react-bootstrap";
import { useAppSelector } from "@/stores/Store";
import type { ClienteProps } from "@/pages/GestionClientes/store/clientesSlice"
// import { useClientesStore } from "@/pages/GestionClientes/useClientesStore";
import { DataTableTest } from "@/components/DataTableTest/DataTableTest";
// import IconCR from "@/components/Icons/IconCR";
import { Link, useLocation } from "react-router-dom";

type Props = {
    otrosBotones?: React.ReactNode
    onOpenModalCustom?: (id:number)=>void
}
export const DataTableClientes = ({otrosBotones, onOpenModalCustom}:Props) => {
    const val = useAppSelector((state)=>state.CLIENTE.clientes)
    console.log(onOpenModalCustom);
    
    // const { remove } = useClientesStore()
    const location = useLocation();
    const [, uid_modulo, ] = location.pathname.split('/');
    // const onEdit = (id:number)=>{
    //     onOpenModalCustom(id)
    // }
    // const onDelete = (id:number)=>{
    //     remove(id)
    // }
  const columns = [
    {
        header: 'Id',
        id: 0,
        sortable: false,
        render:(row:ClienteProps)=>{
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
        render:(row:ClienteProps)=>{
            return (
                <div className="">
                    {row.nombres} {row.apellido_paterno} {row.apellido_materno}
                </div>
            )
        }
    },
    {
        header: 'Tipo/N° Documento',
        id: 2,
        sortable: false,
        render:(row:ClienteProps)=>{
            return (
                <>
                    {row.label_tipo_documento}
                    <br/>
                    {row.numero_documento}
                </>
            )
        }
    },
    {
        header: 'Email personal',
        id: 3,
        sortable: false,
        render:(row:ClienteProps)=>{
            return (
                <>
                    {row.email_personal}
                </>
            )
        }
    },
    {
        header: 'Telefono',
        id: 4,
        sortable: false,
        render:(row:ClienteProps)=>{
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
        render:(row:ClienteProps)=>{
            return (
                <div className="">
                    <Link to={`/${uid_modulo}/perfil-cliente/${row.uid}`} className="fw-bold px-2" >Ver perfil</Link>
                    {/* <div onClick={()=>onEdit(row.id)} className="cursor-pointer me-2">
                        <IconCR name="edit" size={14}/>
                    </div>
                    <div onClick={()=>onDelete(row.id)} className="cursor-pointer">
                        <IconCR name="delete" size={14}/>
                    </div> */}
                </div>
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
