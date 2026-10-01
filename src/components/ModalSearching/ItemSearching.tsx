import React from 'react'
import IconCR from '@/components/Icons/IconCR'
import { FotoEncuadrada } from '@/components/Avatar/FotoEncuadrada'
import type { AjusteFoto } from '@/components/Avatar/encuadreFoto'

const TAMANO_AVATAR = 40

type ItemSearchingProps = {
  id: number;
  nombre: string;
  dni: string;
  avatar?: string;
  /** Encuadre de la foto (x, y, zoom); sin él se muestra centrada */
  ajusteAvatar?: AjusteFoto | null;
  email?:string;
  telefono?:string;
  onClick?: (id: number) => void;
  /** Oculta id, dni, email y telefono; muestra solo avatar y nombre. */
  soloNombre?: boolean;
}

export const ItemSearching: React.FC<ItemSearchingProps> = ({ id, nombre, dni, avatar, ajusteAvatar, email, telefono, onClick, soloNombre = false }) => {
  return (
    <div
      className="d-flex align-items-center w-100 p-2 rounded-2 item-hover-actual"
      onClick={() => onClick?.(id)}
    >
      <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: TAMANO_AVATAR, height: TAMANO_AVATAR, borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--cr-input-bg)' }}>
        {avatar ? (
          <FotoEncuadrada src={avatar} alt={nombre} tamano={TAMANO_AVATAR} ajuste={ajusteAvatar} ampliable />
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
