import React, { useId } from "react";

// ─── Props ─────────────────────────────────────────────────────────────────
// Diseñado para recibir el spread de register("campo", { ... }) tal como se
// usa con InputCR / InputSelectCR:
//
//   <InputSwitchCR
//     {...register("activo")}
//     label="Activo"
//     name="activo"
//     messageErrors={errors.activo?.message}
//     helperText="Determina si el registro estará visible"
//   />
//
// register() devuelve: { name, ref, onChange, onBlur, defaultValue, disabled? }
// donde `ref` es un callback ref (no un RefObject), por eso el componente
// usa forwardRef y lo conecta directo al <input> real.

export interface InputSwitchCRProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "size" | "defaultValue"
  > {
  /** Nombre del campo (debe coincidir con el registrado en useForm) */
  name: string;
  /** Texto junto al switch */
  label?: string;
  /** Texto de ayuda, se muestra solo si NO hay error */
  helperText?: string;
  /** Mensaje de error (normalmente errors.campo?.message) */
  messageErrors?: string;
  /** Valor inicial que llega desde register() (puede venir como boolean o string) */
  defaultValue?: string | boolean;
  /** Clase para el contenedor externo (div.mb-3) */
  wrapperClassName?: string;
  /** Clase adicional para el <input> */
  inputClassName?: string;
  /** Ubicar el label antes del switch (form-check-reverse) */
  reverse?: boolean;
  /** Ref hacia el <input> real (React 19: prop normal, sin forwardRef) */
  ref?: React.Ref<HTMLInputElement>;
}
 
const InputSwitchCR = ({
  name,
  label,
  helperText,
  messageErrors,
  defaultValue,
  wrapperClassName = "",
  inputClassName = "",
  reverse = false,
  onChange,
  onBlur,
  disabled,
  ref,
  ...rest
}: InputSwitchCRProps) => {
  const autoId = useId();
  const inputId = `switch-${name}-${autoId}`;
  const hasError = Boolean(messageErrors);

  return (
    <div className={`mb-3 ${wrapperClassName}`}>
      <div className={`form-check d-flex gap-2 align-items-center form-switch ${reverse ? "form-check-reverse" : ""}`}>
        <input
          {...rest}
          ref={ref}
          type="checkbox"
          role="switch"
          id={inputId}
          name={name}
          defaultChecked={Boolean(defaultValue)}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`form-check-input ${hasError ? "is-invalid" : ""} ${inputClassName}`}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined
          }
          style={{height: '20px', width: '40px'}}
        />
        {label && (
          <label className="form-check-label" htmlFor={inputId}>
            {label}
          </label>
        )}
      </div>

      {hasError ? (
        <div id={`${inputId}-error`} className="invalid-feedback d-block">
          {messageErrors}
        </div>
      ) : helperText ? (
        <div id={`${inputId}-help`} className="form-text">
          {helperText}
        </div>
      ) : null}
    </div>
  );
};

export default InputSwitchCR;