import { useEffect } from 'react'
import ModalCR from '@/components/Modal/ModalCR'
import { Col, Row } from 'react-bootstrap';
import { InputCR } from '@/components/TextFields/InputCR';
import { useForm } from '@/hook/useForm';
import { initialStateDetalleEgreso, onAddItemDetalleEgresos, type DetalleEgresoProps } from '@/pages/GestionEgresos/DetalleEgreso/store/detalleEgresoSlice';
import { ButtonCR } from '@/components/Button/ButtonCR';
import { useDispatch, useSelector } from 'react-redux';
import { InputSelectCR } from '@/components/TextFields/InputSelectCR';
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore';
import type { RootState } from '@/stores/Store';
import { useEgresosStore } from '@/pages/GestionEgresos/useEgresosStore';

export const ModalCustomDetalleGasto = ({ onHide, show }: { onHide: () => void; show: boolean }) => {
    const { cargar:cargarUnidadMedida, data:dataUnidadMedida } = useTerminologiaPersona('unidadMedida');
    const {  opcionesGruposFinanzas, opcionesConceptosFinanzas } = useSelector((state: RootState)=>state.EGRESO)
    const { obtenerOpGruposFinanzas, obtenerOpConceptosFinanzas } = useEgresosStore()
    const { register, formState: { errors }, getValues, handleSubmit} = useForm<DetalleEgresoProps>({mode: "onChange",defaultValues: initialStateDetalleEgreso })
    const dispatch = useDispatch()
    useEffect(() => {
      if (show) {
        cargarUnidadMedida()
        obtenerOpGruposFinanzas()
      }
    }, [show])
    useEffect(() => {
      if(getValues('id_grupo')!==0){
        obtenerOpConceptosFinanzas(getValues('id_grupo')||0)
      }
    }, [getValues('id_grupo')])
    
    const onSubmitDetalleEgreso = (data: DetalleEgresoProps) => {
      dispatch(onAddItemDetalleEgresos([data]))
      onHide()
     }
    return (
    <ModalCR onHide={onHide} show={show}>
        <ModalCR.Header>
            <ModalCR.Title>Detalle del gasto</ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            <form onSubmit={handleSubmit(onSubmitDetalleEgreso)}>
                <Row>
                    <Col lg={6}>
                      <InputSelectCR options={opcionesGruposFinanzas} {...register("id_grupo", {
                        required: "Este campo es obligatorio"
                      })} label="Grupo" name="id_grupo" messageErrors={errors.id_grupo?.message}/>
                    </Col>
                    <Col lg={6}>
                      <InputSelectCR options={opcionesConceptosFinanzas} {...register("id_concepto", {
                        required: "Este campo es obligatorio"
                      })} label="Concepto" name="id_concepto" messageErrors={errors.id_concepto?.message}/>
                    </Col>
                    <Col lg={12}>
                    <InputCR {...register("nombre_articulo", {
                      required: "Este campo es obligatorio"
                    })} label="Nombre del Artículo" name="nombre_articulo" messageErrors={errors.nombre_articulo?.message}/>
                    </Col>
                    <Col lg={6}>
                    <InputSelectCR options={dataUnidadMedida} {...register("id_unidad_medida", {
                      required: "Este campo es obligatorio"
                    })} label="Unidad de Medida" name="id_unidad_medida" messageErrors={errors.id_unidad_medida?.message}/>
                    </Col>
                    <Col lg={6}>
                    <InputCR {...register("cantidad", {
                      required: "Este campo es obligatorio"
                    })} label="Cantidad" name="cantidad" messageErrors={errors.cantidad?.message}/>
                    </Col>
                    <Col lg={6}>
                    <InputCR {...register("monto", {
                      required: "Este campo es obligatorio"
                    })} label="Monto" name="monto" messageErrors={errors.monto?.message}/>
                    </Col>
                    <Col lg={6}>
                    <InputSelectCR options={[]} {...register("id_centro_costo", {
                      required: "Este campo es obligatorio"
                    })} label="Centro de Costo" name="id_centro_costo" messageErrors={errors.id_centro_costo?.message}/>
                    </Col>
                    <Col lg={6}>
                      <ButtonCR label={'Agregar'} type='submit'/>
                    </Col>
                    <Col lg={6}>
                      <ButtonCR label={'Cancelar'} type='button' variant='link'/>
                    </Col>
                </Row>
            </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
