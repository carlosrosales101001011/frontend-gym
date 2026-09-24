import React, {  useRef, useState } from "react";
import type { SelectHTMLAttributes, ReactNode } from "react";
import Select, { type SingleValue, type StylesConfig } from 'react-select'
interface SelectOption {
  value: number;
  label: string;
}

interface SelectCRProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "multiple"> {
  label: string;
  options: SelectOption[];
  multiple?: boolean;
  messageErrors?: string;
  LabelColor?: "text-danger" | "text-warning" | "text-success" | "text-primary";
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  defaultValue?:string;
  required?: boolean;
  autoFocus?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
}
export const InputSelectCR: React.FC<SelectCRProps> = ({
  label,
  options = [],
  messageErrors = "",
  LabelColor,
  onChange,
  defaultValue,
  required = false,
  autoFocus = false,
  onBlur,
}) => {
  const hasError = messageErrors.trim().length !== 0;
  const classNameLabel = LabelColor ?? "";
  const ref = useRef(null)
  const [isFocused, setIsFocused] = useState(false);

const handleFocus = () => {
  setIsFocused(true);
};

const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
  setIsFocused(false);
  onBlur?.(event);
};

const selectedOption = options?.find((opt) => opt.value === Number(defaultValue));
const hasValue = selectedOption !== undefined;
  const onChange1 = (option: SingleValue<SelectOption>)=>{
  const val = option?.value ?? 0;

  if (onChange) {
    // Creamos un evento sintético que simula un <select> nativo
    onChange({
      target: { value: String(val), type: "number" },
      currentTarget: { value: String(val), type: "number" },
      type: "number"
    } as unknown as React.ChangeEvent<HTMLSelectElement>);
  }
  }
const OPTION_HEIGHT = 21; // 17px minHeight + 2px + 2px de padding vertical
const VISIBLE_OPTIONS = 5;
// Sin colores acá: los colores viven en _TextFields.scss, tomados de _variables-custom.scss.
// `unstyled` (ver <Select>) apaga los estilos inline de react-select para que mande el CSS.
const customStyles: StylesConfig<SelectOption, false> = {
  option: (provided) => ({
    ...provided,
    padding: '2px 10px', // Reduce el padding vertical
    minHeight: '17px',   // Altura mínima de la opción
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
  }),
    control: (provided) => ({
    ...provided,
    minHeight: 32,
    height: 22,
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: 32,
    padding: '0 6px',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: 32,
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
  }),
  // El menú se renderiza en un portal (ver menuPortalTarget), por eso necesita
  // su propio z-index alto: así no queda recortado por el overflow ni tapado
  // por otras cards/elementos del formulario.
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};

  return (
    <div className="input-textfield">
      <div className="textfield-filled inputselect-model-actual">
        <Select
          className="inputselect-model-actual border-o"
          unstyled
          styles={customStyles}
          onFocus={handleFocus}
          onChange={onChange1}
          onBlur={handleBlur}
          value={selectedOption}
          classNamePrefix="react-select"
          options={options}
          ref={ref}
          placeholder=''
          autoFocus={autoFocus}
          maxMenuHeight={OPTION_HEIGHT * VISIBLE_OPTIONS}
          menuPortalTarget={document.body}
          menuPosition="fixed"
        />
        <label
          className={`textfield-label ${
            (isFocused || hasValue)
              ? "label-select-focus"
              : "label-select-blur"
          } ${hasError ? "text-danger" : ""} ${classNameLabel}`}
        >
          {label}{required && <span className="text-danger"> *</span>}
        </label>
      </div>
      <span className="text-danger fw-bold px-2 m-0" style={{fontSize: '11px'}}>
        {messageErrors.trim().length !==0 && messageErrors }
      </span>
    </div>
  );
};