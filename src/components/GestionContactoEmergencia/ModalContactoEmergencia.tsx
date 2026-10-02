import { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import ModalCR from '@/components/Modal/ModalCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { useForm } from '@/hook/useForm'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { initialContactoEmergencia, type ContactoEmergenciaProps } from '@/components/GestionContactoEmergencia/contactoEmergenciaSlice'
import type { ContactoEmergenciaForm } from '@/components/GestionContactoEmergencia/useContactoEmergenciaStore'

type props = {
    onHide: () => void;
    /** Contacto a editar; null = agregar uno nuevo */
    contacto: ContactoEmergenciaProps | null;
    /**
     * Guarda el contacto (con API o solo en memoria, lo decide AppContactoEmergencia).
     * labelCargo: nombre del parentesco elegido, para mostrarlo sin pedirlo al backend. Devuelve true si se guardó.
     */
    onGuardar: (datos: ContactoEmergenciaForm, labelCargo: string) => Promise<boolean>;
}

/**
 * Agregar / editar un contacto de emergencia. Se monta al abrirse (ver AppContactoEmergencia):
 * el formulario arranca vacío o con el contacto a editar.
 */
export const ModalContactoEmergencia = ({ onHide, contacto, onGuardar }: props) => {
    const { data: dataParientes, cargar: cargarParientes } = useTerminologiaPersona('parientes')
    const [guardando, setGuardando] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm<ContactoEmergenciaProps>({
        defaultValues: contacto ?? initialContactoEmergencia,
        mode: 'onChange',
    })

    useEffect(() => {
        cargarParientes()
    }, [])

    // Solo los campos que acepta el backend (lo demás que trae, como label_cargo o uid_location, da 400)
    const onSubmit = async (valores: ContactoEmergenciaProps) => {
        const id_cargo = Number(valores.id_cargo)
        setGuardando(true)
        const guardado = await onGuardar({
            nombres: valores.nombres,
            apellido_paterno: valores.apellido_paterno,
            apellido_materno: valores.apellido_materno,
            telefono: valores.telefono,
            email: valores.email,
            observacion: valores.observacion,
            id_cargo,
        }, dataParientes.find((opcion) => opcion.value === id_cargo)?.label ?? '')
        setGuardando(false)
        if (guardado) onHide()
    }

  return (
    <ModalCR onHide={onHide} show>
        <ModalCR.Header>
            {contacto ? 'Editar contacto de emergencia' : 'Agregar contacto de emergencia'}
        </ModalCR.Header>
        <ModalCR.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Row className='g-2'>
                    <Col lg={12}>
                    <InputSelectCR {...register("id_cargo", {
                        setValueAs: Number,
                        min: { value: 1, message: "Elige el parentesco" },
                        })} label='Parentesco' options={dataParientes} defaultValue={String(contacto?.id_cargo ?? 0)} messageErrors={errors.id_cargo?.message}/>
                    </Col>
                    <Col lg={12}>
                    <InputCR {...register("nombres", {
                        required: "Este campo es obligatorio"
                        })} label='Nombres' type='normal' messageErrors={errors.nombres?.message}/>
                    </Col>
                    <Col lg={6}>
                    <InputCR {...register("apellido_paterno")} label='Apellido paterno' type='normal' messageErrors={errors.apellido_paterno?.message}/>
                    </Col>
                    <Col lg={6}>
                    <InputCR {...register("apellido_materno")} label='Apellido materno' type='normal' messageErrors={errors.apellido_materno?.message}/>
                    </Col>
                    <Col lg={6}>
                    <InputCR {...register("telefono", {
                        required: "Este campo es obligatorio"
                        })} label='Teléfono' type='normal' messageErrors={errors.telefono?.message}/>
                    </Col>
                    <Col lg={6}>
                    <InputCR {...register("email", {
                        required: "Este campo es obligatorio"
                        })} label='Email' messageErrors={errors.email?.message}/>
                    </Col>
                    <Col lg={12}>
                    <InputCR {...register("observacion", {
                        required: "Este campo es obligatorio"
                        })} label='Observación' type='text-area' messageErrors={errors.observacion?.message}/>
                    </Col>
                </Row>
                <div className='d-flex align-items-center mt-3'>
                    <ButtonCR label={guardando ? 'Guardando...' : 'Guardar'} type='submit' disabled={guardando}/>
                    <ButtonCR label={'Cancelar'} variant='link' onClick={onHide} disabled={guardando}/>
                </div>
            </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
