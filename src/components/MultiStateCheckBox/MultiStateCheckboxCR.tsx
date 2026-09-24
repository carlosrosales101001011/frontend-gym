import { useEffect, useRef, useState, useCallback, useMemo } from "react";

// Forma mínima que necesitamos de lo que devuelve tu `register(name, opts)`.
export interface FieldRegistration {
  name: string;
  ref: (el: HTMLElement | null) => void;
  onChange: (e: React.ChangeEvent<HTMLElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLElement>) => void;
  defaultValue: string;
  disabled?: boolean;
}

export interface MultiStateOption<V extends string | number = string | number> {
  /** Valor real que va a terminar en los datos del form (debe ser string | number) */
  value: V;
  /** Ícono a mostrar para este estado */
  icon: React.ReactNode;
  /** Label accesible / tooltip para este estado */
  label?: string;
  /** Color de fondo del botón para este estado (ej: "#f00" o "red") */
  bgHex?: string;
}

export interface MultiStateCheckboxCRProps<V extends string | number = string | number> {
  /** Estados posibles, en el orden en que se debe ciclar al hacer click */
  states: MultiStateOption<V>[];
  /** Resultado de tu `register(name, { setValueAs, defaultValue, disabled })` */
  registration: FieldRegistration;
  /**
   * MODO CONTROLADO. Si se pasa `value`, el componente deja de usar su estado
   * interno y muestra siempre lo que diga el padre. Es lo que permite que el
   * control lo cambie otro componente (ej: la columna "Todos").
   */
  value?: V;
  /** Se dispara con el nuevo valor cada vez que el usuario cicla el control */
  onValueChange?: (value: V) => void;
  /** Deshabilita el control (además de lo que ya venga en registration.disabled) */
  disabled?: boolean;
  /** Tamaño del botón, clases Bootstrap */
  size?: "sm" | "md" | "lg";
  /** Clases extra para el botón */
  className?: string;
  /** aria-label base (se le agrega el label del estado actual) */
  ariaLabel?: string;
  /** Mensaje de error a mostrar debajo (ej: formState.errors[name]?.message) */
  errorMessage?: string;
}

const sizeClass: Record<NonNullable<MultiStateCheckboxCRProps["size"]>, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

/** Setea el value de un input nativo evitando el tracker interno de React. */
function setNativeInputValue(input: HTMLInputElement, value: string) {
  const nativeSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  )?.set;

  if (nativeSetter) {
    nativeSetter.call(input, value);
  } else {
    input.value = value;
  }

  input.dispatchEvent(new Event("input", { bubbles: true }));
}

export function MultiStateCheckboxCR<V extends string | number = string | number>({
  states,
  registration,
  value,
  onValueChange,
  disabled,
  size = "md",
  className = "",
  ariaLabel,
  errorMessage,
}: MultiStateCheckboxCRProps<V>) {
  if (states.length < 2) {
    throw new Error("MultiStateCheckboxCR: `states` debe tener al menos 2 elementos.");
  }

  const isControlled = value !== undefined;
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  // Estado interno: solo se usa en modo NO controlado.
  const [internalIndex, setInternalIndex] = useState<number>(() => {
    // OJO: comparar con String() en ambos lados. `registration.defaultValue`
    // viene tipado como string pero en runtime puede ser number.
    const found = states.findIndex(
      (s) => String(s.value) === String(registration.defaultValue)
    );
    return found >= 0 ? found : 0;
  });

  // Re-sincroniza si el valor por defecto cambia desde afuera (reset, etc.)
  useEffect(() => {
    if (isControlled) return;
    const found = states.findIndex(
      (s) => String(s.value) === String(registration.defaultValue)
    );
    if (found >= 0) setInternalIndex(found);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registration.defaultValue, isControlled]);

  const controlledIndex = useMemo(() => {
    if (!isControlled) return 0;
    const found = states.findIndex((s) => String(s.value) === String(value));
    return found >= 0 ? found : 0;
  }, [isControlled, value, states]);

  const activeIndex = isControlled ? controlledIndex : internalIndex;

  const isDisabled = disabled ?? registration.disabled ?? false;

  const cycle = useCallback(() => {
    if (isDisabled) return;

    const nextIndex = (activeIndex + 1) % states.length;
    const next = states[nextIndex];

    if (!isControlled) setInternalIndex(nextIndex);

    const input = hiddenInputRef.current;
    if (input) setNativeInputValue(input, String(next.value));

    // Fuente de verdad hacia afuera: el input hidden NO dispara onChange en React.
    onValueChange?.(next.value);
  }, [activeIndex, isControlled, isDisabled, states, onValueChange]);

  const setRefs = useCallback(
    (el: HTMLInputElement | null) => {
      hiddenInputRef.current = el;
      registration.ref(el);
    },
    [registration]
  );

  const current = states[activeIndex];

  return (
    <div className="d-inline-flex flex-column align-items-center">
      <button
        type="button"
        className={`btn btn-outline-secondary multi-state-checkbox-cr d-inline-flex align-items-center justify-content-center ${
          sizeClass[size]
        } ${errorMessage ? "border-danger text-danger" : ""} ${className}`}
        style={{
          width: "7rem",
          height: "2rem",
          padding: 0,
          backgroundColor: `${current.bgHex}`,
          borderColor: `${current.bgHex}`,
          color: "white",
        }}
        onClick={cycle}
        disabled={isDisabled}
        aria-label={`${ariaLabel ?? registration.name}: ${current.label ?? current.value}`}
        title={current.label ?? String(current.value)}
      >
        {current.icon}
        <span>
          {current.label && (
            <small className="text-center mt-1 mx-2" style={{ fontSize: "0.75rem" }}>
              {current.label}
            </small>
          )}
        </span>
      </button>

      {/* Input real que registra ref/onBlur de tu useForm.
          El value lo mantiene sincronizado `setValue` desde el padre. */}
      <input
        type="hidden"
        name={registration.name}
        ref={setRefs}
        defaultValue={String(registration.defaultValue ?? "")}
        onChange={registration.onChange}
        onBlur={registration.onBlur}
      />

      {errorMessage && <small className="text-danger mt-1">{errorMessage}</small>}
    </div>
  );
}

export default MultiStateCheckboxCR;