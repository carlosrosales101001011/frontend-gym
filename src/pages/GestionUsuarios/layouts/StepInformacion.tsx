import { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useForm } from '@/hook/useForm';
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore';
import { InputCR } from '@/components/TextFields/InputCR';
import { InputSelectCR } from '@/components/TextFields/InputSelectCR';
import InputSwitchCR from '@/components/TextFields/InputSwitchCR';
import { useGestionUsuariosStore } from '../hook/useGestionUsuariosStore';
import type { UserProps } from '../store/usuariosSlice';
import { PieStep } from '../components/PieStep';

type StepInformacionProps = {
  setStep: (step:number)=>void;
}
/** Solo para validar que se escribió igual; no se guarda en el usuario */
type FormInformacion = UserProps & { password_confirmacion: string }

const PATRON_EMAIL = { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email inválido" }
/** Mismas reglas que el backend (CreateUserDto) */
const PATRON_USUARIO = { value: /^[a-zA-Z0-9._-]{3,30}$/, message: "De 3 a 30 caracteres: letras, números, punto, guion o guion bajo" }
const PATRON_PASSWORD = { value: /^(?=.*(\d|\W)).{6,50}$/, message: "De 6 a 50 caracteres, con al menos un número o símbolo" }

/** Paso 1: datos del usuario. Los correos son opcionales (si se escriben, deben ser válidos) */
export const StepInformacion = ({setStep}:StepInformacionProps) => {
  const { user, opcionesEmpleados, obtenerOpcionesEmpleados, guardarInformacion } = useGestionUsuariosStore()
  const { cargar:cargarRoles, data:dataRoles } = useTerminologiaPersona('userRoles')
  const { register, formState: { errors }, handleSubmit } = useForm<FormInformacion>({
    mode: "onChange",
    defaultValues: { ...user, password_confirmacion: user.password },
  })
  useEffect(() => {
    cargarRoles()
    obtenerOpcionesEmpleados()
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- la confirmación no se guarda
  const onSiguiente = ({ password_confirmacion, ...data }: FormInformacion)=>{
    guardarInformacion(data)
    setStep(1)
  }
  // autoComplete apagado: el navegador no debe llenar el correo y la contraseña del nuevo usuario
  // con las credenciales guardadas de quien lo registra
  return (
    <form onSubmit={handleSubmit(onSiguiente)} autoComplete="off">
      <Row className="g-2">
        <Col lg={6}>
          <InputCR {...register("nombres", {
            required: "Los nombres son obligatorios"
          })} label="Nombres" name="nombres" required messageErrors={errors.nombres?.message}/>
        </Col>
        <Col lg={6}>
          <InputCR {...register("apellidos", {
            required: "Los apellidos son obligatorios"
          })} label="Apellidos" name="apellidos" required messageErrors={errors.apellidos?.message}/>
        </Col>
        <Col lg={6}>
          <InputCR {...register("email", { pattern: PATRON_EMAIL })}
            label="Correo personal" name="email" messageErrors={errors.email?.message} />
        </Col>
        <Col lg={6}>
          <InputCR {...register("email_corporativo", { pattern: PATRON_EMAIL })}
            label="Correo empresarial" name="email_corporativo" messageErrors={errors.email_corporativo?.message}/>
        </Col>
        <Col lg={6}>
          <InputCR {...register("usuario", { required: "El usuario es obligatorio", pattern: PATRON_USUARIO })}
            label="Usuario" name="usuario" required maxLength={30} autoComplete="off" messageErrors={errors.usuario?.message} />
        </Col>
        <Col lg={6}>
          <InputCR {...register("telefono", {
            required: 'El teléfono es obligatorio'
          })} label="Teléfono" name="telefono" required messageErrors={errors.telefono?.message}/>
        </Col>
        <Col lg={6}>
          <InputCR {...register("password", {
            required: 'La contraseña es obligatoria',
            pattern: PATRON_PASSWORD,
          })} type="password" autoComplete="new-password" label="Contraseña" name="password" required messageErrors={errors.password?.message}/>
        </Col>
        <Col lg={6}>
          <InputCR {...register("password_confirmacion", {
            required: 'Repite la contraseña',
            validate: (valor, valores) => valor === valores.password || 'Las contraseñas no coinciden',
          })} type="password" autoComplete="new-password" label="Repetir la contraseña" name="password_confirmacion" required messageErrors={errors.password_confirmacion?.message}/>
        </Col>
        <Col lg={6}>
          {/* El backend espera números (IsNumber) */}
          <InputSelectCR {...register("id_rol", { setValueAs: Number })} label="Rol" options={dataRoles} />
        </Col>
        <Col lg={6}>
          <InputSelectCR {...register("id_empl", { setValueAs: Number })} label="Empleado" options={opcionesEmpleados} />
        </Col>
        <Col lg={6} className="d-flex align-items-center">
          <InputSwitchCR {...register("is_super_user")} name='is_super_user' label='Es super usuario' wrapperClassName="mb-0"/>
        </Col>
      </Row>
      <PieStep />
    </form>
  )
}
