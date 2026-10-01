import { useState } from 'react'
import { ImageCR } from '@/components/ImageCR/ImageCR'
import { AJUSTE_CENTRADO, calcularEncuadre, type AjusteFoto, type TamanoImagen } from './encuadreFoto'

type FotoEncuadradaProps = {
  src: string
  alt?: string
  /** Lado del cuadrado en px */
  tamano: number
  ajuste?: AjusteFoto | null
  className?: string
  /** Click en la foto la abre en pantalla completa (ImageCR) */
  ampliable?: boolean
}

/**
 * Muestra la foto original con su encuadre, sin modificar el archivo: la imagen se agranda y se mueve
 * con CSS dentro de un cuadrado (el círculo lo pone quien la contiene con border-radius + overflow).
 */
export const FotoEncuadrada = ({ src, alt = 'Foto', tamano, ajuste, className = '', ampliable = false }: FotoEncuadradaProps) => {
  const [natural, setNatural] = useState<TamanoImagen | null>(null)
  const encuadre = natural ? calcularEncuadre(natural, tamano, ajuste ?? AJUSTE_CENTRADO) : null

  return (
    <div className={`foto-encuadrada ${className}`} style={{ width: tamano, height: tamano }}>
      <ImageCR
        src={src}
        alt={alt}
        ampliable={ampliable}
        draggable={false}
        onLoad={(e) => setNatural({ ancho: e.currentTarget.naturalWidth, alto: e.currentTarget.naturalHeight })}
        style={encuadre ? {
          width: encuadre.ancho,
          height: encuadre.alto,
          transform: `translate(calc(-50% + ${encuadre.desplazamientoX}px), calc(-50% + ${encuadre.desplazamientoY}px))`,
        } : { visibility: 'hidden' }}
      />
    </div>
  )
}
