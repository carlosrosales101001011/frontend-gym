import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import ModalCR from "@/components/Modal/ModalCR";
import { useForm } from "@/hook/useForm";
import { InputCR } from "@/components/TextFields/InputCR";
import { ButtonCR } from "@/components/Button/ButtonCR";
import { useGestionUsuariosStore } from "../hook/useGestionUsuariosStore";

/** Mismas reglas que el backend (ReglasPassword) */
const PATRON_PASSWORD = { value: /^(?=.*(\d|\W)).{6,50}$/, message: "De 6 a 50 caracteres, con al menos un número o símbolo" }

type FormAsignarPassword = {
  password_nueva: string
  password_confirmacion: string
}

type ModalAsignarPasswordProps = {
  /** Usuario al que se le cambia la contraseña */
  usuario: { id: number, nombre: string }
  onHide: () => void
}

/**
 * Cambia la contraseña de otro usuario desde Gestión de usuarios (sin la actual).
 * El backend solo lo permite a quien lo registró o a un super usuario.
 * Se monta al abrirse (ver DataTableUsuarios): el formulario arranca vacío cada vez.
 */
export const ModalAsignarPassword = ({ usuario, onHide }: ModalAsignarPasswordProps) => {
  const { asignarPassword } = useGestionUsuariosStore()
  const [guardando, setGuardando] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormAsignarPassword>({
    mode: 'onChange',
    defaultValues: { password_nueva: '', password_confirmacion: '' },
  })

  const onSubmit = async ({ password_nueva }: FormAsignarPassword) => {
    setGuardando(true)
    const guardado = await asignarPassword(usuario.id, password_nueva)
    setGuardando(false)
    if (guardado) onHide()
  }

  return (
    <ModalCR onHide={onHide} show size='sm' position='center'>
      <ModalCR.Header>
        <ModalCR.Title>Cambiar contraseña</ModalCR.Title>
      </ModalCR.Header>
      <ModalCR.Body>
        <p className="small mb-3" style={{ opacity: 0.75 }}>Usuario: <strong>{usuario.nombre}</strong></p>
        {/* autoComplete new-password: el navegador no debe llenar la contraseña de quien está logueado */}
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Row className="g-2">
            <Col xs={12}>
              <InputCR {...register('password_nueva', { required: 'Ingresa la nueva contraseña', pattern: PATRON_PASSWORD })}
                type='password' autoComplete='new-password' label='Nueva contraseña' name='password_nueva'
                required autoFocus messageErrors={errors.password_nueva?.message} />
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
