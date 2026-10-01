import type { ReactNode } from 'react'

export type TabCRProps = {
  /** Clave de la pestaña (si no se pasa, se usa su posición) */
  eventKey?: string
  /** Contenido del botón de la pestaña: texto, ícono, etc. */
  title: ReactNode
  /** Deshabilita la pestaña (no se puede seleccionar) */
  disabled?: boolean
  /** Contenido del panel */
  children?: ReactNode
}

/**
 * Pestaña de TabsCR. No dibuja nada por sí sola: TabsCR lee sus props para armar el botón y el panel.
 * Solo es válida como hijo directo de TabsCR.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- las props las lee TabsCR, aquí solo se tipan
export const TabCR = (_props: TabCRProps): null => null
