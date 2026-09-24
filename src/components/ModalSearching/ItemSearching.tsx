import React from 'react'
import IconCR from '@/components/Icons/IconCR'

type ItemSearchingProps = {
  id: number;
  nombre: string;
  dni: string;
  avatar?: string;
  email?:string;
  telefono?:string;
  onClick?: (id: number) => void;
  /** Oculta id, dni, email y telefono; muestra solo avatar y nombre. */
  soloNombre?: boolean;
}

export const ItemSearching: React.FC<ItemSearchingProps> = ({ id, nombre, dni, avatar, email, telefono, onClick, soloNombre = false }) => {
  return (
    <div
      className="d-flex align-items-center w-100 p-2 rounded-2 item-hover-actual"
      onClick={() => onClick?.(id)}
    >
      <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--cr-input-bg)' }}>
        {avatar ? (
          <img src={avatar} alt={nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <IconCR name="user" size={18} />
        )}
      </div>
      <div className="mx-2 flex-grow-1">
        <div className="fw-bold color-mode-actual" style={{ fontSize: '14px' }}>{nombre}</div>
        {!soloNombre && (
          <div className=" color-mode-actual" style={{ fontSize: '12px' }}>{dni.trim().length===0?``:`DNI: ${dni}`}, {email?.trim().length===0?'':`Email: ${email}`}, {telefono?.trim().length===0?'':`Telefono: ${telefono}`}</div>
        )}
      </div>
      {!soloNombre && (
        <div className=" color-mode-actual" style={{ fontSize: '12px' }}>#{id}</div>
      )}
    </div>
  )
}
