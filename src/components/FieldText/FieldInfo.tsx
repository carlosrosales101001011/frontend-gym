import type { ReactNode } from 'react'
type props = {
    label: string,
    value: ReactNode
    /** Margen y relleno (por defecto m-1 p-1) */
    className?: string
}
export const FieldInfo = ({label, value, className = 'm-1 p-1'}:props) => {
  return (
    <div className={`d-flex flex-column ${className}`}>
        <span className='text-secondary' style={{fontSize: '13px'}}>
            {label}
        </span>
        <span className='fw-bold' style={{fontSize: '15px'}}>
            {value}
        </span>
    </div>
  )
}
