import type { ButtonHTMLAttributes, MouseEvent, ReactElement } from "react";
import { Button } from "react-bootstrap";
import type { ButtonVariant } from "react-bootstrap/esm/types";

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>,
  className?: string,
  label?: string | ReactElement;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  id?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const ButtonCR: React.FC<AppButtonProps> = ({
  label,
  icon,
  iconPosition = "left",
  className,
  onClick,
  variant,
  id,
  ref,
  type='button',
  disabled
}) => {

  return (
    <Button
      ref={ref}
      type={type}
      id={id}
      variant={variant}
      disabled={disabled}
      className={`${className} m-1 d-inline-flex align-items-center justify-content-center gap-2`}
      style={{padding: '4px 8px'}}
      onClick={onClick}
    >
      {icon && iconPosition === "left" && icon}
      <div className="" style={{fontSize: '13px'}}>
        {label}
      </div>
      {icon && iconPosition === "right" && icon}
    </Button>
  );
};
