import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import ModalCR from "@/components/Modal/ModalCR";
import { useForm } from "@/hook/useForm";
import { useTerminologiaPersona } from "@/hook/usePropiedadesStore";
import { initialStatePromocion, type PromocionProps } from "@/pages/GestionPromociones/store/promocionSlice";
import { usePromocionesStore } from "@/pages/GestionPromociones/usePromocionesStore";
import { InputCR } from "@/components/TextFields/InputCR";
import { InputSelectCR } from "@/components/TextFields/InputSelectCR";
import InputSwitchCR from "@/components/TextFields/InputSwitchCR";
import { ButtonCR } from "@/components/Button/ButtonCR";
import { removeNull } from "@/helpers/removeNull";

const HORA_PATTERN = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

export const ModalCustomPromocion = ({id, onHide, show}: {id: number, onHide: ()=>void, show: boolean}) => {
    const { data:dataTipoPromocion, cargar:cargarTipoPromocion } = useTerminologiaPersona('tipoPromocion');
    const { post, dataxID, obtenerxID, patch } = usePromocionesStore()
    const { formState, getValues, register, handleSubmit, reset } = useForm({defaultValues: initialStatePromocion.promocion, mode: 'onChange'})

    useEffect(() => {
        if (show) {
            cargarTipoPromocion();
        }
    }, [show])

    useEffect(() => {
      if (id!==0 && show) {
        obtenerxID(id)
      }else{
        reset(initialStatePromocion.promocion);
      }
    }, [show, id])

    useEffect(() => {
      if (dataxID && id !== 0) {
        reset({
          ...dataxID
        });
      }else if (id === 0) {
        reset(initialStatePromocion.promocion);
      }
    }, [dataxID, id]);

    const onSubmit = (data: PromocionProps)=>{
        const { id, cantidad_usos, ...val } = removeNull(data);
        console.log({cantidad_usos});
        const payload = {
            ...val,
            id_tipo_promocion: Number(val.id_tipo_promocion),
            prioridad: Number(val.prioridad),
            cantidad_max_uso: val.cantidad_max_uso ? Number(val.cantidad_max_uso) : undefined,
            monto_minimo: val.monto_minimo ? Number(val.monto_minimo) : undefined,
            monto_maximo: val.monto_maximo ? Number(val.monto_maximo) : undefined,
        }
        if (id!==0) {
            patch(payload as PromocionProps, id, '')
        }else{
            post(payload as PromocionProps)
        }
        onCancelar()
    }
    const onCancelar = ()=>{
        onHide()
        reset(initialStatePromocion.promocion)
    }
  return (
    <ModalCR onHide={onHide} show={show} size='md' position='center'>
        <ModalCR.Header>
            <ModalCR.Title>{id===0 ? 'Agregar promoción' : 'Editar promoción'}</ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col lg={4}>
                  <InputCR {...register("codigo", {
                      required: "Este campo es obligatorio"
                    })} label='Código' name='codigo' type='normal' />
                </Col>
                <Col lg={8}>
                  <InputCR {...register("nombre", {
                      required: "Este campo es obligatorio"
                    })} label='Nombre de la promoción' name='nombre' type='normal' />
                </Col>
                <Col lg={12}>
                  <InputSelectCR {...register("id_tipo_promocion", {
                      required: "Este campo es obligatorio"
                    })} label='Tipo de Promoción' name='id_tipo_promocion' options={dataTipoPromocion} messageErrors={formState.errors.id_tipo_promocion?.message}/>
                </Col>
                <Col lg={6}>
                  <InputCR {...register("fecha_inicio", {
                      required: "Este campo es obligatorio"
                    })} label='Fecha Inicio' name='fecha_inicio' type='date' messageErrors={formState.errors.fecha_inicio?.message}/>
                </Col>
                <Col lg={6}>
                  <InputCR {...register("fecha_fin", {
                      required: "Este campo es obligatorio"
                    })} label='Fecha Fin' name='fecha_fin' type='date' messageErrors={formState.errors.fecha_fin?.message}/>
                </Col>
                <Col lg={6}>
                  <InputCR {...register("hora_inicio", {
                      required: "Este campo es obligatorio",
                      pattern: { value: HORA_PATTERN, message: 'Formato de hora inválido (HH:mm)' }
                    })} label='Hora Inicio' name='hora_inicio' type='normal' placeholder='HH:mm' messageErrors={formState.errors.hora_inicio?.message}/>
                </Col>
                <Col lg={6}>
                  <InputCR {...register("hora_fin", {
                      required: "Este campo es obligatorio",
                      pattern: { value: HORA_PATTERN, message: 'Formato de hora inválido (HH:mm)' }
                    })} label='Hora Fin' name='hora_fin' type='normal' placeholder='HH:mm' messageErrors={formState.errors.hora_fin?.message}/>
                </Col>
                <Col lg={4}>
                  <InputCR {...register("prioridad")} label='Prioridad' name='prioridad' type='normal' />
                </Col>
                <Col lg={4}>
                  <InputCR {...register("cantidad_max_uso")} label='Cantidad Máx. de Usos' name='cantidad_max_uso' type='normal' />
                </Col>
                <Col lg={4}>
                  <InputSwitchCR
                    {...register("is_acumulable")}
                    label={`${getValues('is_acumulable') ? 'Acumulable' : 'No acumulable'}`}
                    name="is_acumulable"
                    messageErrors={formState.errors.is_acumulable?.message}
                  />
                </Col>
                <Col lg={6}>
                  <InputCR {...register("monto_minimo")} label='Monto Mínimo' name='monto_minimo' type='normal' />
                </Col>
                <Col lg={6}>
                  <InputCR {...register("monto_maximo")} label='Monto Máximo' name='monto_maximo' type='normal' />
                </Col>
                <Col lg={12}>
                  <InputCR {...register("descripcion", {
                      required: "Este campo es obligatorio"
                    })} label='Descripción' name='descripcion' type='text-area' messageErrors={formState.errors.descripcion?.message}/>
                </Col>
                <Col lg={12}>
                  <InputCR {...register("observacion")} label='Observación' name='observacion' type='text-area' />
                </Col>
                <Col lg={12}>
                  <InputSwitchCR
                    {...register("is_activo")}
                    label={`${getValues('is_activo') ? 'Activo' : 'Inactivo'}`}
                    name="is_activo"
                    messageErrors={formState.errors.is_activo?.message}
                  />
                </Col>
              </Row>
                <ButtonCR label='Guardar' type='submit' />
            </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
