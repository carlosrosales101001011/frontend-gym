import { BadgeEstado } from "@/components/Badge/BadgeEstado";
import { useAppSelector } from "@/stores/Store";
import type { ClienteProps } from "@/pages/GestionClientes/store/clientesSlice"
// import { useClientesStore } from "@/pages/GestionClientes/useClientesStore";
import { DataTableTest } from "@/components/DataTableTest/DataTableTest";
// import IconCR from "@/components/Icons/IconCR";
import { Link, useLocation } from "react-router-dom";
import { capitalizeWords } from "@/helpers/strings";
import { getBlobUrl } from "@/helpers/blobUrl";
import { AvatarCirculo } from "@/components/Avatar/AvatarCirculo";
import { ajusteAvatarUltimo } from "@/components/Avatar/encuadreFoto";
import { useMemo } from "react";
import { useSeguimientoMembresiaStore } from "@/pages/SeguimientoMembresia/useSeguimientoMembresiaStore";
import { diasVencidos } from "@/helpers/diasMembresia";
import { useClientesStore } from "@/pages/GestionClientes/useClientesStore";
import { BotonFotoCliente } from "@/pages/GestionClientes/components/BotonFotoCliente";

type Props = {
    otrosBotones?: React.ReactNode
    onOpenModalCustom?: (id:number)=>void
}
export const DataTableClientes = ({otrosBotones, onOpenModalCustom}:Props) => {
    const val = useAppSelector((state)=>state.CLIENTE.clientes)
    // Tras subir una foto desde la tabla se vuelve a pedir la página (para ver la foto nueva)
    const { searcher } = useClientesStore()
    const { SeguimientoMembresias } = useSeguimientoMembresiaStore()
    // id del cliente -> su fecha de vencimiento más lejana (si tiene varias membresías)
    const vencimientoxCliente = useMemo(() => {
        const mapa = new Map<number, string>()
        SeguimientoMembresias.forEach((m) => {
            if (!m.id_cli || !m.fecha_vencimiento) return
            const actual = mapa.get(m.id_cli)
            if (!actual || diasVencidos(m.fecha_vencimiento) < diasVencidos(actual)) mapa.set(m.id_cli, m.fecha_vencimiento)
        })
        return mapa
    }, [SeguimientoMembresias])
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
        header: 'Código',
        id: 10,
        campoBusqueda: 'person_code',
        sortable: false,
        render:(row:ClienteProps)=> row.person_code || <span className="opacity-50">—</span>
    },
    {
        header: 'Nombres y Apellidos', campoBusqueda: ['nombres', 'apellido_paterno', 'apellido_materno'],
        id: 1,
        sortable: false,
        render:(row:ClienteProps)=>{
            return (
                <div className="d-flex align-items-center gap-2">
                    <AvatarCirculo
                        src={getBlobUrl(row.url_avatar_ultimo)}
                        alt={row.nombres}
                        ajuste={ajusteAvatarUltimo(row)}
                    />
                    {capitalizeWords(`${row.nombres} ${row.apellido_paterno} ${row.apellido_materno}`)}
                </div>
            )
        }
    },
    {
        header: 'Tipo/N° Documento', campoBusqueda: ['label_tipo_documento', 'numero_documento'],
        id: 2,
        sortable: false,
        render:(row:ClienteProps)=>{
            return (
                <div className="">
                    {row.label_tipo_documento}: {row.numero_documento}
                </div>
            )
        }
    },
    {
        header: 'Email personal', campoBusqueda: 'email_personal',
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
        header: 'Telefono', campoBusqueda: 'telefono',
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
        render:(row:ClienteProps)=>{
            // Activo: hoy <= fecha de vencimiento (igual que en Seguimiento); sin membresía cuenta como inactivo
            const vencimiento = vencimientoxCliente.get(row.id)
            const activo = !!vencimiento && diasVencidos(vencimiento) <= 0
            return <BadgeEstado activo={activo} />
        }
    },
    {
        header: 'Foto',
        id: 9,
        sortable: false,
        render:(row:ClienteProps)=> <BotonFotoCliente cliente={row} onSubida={() => searcher()} />
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
