import React, { useEffect } from 'react'
import { Badge, Card, Tab, Tabs } from 'react-bootstrap'
import { useVentascliStore } from '../hook/useVentascliStore'
import { DataTableSimple } from '@/components/DataTableSimple/DataTableSimple'
import type { DataVentaProps } from '../store/ventaSlice'

export const CardHistorialVentas = ({nombreCliente, id_cli}: {nombreCliente:string, id_cli:number}) => {
  const { obtenerVentasxIdCli, dataVentas } = useVentascliStore(id_cli)
  useEffect(() => {
    obtenerVentasxIdCli()
  }, [id_cli])
  
          const columns = [
              {
                  id: 0,
                  header: 'ID',
                  render: (rowData: DataVentaProps) => <span>{rowData.id}</span>,
              },
              {
                  id: 1,
                  header: <>Nombres y apellidos<br/> del Asesor / Vendedor</>,
                  render: (rowData: DataVentaProps) => <span>{rowData.label_nombres_apellidos_empl}</span>,
              },
              {
                  id: 2,
                  header: <>Nombres y apellidos<br/> del Cliente</>,
                  render: (rowData: DataVentaProps) => <span>{rowData.label_nombres_apellidos_cli}</span>,
              },
              {
                  id: 3,
                  header: 'Origen',
                  render: (rowData: DataVentaProps) => <span>{rowData.label_origen}</span>,
              },
              {
                  id: 4,
                  header: 'Tipo de comprobante',
                  render: (rowData: DataVentaProps) => <span>{rowData.label_tipo_comprobante}</span>,
              },
              {
                  id: 5,
                  header: 'N° de comprobante',
                  render: (rowData: DataVentaProps) => <span>{rowData.n_comprobante}</span>,
              },
              {
                  id: 6,
                  header: 'Monto Total',
                  render: (rowData: DataVentaProps) => <span>{rowData.montoTotal_membresia+rowData.montoTotal_productos}</span>,
              },
              {
                  id: 7,
                  header: 'Monto Pagado',
                  render: (rowData: DataVentaProps) => <span>{rowData.montoPagos}</span>,
              },
              {
                  id: 8,
                  header: 'Estado',
                  render: (rowData: DataVentaProps) => {

                    return (
                        <span>{rowData.montoPagos===(rowData.montoTotal_membresia+rowData.montoTotal_productos)?<Badge className='bg-success'>Pagado</Badge>:<Badge className='bg-danger'>Falta pagar</Badge>}</span>
                    )
                  },
              },
              {
                  id: 9,
                  header: '',
                  render: () => <span className='text-decoration-underline text-danger cursor-pointer'>Repetir Venta</span>,
              },
          ]
  return (
    <Card className='card-mode-actual'>
    <Card.Header>
        <Card.Title className='fs-4'>
            Ventas anteriores del cliente
        </Card.Title>
        Historial de compras realizadas por <span className='fw-bold' style={{fontSize: '15px'}}>{nombreCliente}</span>
    </Card.Header>
    <Card.Body>
        <Tabs>
            <Tab eventKey={'ventas'} title={'Ventas'}>
                <DataTableSimple
                    columns={columns}
                    data={dataVentas}
                />
            </Tab>
            <Tab eventKey={'membresias'} title={'Membresias'}>

            </Tab>
            <Tab eventKey={'productos'} title={'Productos'}>

            </Tab>
        </Tabs>
    </Card.Body>
    </Card>
  )
}
