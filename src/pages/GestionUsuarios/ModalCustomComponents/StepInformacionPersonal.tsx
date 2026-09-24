import { useForm } from '@/hook/useForm';
import { InputCR } from '@/components/TextFields/InputCR';
import { Col, Row } from 'react-bootstrap';
import { addUser, type UserProps } from '@/pages/GestionUsuarios/store/usuariosSlice';
import { useDispatch } from 'react-redux';
import { InputSelectCR } from '@/components/TextFields/InputSelectCR';
import InputSwitchCR from '@/components/TextFields/InputSwitchCR';
import { useAppSelector } from '@/stores/Store';
import { ButtonCR } from '@/components/Button/ButtonCR';
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore';
import { useEffect } from 'react';
type Props = {
    setStep: (step:number)=>void;
}
export const StepInformacionPersonal = ({setStep}:Props) => {
      const { user } = useAppSelector(e=>e.USER)
      const { cargar:cargarRoles, data:dataRoles } = useTerminologiaPersona('userRoles')
      const { register, formState: { errors }, handleSubmit } = useForm<UserProps>({mode: "onChange",defaultValues: user })
      const dispatch = useDispatch()
      useEffect(() => {
        cargarRoles()
      }, [])
      
      const onLastStep = (data:UserProps)=>{
        dispatch(addUser(data))
        setStep(1)
      }
      return (
        <div>
          <form onSubmit={handleSubmit(onLastStep)}>
            <Row>
              <Col lg={4}>
              </Col>
              <Col lg={8}>
                <Row>
                  <Col lg={6}>
                    <InputCR {...register("nombres", {
                      required: "Los nombres son obligatorios"
                    })} label="Nombres" name="nombres" messageErrors={errors.nombres?.message}/>
                  </Col>
                  <Col lg={6}>
                    <InputCR {...register("apellidos", {
                      required: "Los apellidos son obligatorios"
                    })} messageErrors={errors.apellidos?.message} label="Apellidos" name="apellidos"/>
                  </Col>
                  <Col lg={6}>
                    <InputCR {...register("email", {
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email inválido" },
                    })} messageErrors={errors.email?.message} label="Correo Personal" name="email" />
                  </Col>
                  <Col lg={6}>
                    <InputCR {...register("email_corporativo", {
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email inválido" }
                    })} messageErrors={errors.email_corporativo?.message} label="Correo Empresarial" name="email_corporativo"/>
                  </Col>
                  <Col lg={6}>
                    <InputCR {...register("password", {
                      required: 'La contraseña es obligatoria'
                    })} messageErrors={errors.password?.message} label="Contraseña" name="password"/>
                  </Col>
                  <Col lg={6}>
                    <InputCR {...register("password", {
                      required: 'La contraseña es obligatoria'
                    })} messageErrors={errors.password?.message} label="Repetir la contraseña" name="password"/>
                  </Col>
                  <Col lg={12}>
                    <InputCR {...register("telefono", {
                      required: 'El Telefono es obligatorio'
                    })} messageErrors={errors.telefono?.message} label="Telefono" name="telefono"/>
                  </Col>
                  <Col lg={6}>
                    <InputSelectCR {...register("id_rol")}  label="Rol" options={dataRoles} />
                  </Col>
                  <Col lg={6}>
                    <InputSelectCR {...register("id_empl")}  label="Empleado" options={dataRoles} />
                  </Col>
                  <Col lg={6}>
                    <InputSwitchCR {...register("is_super_user")} name='is_super_user' label='Es super usuario'/>
                  </Col>
                </Row>
              </Col>
            </Row>
                      <div className='float-end'>
                          <ButtonCR label={'Siguiente'} type='submit'/>
                      </div>
          </form>
        </div>
  )
}
