import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { InputCR } from "@/components/TextFields/InputCR";
import IconCR from "@/components/Icons/IconCR";
import { useForm } from "@/hook/useForm";
import { useLoginStore, type LoginValues } from "@/pages/login/hook/useLoginStore";

export const LoginForm = () => {
  const { login, errorLogin } = useLoginStore()
  const [verPassword, setVerPassword] = useState(false)

  const { register, handleSubmit, formState } = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
    mode: "onBlur", // valida al salir del campo
  });
  const { errors, isSubmitting } = formState

  return (
    <form className="login-form" onSubmit={handleSubmit(login)} noValidate>
      <div className="login-form__header">
        <h1 className="login-form__title">Bienvenido</h1>
        <p className="login-form__subtitle">Ingresa tus credenciales para acceder al sistema</p>
      </div>

      {errorLogin && (
        <div className="login-form__alert" role="alert">
          <IconCR name="times" size={14} className="login-form__alert-icon"/>
          <span>{errorLogin}</span>
        </div>
      )}

      <InputCR
        label="Correo electrónico"
        autoComplete="email"
        inputMode="email"
        autoFocus
        messageErrors={errors.email?.message}
        {...register("email", {
          required: "El email es obligatorio",
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email inválido" },
        })}
      />

      <div className="login-form__password">
        <InputCR
          label="Contraseña"
          type={verPassword ? "normal" : "password"}
          autoComplete="current-password"
          messageErrors={errors.password?.message}
          {...register("password", {
            required: "La contraseña es obligatoria",
          })}
        />
        <button
          type="button"
          className="login-form__toggle"
          onClick={() => setVerPassword(!verPassword)}
          aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          title={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          <IconCR name={verPassword ? "eyeOff" : "eye"} size={16}/>
        </button>
      </div>

      <Button type="submit" variant="primary" className="login-form__submit" disabled={isSubmitting}>
        {isSubmitting
          ? <><Spinner animation="border" size="sm"/> Ingresando...</>
          : "Iniciar sesión"}
      </Button>
    </form>
  )
}
