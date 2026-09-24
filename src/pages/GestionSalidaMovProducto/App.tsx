import { useEffect, useState } from "react"
import { Col, ListGroup, Row } from "react-bootstrap"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import type { isOpenModalCustom } from "@/types/props"
import { useQueryParams } from "@/hook/useQueryParams"
import { querys } from "@/types/parametros"
import { ModalCustomMovProductos } from "@/pages/GestionSalidaMovProducto/ModalCustomMovProductos"
import { DataTableMovProductos } from "@/pages/GestionSalidaMovProducto/DataTableMovProductos"
import { useMovProductoStore } from "@/pages/GestionSalidaMovProducto/useMovProductoStore"
import { useAlmacenStore } from "@/pages/GestionAlmacen/useAlmacenStore"
import { useAppDispatch, useAppSelector } from "@/stores/Store"
import { onSetDataMovProductos, type MovProductoProps } from "@/pages/GestionSalidaMovProducto/store/movProductoSlice"
import { ButtonCR } from "@/components/Button/ButtonCR"
import IconCR from "@/components/Icons/IconCR"

export const App = () => {
    const dispatch = useAppDispatch()
    const { searcher, obtenerOpSucursales } = useMovProductoStore()
    const { obtener: obtenerAlmacenes } = useAlmacenStore()
    const { opcionesSucursales } = useAppSelector((state) => state.MOVPRODUCTO)
    const { almacenes } = useAppSelector((state) => state.ALMACEN)

    const TODOS = 0

    const [selectedSucursal, setSelectedSucursal] = useState<number | null>(null)
    const [selectedAlmacen, setSelectedAlmacen] = useState<number | null>(null)
    const [allMovProductos, setAllMovProductos] = useState<MovProductoProps[]>([])

  const [isOpenModalCustom, setisOpenModalCustom] = useState<isOpenModalCustom>({id: 0, isCopy: false,  isOpen: false})
  const onCloseModalCustomProducto = ()=>{
      setisOpenModalCustom({id:0, isCopy: false, isOpen: false})
  }
  const onOpenModalCustomProducto = (id:number)=>{
      setisOpenModalCustom({id, isCopy: false, isOpen: true})
  }

    const {  get } = useQueryParams();
    const querySearch = (get(querys.search)||'')
    const page = Number(get(querys.page))
    const show = Number(get(querys.show))

    useEffect(() => {
      obtenerOpSucursales()
      obtenerAlmacenes()
    }, [])

    useEffect(() => {
      const ctrl = new AbortController();
      searcher(ctrl.signal).then((data) => {
        setAllMovProductos(data.items || [])
      }).catch(e => {
        if (e.name !== 'CanceledError') console.error(e);
      });
      return () => ctrl.abort();
    }, [querySearch, page, show])

    const seleccionCompleta = selectedSucursal !== null && selectedAlmacen !== null

    useEffect(() => {
      let filtrados = allMovProductos
      if (seleccionCompleta) {
        if (selectedSucursal !== TODOS) {
          filtrados = filtrados.filter((mov) => mov.id_sucursal_destino === selectedSucursal)
        }
        if (selectedAlmacen !== TODOS) {
          filtrados = filtrados.filter((mov) => mov.id_almacen_destino === selectedAlmacen)
        }
      } else {
        filtrados = []
      }
      dispatch(onSetDataMovProductos(filtrados))
    }, [allMovProductos, selectedSucursal, selectedAlmacen])

    const onSelectSucursal = (id: number) => {
      setSelectedSucursal(id)
      setSelectedAlmacen(null)
    }

    const almacenesSucursal = selectedSucursal === null
      ? []
      : selectedSucursal === TODOS
        ? almacenes
        : almacenes.filter((almacen) => almacen.id_sucursal === selectedSucursal)

  return (
    <div>
      <PageBreadCumb title={'Gestion de productos'}/>
          <ModalCustomMovProductos id={isOpenModalCustom.id} onHide={onCloseModalCustomProducto} show={isOpenModalCustom.isOpen} />
          <Row>
              <Col lg={2}>
                  <h6>Sucursales</h6>
                  <ListGroup>
                      <ListGroup.Item
                          action
                          active={selectedSucursal === TODOS}
                          onClick={() => onSelectSucursal(TODOS)}
                      >
                          Todos
                      </ListGroup.Item>
                      {opcionesSucursales.map((sucursal) => (
                          <ListGroup.Item
                              key={sucursal.value}
                              action
                              active={selectedSucursal === Number(sucursal.value)}
                              onClick={() => onSelectSucursal(Number(sucursal.value))}
                          >
                              {sucursal.label}
                          </ListGroup.Item>
                      ))}
                  </ListGroup>
              </Col>
              <Col lg={2}>
                  <h6>Almacenes</h6>
                  <ListGroup>
                      {selectedSucursal !== null && (
                          <ListGroup.Item
                              action
                              active={selectedAlmacen === TODOS}
                              onClick={() => setSelectedAlmacen(TODOS)}
                          >
                              Todos
                          </ListGroup.Item>
                      )}
                      {almacenesSucursal.map((almacen) => (
                          <ListGroup.Item
                              key={almacen.id}
                              action
                              active={selectedAlmacen === almacen.id}
                              onClick={() => setSelectedAlmacen(almacen.id)}
                          >
                              {almacen.nombre}
                          </ListGroup.Item>
                      ))}
                      {selectedSucursal !== null && almacenesSucursal.length === 0 && (
                          <ListGroup.Item disabled>Sin almacenes</ListGroup.Item>
                      )}
                  </ListGroup>
              </Col>
              <Col lg={8}>
                  {seleccionCompleta ? (
                      <DataTableMovProductos 
                      otrosBotones={
                          <ButtonCR label={'Agregar Entrada'} onClick={()=>onOpenModalCustomProducto(0)} icon={<IconCR name='plus' size={14}/>}/>
                      } onOpenModalCustom={onOpenModalCustomProducto} />
                  ) : (
                      <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                          Debes de seleccionar la sucursal y el almacen
                      </div>
                  )}
              </Col>
          </Row>
    </div>
  )
}
