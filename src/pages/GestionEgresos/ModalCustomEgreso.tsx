import { useEffect } from 'react'
import type { modalCustom } from '@/types/props'
import ModalCR from '@/components/Modal/ModalCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { useForm } from '@/hook/useForm'
import type { EgresosProps } from '@/pages/GestionEgresos/store/egresosSlice'
import { initialStateEgreso } from '@/pages/GestionEgresos/store/egresosSlice'
import { Col, Row, Tab, Tabs } from 'react-bootstrap'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { AppDetalleGasto } from '@/pages/GestionEgresos/DetalleEgreso/AppDetalleGasto'
import { useDispatch, useSelector } from 'react-redux'
import { addEgreso } from '@/pages/GestionEgresos/store/egresosSlice'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { AppDetalleGastoPago } from '@/pages/GestionEgresos/DetallePago/AppDetalleGastoPago'
import { useEgresosStore } from '@/pages/GestionEgresos/useEgresosStore'
import type { RootState } from '@/stores/Store'
import { onResetDataDetalleEgresos, type DetalleEgresoProps } from '@/pages/GestionEgresos/DetalleEgreso/store/detalleEgresoSlice'
import { onResetDataDetallesGastoPago, type DetallePagoProps } from '@/pages/GestionEgresos/DetallePago/store/detallePagoSlice'

export const ModalCustomEgreso = ({ id, onHide, show }: modalCustom) => {
  const dispatch = useDispatch()
  const { postEgreso, obtenerOpProveedores, obtenerxID, dataxID } = useEgresosStore()
  const { detallesEgreso } = useSelector((state: RootState)=>state.DETALLE_EGRESO)
  const { detallesPago } = useSelector((state: RootState)=>state.DETALLE_GASTOPAGO)
  const { opcionesProveedores } = useSelector((state: RootState)=>state.EGRESO)
  const { register, formState: { errors }, getValues, reset} = useForm<EgresosProps>({mode: "onChange",defaultValues: initialStateEgreso.egreso })
  const { data:dataComprobantes, cargar:cargarComprobantes } = useTerminologiaPersona('tipoComprobantes');
  const { data:dataMonedas, cargar:cargarMonedas } = useTerminologiaPersona('codigoOficialMoneda');
  useEffect(() => {
    if (show) {
      cargarComprobantes()
      obtenerOpProveedores()
      cargarMonedas()
    }
  }, [show])
  
  useEffect(() => {
    if (id!==0 && show) {
      obtenerxID(id)
    }else{
      reset(initialStateEgreso.egreso);
    }
  }, [show, id])
  
  useEffect(() => {
    if (dataxID && id !== 0) {
      reset({
        ...dataxID
      });
    }else if (id === 0) {
      reset(initialStateEgreso.egreso);
    }
  }, [dataxID, id]);
  useEffect(() => {
    dispatch(addEgreso(getValues() as EgresosProps))
  }, [getValues()])
  
  const onSubmit = () => {
    const { id, tipoComprobante, ...val } = getValues()
    console.log(id, detallesPago, tipoComprobante);
    postEgreso(val as EgresosProps, detallesEgreso as DetalleEgresoProps[], detallesPago as DetallePagoProps[])
    cancelar()
  }
  const cancelar = ()=>{
    onHide()
    dispatch(onResetDataDetalleEgresos())
    dispatch(onResetDataDetallesGastoPago())
  }
  return (
    <ModalCR onHide={cancelar} show={show} position='right' size='xl'>
        <ModalCR.Header>
            <ModalCR.Title>{id==0 ? 'Agregar egreso' : 'Editar egreso'}</ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            <div>
              <form>
                <Row>
                  <Col lg={4}>
                  <InputSelectCR options={dataComprobantes}  {...register("id_tipo_comprobante", {
                    required: "Este campo es obligatorio"
                  })} label="Tipo de Comprobante" name="id_tipo_comprobante" messageErrors={errors.id_tipo_comprobante?.message}/>
                  </Col>
                  <Col lg={4}>
                    <InputCR {...register("n_comprobante", {
                      required: "El número de comprobante es obligatorio"
                    })} label="Número de Comprobante" name="n_comprobante" messageErrors={errors.n_comprobante?.message}/>
                  </Col>
                  <Col lg={4}>
                    <InputCR {...register("fecha_comprobante", {
                      required: "Este campo es obligatorio"
                    })} label="Fecha de Comprobante" name="fecha_comprobante" type='date' messageErrors={errors.fecha_comprobante?.message}/>
                  </Col>
                  <Col lg={8}>
                    <InputSelectCR options={opcionesProveedores}  {...register("id_proveedor", {
                      required: "Este campo es obligatorio"
                    })} label="Proveedor" name="id_proveedor" messageErrors={errors.id_proveedor?.message}/>
                  </Col>
                  <Col lg={4}>
                    <InputSelectCR options={dataMonedas}  {...register("id_codigo_moneda", {
                      required: "Este campo es obligatorio"
                    })} label="Moneda" name="id_codigo_moneda" messageErrors={errors.id_codigo_moneda?.message}/>
                  </Col>
                </Row>
              </form>
            </div>
            <Tabs 
              defaultActiveKey="detalle-gasto"
              id="uncontrolled-tab-example"
              className="mb-3">
            <Tab eventKey="detalle-gasto" title="Detalle de gasto">
              <AppDetalleGasto/>
            </Tab>
            <Tab eventKey="detalle-pagos" title="Detalle de pagos">
              <AppDetalleGastoPago/>
            </Tab>
            </Tabs>
        </ModalCR.Body>
        <ModalCR.Footer>
            <ButtonCR label={'Guardar Gasto'} onClick={onSubmit}/>
            <ButtonCR label={'Cerrar'} onClick={cancelar}/>
        </ModalCR.Footer>
    </ModalCR>
  )
}
