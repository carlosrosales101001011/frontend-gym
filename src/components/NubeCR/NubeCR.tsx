import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import classNames from 'classnames'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'

type NubeCRProps = {
  /** Botón que abre la nube; recibe si está abierta y los props de accesibilidad para el <button> */
  trigger: (props: { abierta: boolean, ariaProps: Record<string, string | boolean> }) => ReactNode
  titulo?: ReactNode
  /** Contenido de la nube (módulos, notificaciones, ...); como función recibe `cerrar` */
  children: ReactNode | ((cerrar: () => void) => ReactNode)
  /** Se llama cada vez que se abre (ej. para pedir los datos al servidor) */
  onAbrir?: () => void
  /** Muestra un loading encima del contenido */
  cargando?: boolean
  textoCargando?: string
  /** Lado del trigger al que se alinea la nube */
  alinear?: 'inicio' | 'fin'
  ancho?: number
}

/** Tiempo para cruzar del botón a la nube sin que se cierre */
const RETRASO_CIERRE_MS = 200

/**
 * Nube flotante (popover) que se abre al pasar el mouse por su trigger (o al llegar con Tab) y se cierra
 * al salir el mouse, con Escape, con click fuera o cuando el foco sale de ella. No tiene contenido propio: cada uso pone el suyo
 * (Mis módulos, notificaciones, ...). Estilos en _NubeCR.scss.
 */
export const NubeCR = ({ trigger, titulo, children, onAbrir, cargando = false, textoCargando = 'Cargando', alinear = 'fin', ancho = 360 }: NubeCRProps) => {
  const [abierta, setAbierta] = useState(false)
  const contenedorRef = useRef<HTMLDivElement>(null)
  const temporizadorCierre = useRef<number | undefined>(undefined)
  const idNube = useId()

  const cancelarCierre = () => window.clearTimeout(temporizadorCierre.current)
  const abrir = () => {
    cancelarCierre()
    if (abierta) return
    setAbierta(true)
    onAbrir?.()
  }
  // Solo estado (sin refs): se le pasa al contenido; un cierre con retraso pendiente no afecta
  const cerrar = () => setAbierta(false)
  const cerrarConRetraso = () => {
    cancelarCierre()
    temporizadorCierre.current = window.setTimeout(() => setAbierta(false), RETRASO_CIERRE_MS)
  }

  useEffect(() => cancelarCierre, [])

  // Cierra con click fuera o Escape
  useEffect(() => {
    if (!abierta) return
    const alClickFuera = (e: MouseEvent) => {
      if (!contenedorRef.current?.contains(e.target as Node)) setAbierta(false)
    }
    const alEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierta(false)
    }
    document.addEventListener('mousedown', alClickFuera)
    document.addEventListener('keydown', alEscape)
    return () => {
      document.removeEventListener('mousedown', alClickFuera)
      document.removeEventListener('keydown', alEscape)
    }
  }, [abierta])

  return (
    <div
      ref={contenedorRef}
      className="nube-cr"
      onMouseEnter={abrir}
      onMouseLeave={cerrarConRetraso}
      // Con teclado: se abre al llegar con Tab (con el mouse ya se abrió al pasar por encima)
      onFocus={abrir}
      // Se cierra cuando el foco se va a algo fuera de la nube (ej. Tab)
      onBlur={(e) => {
        if (e.relatedTarget && !contenedorRef.current?.contains(e.relatedTarget as Node)) cerrar()
      }}
    >
      {trigger({ abierta, ariaProps: { 'aria-haspopup': 'dialog', 'aria-expanded': abierta, 'aria-controls': idNube } })}
      {abierta && (
        <div
          id={idNube}
          role="dialog"
          className={classNames('nube-cr__panel card-mode-actual', `nube-cr__panel--${alinear}`)}
          style={{ width: ancho }}
        >
          {titulo && <div className="nube-cr__titulo">{titulo}</div>}
          <div className="nube-cr__contenido scroll-mode-actual">
            <LoadingOverlay show={cargando} interno texto={textoCargando} />
            {typeof children === 'function' ? children(cerrar) : children}
          </div>
        </div>
      )}
    </div>
  )
}
