import type { ReactNode } from 'react'
type props = {
    label: string,
    value: ReactNode
}
export const FieldInfo = ({label, value}:props) => {
  return (
    <div className='d-flex flex-column m-1 p-1'>
        <span className='text-secondary' style={{fontSize: '13px'}}>
            {label}
        </span>
        <span className='fw-bold' style={{fontSize: '15px'}}>
            {value}
        </span>
    </div>
  )
}
