import { useAppSelector } from "@/stores/Store";
import type { TCProps } from "@/pages/GestionTipoCambio/store/tipoCambioSlice";
import { useTCStore } from "@/pages/GestionTipoCambio/useTCStore";
import IconCR from "@/components/Icons/IconCR";
import { DataTableTest } from "@/components/DataTableTest/DataTableTest";

type Props = {
  onOpenModalCustom: (id: number) => void;
  otrosBotones: React.ReactNode;
}

export const DataTableTC = ({ onOpenModalCustom, otrosBotones}: Props) => {
  const val = useAppSelector((state)=>state.TC.tcs)
  const { remove } = useTCStore()
  const onEdit = (id:number)=>{
    onOpenModalCustom(id)
  }
  const onDelete = (id:number)=>{
    remove(id)
  }
      const columns=[
          {
              header: 'Id',
              id: 0,
              sortable: false,
              render:(row:TCProps)=>{
                  return (
                      <div className="d-flex">
                          {row.id}
                      </div>
                  )
              }
          },
          {
              header: 'Moneda Origen',
              id: 1,
              sortable: false,
              render:(row:TCProps)=>{
                  return (
                      <div className="d-flex">
                          {row.label_codigo_monedaOrigen}
                      </div>
                  )
              }
          },
          {
              header: 'Moneda Destino',
              id: 2,
              sortable: false,
              render:(row:TCProps)=>{
                  return (
                      <div className="d-flex">
                          {row.label_codigo_monedaDestino}
                      </div>
                  )
              }
          },
          {
              header: 'Fecha',
              id: 3,
              sortable: false,
              render:(row:TCProps)=>{
                  return (
                      <div className="d-flex">
                          {row.fecha}
                      </div>
                  )
              }
          },
          {
              header: 'Venta',
              id: 4,
              sortable: false,
              render:(row:TCProps)=>{
                  return (
                      <div className="d-flex">
                          {row.venta}
                      </div>
                  )
              }
          },
          {
              header: 'Compra',
              id: 5,
              sortable: false,
              render:(row:TCProps)=>{
                  return (
                      <div className="d-flex">
                          {row.compra}
                      </div>
                  )
              }
          },
          {
              header: '',
              id: 6,
              sortable: false,
              render:(row:TCProps)=>{
                  return (
                        <div className="d-flex">
                            <div onClick={()=>onEdit(row.id)} className="cursor-pointer me-2">
                                <IconCR name="edit" size={14}/>
                            </div>
                            <div onClick={()=>onDelete(row.id)} className="cursor-pointer">
                                <IconCR name="delete" size={14}/>
                            </div>
                        </div>
                  )
              }
          }
      ]
  return (
    <div>
      <DataTableTest
        otrosBotones={otrosBotones}
        congelarColumnas
        permitirOcultarColumnas
        permitirReordenarColumnas
        persistKey='tc'
        mostrarFlechas
        classNameTablePagination='sticky-bottom-1'
        classNameToolBar="sticky-top-1"
       columns={columns} data={val}/>
    </div>
  )
}
