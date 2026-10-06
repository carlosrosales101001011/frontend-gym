import { DataTableTest } from "@/components/DataTableTest/DataTableTest"
import { useAppSelector } from "@/stores/Store"
import type { DataVentaProps } from "./store/dataVentaSlice"
import { useEffect, useState } from "react"
import { useVentasStore } from "./useVentasStore"
import { querys } from "@/types/parametros"
import { useQueryParams } from "@/hook/useQueryParams"
import { ModalInfoVentas } from "./ModalInfoVentas"
import { getFormatMoney } from "@/helpers/getNumbers"
import { capitalizeWords } from "@/helpers/strings"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { formatDate } from "@/helpers/FormatDate"

export const DataTableVentas = () => {
    const { obtenerVentas } = useVentasStore()
    const { dataVentas } = useAppSelector(e=>e.DATAVENTAS)
    const [isOpenModalInfoVentas, setisOpenModalInfoVentas] = useState({id: 0, show: false})
    const {  get } = useQueryParams();
    const querySearch = (get(querys.search)||'')
    const queryColumnas = get(querys.columnas)
    const page = Number(get(querys.page))
    const show = Number(get(querys.show))
    const onOpenModalInfoVentas = (id:number)=>{
        setisOpenModalInfoVentas({show: true, id})
    }
    const onCloseModalInfoVentas = ()=>{
        setisOpenModalInfoVentas({show: false, id: 0})
    }
    useEffect(() => {
        const ctrl = new AbortController();
        obtenerVentas(ctrl.signal).catch(e => {
        if (e.name !== 'CanceledError') console.error(e);
        });
        return () => ctrl.abort();
    }, [querySearch, queryColumnas, page, show])
    
        const columns = [
            {
                id: 0,
                header: 'ID',
                render: (rowData: DataVentaProps) => <span>{rowData.id}</span>,
            },
            {
                id: 10,
                header: 'Fecha de registro',
                render: (rowData: DataVentaProps) => <span>{rowData.fecha_venta ? formatDate(new Date(rowData.fecha_venta), 'yyyy-mm-dd', 'd MMMM yyyy') : ''}</span>,
            },
            {
                id: 1,
                header: <div style={{width: '150px'}}>Nombres y apellidos<br/> del Asesor / Vendedor</div>, campoBusqueda: 'label_nombres_apellidos_empl',
                render: (rowData: DataVentaProps) => <span className="">{capitalizeWords(rowData.label_nombres_apellidos_empl)}</span>,
            },
            {
                id: 2,
                header: <>Nombres y apellidos<br/> del Cliente</>, campoBusqueda: 'label_nombres_apellidos_cli',
                render: (rowData: DataVentaProps) => <span>{capitalizeWords(rowData.label_nombres_apellidos_cli)}</span>,
            },
            {
                id: 3,
                header: 'Origen', campoBusqueda: 'label_origen',
                render: (rowData: DataVentaProps) => <span>{rowData.label_origen}</span>,
            },
            {
                id: 4,
                header: 'Tipo de comprobante', campoBusqueda: 'label_tipo_comprobante',
                render: (rowData: DataVentaProps) => <span>{rowData.label_tipo_comprobante}</span>,
            },
            {
                id: 5,
                header: 'N° de comprobante', campoBusqueda: 'n_comprobante',
                render: (rowData: DataVentaProps) => <span>{rowData.n_comprobante}</span>,
            },
            {
                id: 6,
                header: 'Monto total',
                render: (rowData: DataVentaProps) => <span>{getFormatMoney(rowData.montoTotal_membresia+rowData.montoTotal_productos)}</span>,
            },
            {
                id: 7,
                header: 'Monto pagado',
                render: (rowData: DataVentaProps) => <span>{getFormatMoney(rowData.montoPagos)}</span>,
            },
            {
                id: 8,
                header: 'Observacion', campoBusqueda: 'observacion',
                render: (rowData: DataVentaProps) => <span>{rowData.observacion}</span>,
            },
            {
                id: 9,
                header: '',
                render: (rowData: DataVentaProps) => <span className="btn btn-primary" onClick={()=>onOpenModalInfoVentas(rowData.id)}>Ver detalle</span>,
            },
        ]
  return (
    <div>
        <PageBreadCumb title="Ventas"/>
        <DataTableTest  columns={columns} data={dataVentas}/>
        <ModalInfoVentas onHide={onCloseModalInfoVentas} id={isOpenModalInfoVentas.id} show={isOpenModalInfoVentas.show} onCambio={() => obtenerVentas().catch(console.error)} />
    </div>
  )
}
