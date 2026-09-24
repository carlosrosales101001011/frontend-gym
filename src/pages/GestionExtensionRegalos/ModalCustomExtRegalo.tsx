import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import ModalCR from "@/components/Modal/ModalCR";
import { useForm } from "@/hook/useForm";
import { InputCR } from "@/components/TextFields/InputCR";
import { InputSelectCR } from "@/components/TextFields/InputSelectCR";
import { ButtonCR } from "@/components/Button/ButtonCR";
import { initialStateExtRegalo, MAX_DIAS_REGALO, type ExtRegaloProps } from "@/pages/GestionExtensionRegalos/store/extRegaloSlice";
import { useExtRegaloStore } from "@/pages/GestionExtensionRegalos/useExtRegaloStore";
import { MembresiaActivaCliente } from "@/pages/GestionExtensionRegalos/components/MembresiaActivaCliente";

/**
 * Formulario para regalar días a la membresía activa de un cliente.
 * Al editar solo cambia el motivo: el backend no recalcula el vencimiento si cambian los días o el cliente.
 * Se monta al abrirse (ver App), así el form arranca con los valores correctos.
 */
export const ModalCustomExtRegalo = ({id, onHide, show}: {id: number, onHide: ()=>void, show: boolean}) => {
    const { extRegalos, membresiasActivas, obtenerMembresiaSeguimiento, guardarExtRegalo } = useExtRegaloStore()
    const esEdicion = id !== 0
    // La fila del listado ya trae todo lo que se muestra al editar (labels incluidos)
    const extRegalo = extRegalos.find((e) => e.id === id) ?? initialStateExtRegalo.extRegalo
    const { formState: { errors }, register, handleSubmit, watch, setError } = useForm<ExtRegaloProps>({defaultValues: extRegalo, mode: 'onChange'})

    useEffect(() => {
        obtenerMembresiaSeguimiento()
    }, [])

    const idCli = Number(watch('id_cli')) || 0
    const diasHabiles = Number(watch('dias_habiles')) || 0
    const membresia = membresiasActivas.find((m) => m.id_cli === idCli)
    const opcionesClientes = membresiasActivas.map((m) => ({ value: m.id_cli!, label: m.label_nombres_apellidos_cli }))

    const registroDias = register('dias_habiles', {
        required: 'Este campo es obligatorio',
        pattern: { value: /^\d+$/, message: 'Ingresa un número entero' },
        min: { value: 1, message: 'Debe ser al menos 1 día' },
    })
    /** Si escriben (o pegan) más del máximo, el input se fuerza a MAX_DIAS_REGALO */
    const onChangeDias = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(e.target.value) > MAX_DIAS_REGALO) e.target.value = String(MAX_DIAS_REGALO)
        registroDias.onChange(e)
    }

    const onSubmit = async (data: ExtRegaloProps) => {
        if (!esEdicion && !membresia) {
            setError('id_cli', { type: 'validate', message: 'El cliente no tiene una membresía activa' })
            return
        }
        const guardado = await guardarExtRegalo({
            ...extRegalo,
            id_cli: idCli,
            id_venta: membresia?.id_venta ?? extRegalo.id_venta,
            dias_habiles: Number(data.dias_habiles),
            observacion: data.observacion.trim(),
        })
        if (guardado) onHide()
    }
  return (
    <ModalCR onHide={onHide} show={show} size='lg' position='center'>
        <ModalCR.Header>
            <ModalCR.Title>{esEdicion ? 'Editar extensión de regalo' : 'Regalar días'}</ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row className="g-3">
                {/* Columna 1: formulario */}
                <Col lg={6}>
                  <Row className="g-2">
                    <Col lg={12}>
                      {esEdicion
                        ? <InputCR label='Cliente' value={extRegalo.label_nombres_apellidos_cli ?? ''} disabled readOnly />
                        : <InputSelectCR {...register('id_cli', {
                              min: { value: 1, message: 'Selecciona un cliente' },
                            })} label='Cliente (solo socios activos)' name='id_cli' options={opcionesClientes} messageErrors={errors.id_cli?.message}/>}
                    </Col>
                    <Col lg={12}>
                      <InputCR {...registroDias} onChange={onChangeDias} label={`Cantidad de días para regalar (máx. ${MAX_DIAS_REGALO})`} name='dias_habiles' inputMode='numeric' disabled={esEdicion} messageErrors={errors.dias_habiles?.message} />
                    </Col>
                    <Col lg={12}>
                      <InputCR {...register('observacion', {
                          required: 'Indica el motivo del regalo',
                          maxLength: { value: 250, message: 'Máximo 250 caracteres' },
                        })} label='Observación / motivo' name='observacion' type='text-area' messageErrors={errors.observacion?.message} />
                    </Col>
                  </Row>
                </Col>
                {/* Columna 2: membresía activa del cliente, se activa al seleccionarlo */}
                <Col lg={6}>
                  <MembresiaActivaCliente membresia={membresia} diasRegalo={esEdicion ? 0 : diasHabiles} />
                </Col>
              </Row>
              <div className="d-flex align-items-center mt-2">
                <ButtonCR label='Guardar' type='submit' />
                <ButtonCR label='Cancelar' variant='link' onClick={onHide} />
              </div>
            </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
