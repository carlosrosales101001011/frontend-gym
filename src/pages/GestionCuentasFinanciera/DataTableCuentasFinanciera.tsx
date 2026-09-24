import { useCuentasFinancieraStore } from "@/pages/GestionCuentasFinanciera/useCuentasFinancieraStore";
import type { CuentaFinancieraProps } from "@/pages/GestionCuentasFinanciera/store/cuentasFinancieraSlice";
import { useAppSelector } from "@/stores/Store";
import IconCR from "@/components/Icons/IconCR";
import { NumberFormatMoney } from "@/components/Formats/NumberFormat";
import { DataTableTest } from "@/components/DataTableTest/DataTableTest";

export const DataTableCuentasFinanciera = ({ onOpenModalCustom, otrosBotones }: { onOpenModalCustom: (id:number) => void; otrosBotones?: React.ReactNode }) => {
  const {  remove } = useCuentasFinancieraStore();
  const val = useAppSelector((state)=>state.CUENTAS_FINANCIERAS.cuentasFinancieras)
  
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
              render:(row:CuentaFinancieraProps)=>{
                  return (
                      <div className="d-flex">
                          {row.id}
                      </div>
                  )
              }
          },
          {
              header: 'Tipo de cuenta',
              id: 1,
              sortable: false,
              render:(row:CuentaFinancieraProps)=>{
                  return (
                      <div className="d-flex">
                          {row.label_tipo_cuenta}
                      </div>
                  )
              }
          },
          {
              header: 'Banco',
              id: 2,
              sortable: false,
              render:(row:CuentaFinancieraProps)=>{
                  return (
                      <div className="d-flex">
                          {row.label_banco}
                      </div>
                  )
              }
          },
          {
              header: 'Número de cuenta',
              id: 3,
              sortable: false,
              render:(row:CuentaFinancieraProps)=>{
                  return (
                      <div className="d-flex">
                          {row.n_cuenta}
                      </div>
                  )
              }
          },
          {
              header: 'CCI',
              id: 4,
              sortable: false,
              render:(row:CuentaFinancieraProps)=>{
                  return (
                      <div className="d-flex">
                          {row.cci}
                      </div>
                  )
              }
          },
          {
              header: 'Titular',
              id: 5,
              sortable: false,
              render:(row:CuentaFinancieraProps)=>{
                  return (
                      <div className="d-flex">
                          {row.titular}
                      </div>
                  )
              }
          },
          {
              header: 'Saldo inicial',
              id: 6,
              sortable: false,
              render:(row:CuentaFinancieraProps)=>{
                  return (
                      <div className="d-flex">
                        <NumberFormatMoney value={row.saldo_inicial}/>
                      </div>
                  )
              }
          },
          {
              header: 'Código de moneda',
              id: 7,
              sortable: false,
              render:(row:CuentaFinancieraProps)=>{
                  return (
                      <div className="d-flex">
                          {row.label_codigo_moneda}
                      </div>
                  )
              }
          },
          {
              header: 'Descripción',
              id: 8,
              sortable: false,
              render:(row:CuentaFinancieraProps)=>{
                  return (
                      <div className="d-flex">
                          {row.descripcion}
                      </div>
                  )
              }
          },
          {
              header: 'Saldo actual',
              id: 9,
              sortable: false,
              render:(row:CuentaFinancieraProps)=>{
                  return (
                      <div className="d-flex">
                        <NumberFormatMoney value={row.saldo_actual}/>
                      </div>
                  )
              }
          },
          {
              header: '',
              id: 10,
              sortable: false,
              render:(row:CuentaFinancieraProps)=>{
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
            persistKey='term'
            mostrarFlechas
            classNameTablePagination='sticky-bottom-1'
            classNameToolBar="sticky-top-1"
      columns={columns} data={val}/>
    </div>
  )
}
