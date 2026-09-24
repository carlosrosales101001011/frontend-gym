import { useEffect, useRef, useState } from "react";

type Option = {
  value: number | string;
  label: string;
};

type DropdownProps = {
  options: Option[];
  multiple?: boolean;
  value: Option | Option[] | null;
  onChange: (value: Option | Option[] | null) => void;
  placeholder?: string;
};

export const Dropdown = ({
  options,
  multiple = false,
  value,
  onChange,
  placeholder = "Seleccionar...",
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isSelected = (option: Option) => {
    if (multiple) {
      return (
        Array.isArray(value) &&
        value.some((v) => v.value === option.value)
      );
    }

    return (value as Option)?.value === option.value;
  };

  const handleSelect = (option: Option) => {
    if (multiple) {
      const values = Array.isArray(value) ? value : [];

      const exists = values.some((v) => v.value === option.value);

      if (exists) {
        onChange(values.filter((v) => v.value !== option.value));
      } else {
        onChange([...values, option]);
      }
    } else {
      onChange(option);
      setOpen(false);
    }
  };

  const renderLabel = () => {
    if (multiple) {
      if (!Array.isArray(value) || value.length === 0) {
        return placeholder;
      }

      return value.map((v) => v.label).join(", ");
    }

    return (value as Option)?.label || placeholder;
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        width: "250px",
      }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "6px",
          cursor: "pointer",
          background: "#fff",
        }}
      >
        {renderLabel()}
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "6px",
            background: "#fff",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              style={{
                padding: "10px",
                cursor: "pointer",
                background: isSelected(option)
                  ? "#e5e7eb"
                  : "#fff",
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};