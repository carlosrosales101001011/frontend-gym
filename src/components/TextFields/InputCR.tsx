import React from "react";
import type { HTMLInputTypeAttribute, InputHTMLAttributes, ReactNode } from 'react'
// import classNames from "classnames";

type typeInput='normal-select'| 'multi-select' | 'normal' | 'date'| 'datetime' | 'password' | 'text-area'
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
}
export const InputCR: React.FC<TextLabelProps> = ({
label,
type= 'normal',
helperText,
LabelColor,
required = false,
messageErrors='',
onChange,
...props
}) => {
const classNameLabel = `${LabelColor}`;
// const onFocusInput = ()=>{
//     setisFocusableSelect(!isFocusableSelect)
// }

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
            onChange={onChange}
        />
            <label className={`textfield-label ${messageErrors.trim().length !==0 && 'text-danger'} ${classNameLabel}`}>{label}{required && <span className="text-danger"> *</span>}</label>
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
                onChange={typeInput === 'date' ? handleDateChange : onChange}
            />
                <label className={`textfield-label ${messageErrors.trim().length !==0 && 'text-danger'} ${classNameLabel}`}>{label}{required && <span className="text-danger"> *</span>}</label>
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
    <div className="input-textfield" >
        <div >
            {renderxType(type)}
        </div>
        <span className="text-danger fw-bold px-2 m-0" style={{fontSize: '11px'}}>
            {messageErrors.trim().length !==0 && messageErrors }
        </span>
    </div>
)
};
