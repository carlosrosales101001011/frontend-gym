import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import ModalCR from "@/components/Modal/ModalCR";
import { useForm } from "@/hook/useForm";
import { InputCR } from "@/components/TextFields/InputCR";
import { ButtonCR } from "@/components/Button/ButtonCR";
import { useSesionStore } from "@/hook/useSesionStore";
import { mensajeError } from "@/helpers/mensajeError";

/** Mismas reglas que el backend (ReglasPassword) */
const PATRON_PASSWORD = { value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*(\d|\W)).{6,50}$/, message: "De 6 a 50 caracteres, con mayúscula, minúscula y un número o símbolo" }

type FormCambiarPassword = {
  password_actual: string
  password_nueva: string
  password_confirmacion: string
}

type ModalCambiarPasswordProps = {
  show: boolean
  onHide: () => void
}

/**
 * El usuario logueado cambia su contraseña: la actual, la nueva y repetirla.
 * Se monta al abrirse (ver IconosTopbar): el formulario arranca vacío cada vez.
 */
export const ModalCambiarPassword = ({ show, onHide }: ModalCambiarPasswordProps) => {
  const { cambiarPassword } = useSesionStore()
  const [guardando, setGuardando] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormCambiarPassword>({
    mode: 'onChange',
    defaultValues: { password_actual: '', password_nueva: '', password_confirmacion: '' },
  })

  const onSubmit = async ({ password_actual, password_nueva }: FormCambiarPassword) => {
    setGuardando(true)
    try {
      await cambiarPassword(password_actual, password_nueva)
      onHide()
      await Swal.fire({ icon: 'success', title: 'Contraseña actualizada', timer: 1800, showConfirmButton: false })
    } catch (e) {
      await Swal.fire({ icon: 'error', title: 'No se pudo cambiar la contraseña', html: mensajeError(e) })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <ModalCR onHide={onHide} show={show} size='sm' position='center'>
      <ModalCR.Header>
        <ModalCR.Title>Cambiar contraseña</ModalCR.Title>
      </ModalCR.Header>
      <ModalCR.Body>
        {/* autoComplete: el navegador puede ofrecer la actual y guardar la nueva */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row className="g-2">
            <Col xs={12}>
              <InputCR {...register('password_actual', { required: 'Ingresa tu contraseña actual' })}
                type='password' autoComplete='current-password' label='Contraseña actual' name='password_actual'
                required autoFocus messageErrors={errors.password_actual?.message} />
            </Col>
            <Col xs={12}>
              <InputCR {...register('password_nueva', {
                  required: 'Ingresa la nueva contraseña',
                  pattern: PATRON_PASSWORD,
                  validate: (valor, valores) => valor !== valores.password_actual || 'Debe ser distinta a la actual',
                })}
                type='password' autoComplete='new-password' label='Nueva contraseña' name='password_nueva'
                required messageErrors={errors.password_nueva?.message} />
            </Col>
            <Col xs={12}>
              <InputCR {...register('password_confirmacion', {
                  required: 'Repite la nueva contraseña',
                  validate: (valor, valores) => valor === valores.password_nueva || 'Las contraseñas no coinciden',
                })}
                type='password' autoComplete='new-password' label='Repetir la nueva contraseña' name='password_confirmacion'
                required messageErrors={errors.password_confirmacion?.message} />
            </Col>
          </Row>
          <div className="d-flex align-items-center mt-3">
            <ButtonCR label={guardando ? 'Guardando...' : 'Guardar'} type='submit' disabled={guardando} />
            <ButtonCR label='Cancelar' variant='link' onClick={onHide} disabled={guardando} />
          </div>
        </form>
      </ModalCR.Body>
    </ModalCR>
  )
}
