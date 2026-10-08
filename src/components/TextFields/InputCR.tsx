import React from "react";
import type { HTMLInputTypeAttribute, InputHTMLAttributes, ReactNode } from 'react'
// import classNames from "classnames";

type typeInput='normal-select'| 'multi-select' | 'normal' | 'date'| 'datetime' | 'password' | 'text-area'

/** Ícono dentro del campo (ej. <IconCR name="search" />) */
export type IconoInputCR = {
    icon: ReactNode;
    /** Lado del campo (por defecto 'left') */
    position?: 'left' | 'right';
    /** true = fondo gris; '#...' = ese color; sin valor = sin fondo */
    background?: boolean | string;
}

/** Cada ícono ocupa un cuadro del alto del campo */
const ANCHO_ICONO = 32
/** Gris que funciona en modo claro y oscuro */
const FONDO_GRIS = 'rgba(128, 128, 128, 0.16)'
interface TextLabelProps
extends InputHTMLAttributes<HTMLInputElement>
{
label: string;
// variant?: Variant;
type?: typeInput;
inputSize?: "sm" | "md" | "lg";
helperText?: string;
borderColor?:
    | "border-danger"
    | "border-warning"
    | "border-success"
    | "border-primary";
LabelColor?: "text-danger" | "text-warning" | "text-success" | "text-primary";
required?: boolean;
startAdornment?: ReactNode;
endAdornment?: ReactNode;
className?: string;
messageErrors?:string;
/** Íconos dentro del campo, a la izquierda o derecha, con fondo opcional (ver IconoInputCR) */
iconos?: IconoInputCR[];
}
export const InputCR: React.FC<TextLabelProps> = ({
label,
type= 'normal',
helperText,
LabelColor,
required = false,
messageErrors='',
onChange,
iconos = [],
...props
}) => {
const classNameLabel = `${LabelColor}`;
// const onFocusInput = ()=>{
//     setisFocusableSelect(!isFocusableSelect)
// }

// Íconos: el texto y la etiqueta se corren para no quedar debajo de ellos
const izquierda = iconos.filter((icono) => (icono.position ?? 'left') === 'left')
const derecha = iconos.filter((icono) => icono.position === 'right')
const estiloInput: React.CSSProperties = {
    ...props.style,
    ...(izquierda.length ? { paddingLeft: izquierda.length * ANCHO_ICONO + 8 } : {}),
    ...(derecha.length ? { paddingRight: derecha.length * ANCHO_ICONO + 8 } : {}),
}
const estiloLabel: React.CSSProperties | undefined = izquierda.length ? { left: izquierda.length * ANCHO_ICONO + 8 } : undefined
const renderIconos = () => (
    <>
        {[...izquierda.map((icono, i) => ({ icono, lado: 'left' as const, i })), ...derecha.map((icono, i) => ({ icono, lado: 'right' as const, i }))]
            .map(({ icono, lado, i }) => (
                <span
                    key={`${lado}-${i}`}
                    className={`textfield-icono textfield-icono--${lado}`}
                    style={{
                        [lado]: 1 + i * ANCHO_ICONO,
                        backgroundColor: icono.background === true ? FONDO_GRIS : icono.background || undefined,
                    }}
                >
                    {icono.icon}
                </span>
            ))}
    </>
)

const renderInput = (typeInput:HTMLInputTypeAttribute) => (
    <div className="bg-actual">
        <div
        className="textfield-filled"
        >
        <input
            type={typeInput}
            className={`textfield-input input-mode-actual ${messageErrors.trim().length !==0 && 'border-danger'}`}
            placeholder=" "
            required={required}
            {...props}
            style={estiloInput}
            onChange={onChange}
        />
            
            <label className={`textfield-label ${messageErrors.trim().length !==0 && 'text-danger'} ${classNameLabel}`} style={estiloLabel}>{label}{required && <span className="text-danger"> *</span>}</label>
            {renderIconos()}
        </div>
    </div>
);

const renderTextArea = () => {
        const handleDateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
           const rawValue = e.target.value; // "2026-05-20"
           console.log({rawValue});
            onChange?.({
                target: {
                    value: rawValue,   // seguís mandando el string para el input
                    type: 'string'
                },
                currentTarget: { value: rawValue, type: "string" },
                type: 'string'
            } as React.ChangeEvent<HTMLInputElement>);
    };
    
    return (
        <div className="bg-actual">
            <div
            className="textfield-filled"
            >
            <textarea
                className={`textfield-input input-mode-actual form-control ${messageErrors.trim().length !==0 && 'border-danger'}`}
                placeholder=" "
                required={required}
                style={{height: '90px'}}
                onChange={handleDateChange}
                {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
                <label className={`textfield-label ${messageErrors.trim().length !==0 && 'text-danger'} ${classNameLabel}`}>{label}{required && <span className="text-danger"> *</span>}</label>
            </div>
        </div>
    )
}

const renderInputDate = (typeInput:HTMLInputTypeAttribute) => {
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
           const rawValue = e.target.value; // "2026-05-20"
           console.log({rawValue});
            onChange?.({
                target: {
                    value: rawValue,   // seguís mandando el string para el input
                    type: 'string'
                },
                currentTarget: { value: rawValue, type: "string" },
                type: 'string'
            } as React.ChangeEvent<HTMLInputElement>);
    };
    
    return (
        <div className="">
            <div
            className="textfield-filled"
            >
            <input
            maxLength={typeInput === 'date' ? 10 : undefined}
                type={typeInput}
                className={`textfield-input input-mode-actual ${messageErrors.trim().length !==0 && 'border-danger'}`}
                placeholder=" "
                required={required}
                {...props}
                style={estiloInput}
                onChange={typeInput === 'date' ? handleDateChange : onChange}
            />
                <label className={`textfield-label ${messageErrors.trim().length !==0 && 'text-danger'} ${classNameLabel}`} style={estiloLabel}>{label}{required && <span className="text-danger"> *</span>}</label>
                {renderIconos()}
            </div>
        </div>
    )
}
const renderxType = (type:typeInput)=>{
    switch (type) {
        case 'normal':
            return (
                <>
                {renderInput('text')}
                {helperText && <span className="small">{helperText}</span>}
                </>
            );
        case 'password':
            return (
                <>
                {renderInput('password')}
                {helperText && <span className="small">{helperText}</span>}
                </>
            );
        case 'date':
            return (
                <>
                {renderInputDate('date')}
                {helperText && <span className="small">{helperText}</span>}
                </>
            );
        case 'datetime':
            return (
                <>
                {renderInputDate('datetime-local')}
                {helperText && <span className="small">{helperText}</span>}
                </>
            );
        case 'multi-select':
            return (
                <>
                {renderInput('multi-select')}
                {helperText && <span className="small">{helperText}</span>}
                </>
            );
        case 'text-area':
            return (
                <>
                {renderTextArea()}
                {helperText && <span className="small">{helperText}</span>}
                </>
            );
        default:
            break;
    }
}
return (
    <div className="input-textfield m-2" >
        <div >
            {renderxType(type)}
        </div>
        {
            messageErrors.trim().length !==0 && (
                <span className="text-danger fw-bold px-2 m-0" style={{fontSize: '11px'}}>
                    {messageErrors.trim().length !==0 && messageErrors }
                </span>
            )
        }
    </div>
)
};
