import React from 'react'
import type { InputHTMLAttributes } from 'react'
import IconCR from '@/components/Icons/IconCR'

interface InputSearcherCRProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSearch?: (value: string) => void;
}

export const InputSearcherCR: React.FC<InputSearcherCRProps> = ({
  placeholder = 'Buscar...',
  onSearch,
  className = '',
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value)
  }

  return (
    <div className="bg-actual w-100" style={{width: '100%'}}>
      <div  style={{ position: 'relative', width: '100%' }}>
        <input
          type="text"
          className={`textfield-input input-mode-actual ${className}`}
          style={{ paddingRight: '34px', width: '100%' }}
          placeholder={placeholder}
          onChange={handleChange}
          {...props}
        />
        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <IconCR name="search" size={16} />
        </span>
      </div>
    </div>
  )
}
