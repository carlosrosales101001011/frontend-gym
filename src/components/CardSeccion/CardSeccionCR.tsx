import type { ReactNode } from 'react'

type CardSeccionCRProps = {
  titulo: ReactNode
  children: ReactNode
  /** Clases extra del contenedor (ej. h-100, mb-3) */
  className?: string
}

/**
 * Card de una sección (ej. "Datos personales", "Contacto"): título con fondo negro y texto blanco, y el contenido
 * debajo con el fondo del tema.
 */
export const CardSeccionCR = ({ titulo, children, className = '' }: CardSeccionCRProps) => (
  <div className={`card-mode-actual rounded overflow-hidden ${className}`}>
    <div className="bg-black text-white fw-bold px-3 py-2">{titulo}</div>
    <div className="p-3">{children}</div>
  </div>
)
