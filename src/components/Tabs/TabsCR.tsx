import { Children, isValidElement, useId, useRef, useState, type KeyboardEvent, type ReactElement, type ReactNode } from 'react'
import classNames from 'classnames'
import type { TabCRProps } from './TabCR'

export type TabsCRProps = {
  children?: ReactNode
  /** Pestaña activa (modo controlado, junto con onSelect) */
  activeKey?: string
  /** Pestaña activa al inicio (modo no controlado). Si no existe, se usa la primera habilitada */
  defaultActiveKey?: string
  /** Se llama al elegir una pestaña */
  onSelect?: (key: string) => void
  /** "linea": subrayado primario (por defecto) · "pildora": fondo primario */
  variant?: 'linea' | 'pildora'
  /** Monta cada panel recién la primera vez que se abre (por defecto se montan todos y se ocultan los inactivos) */
  mountOnEnter?: boolean
  /** Prefijo de los ids de accesibilidad (si no se pasa, se genera) */
  id?: string
  className?: string
}

type PestanaInterna = TabCRProps & { key: string }

/**
 * Pestañas propias del proyecto (sin react-bootstrap).
 * - Por defecto todos los paneles quedan montados y los inactivos ocultos: los formularios no pierden lo escrito.
 * - Teclado: ← → cambian de pestaña, Inicio/Fin van a la primera/última (se saltan las deshabilitadas).
 * - Accesible: role tablist/tab/tabpanel con aria-selected / aria-controls.
 * Estilos en assets/scss/custom/components/_TabsCR.scss.
 */
export const TabsCR = ({
  children,
  activeKey,
  defaultActiveKey,
  onSelect,
  variant = 'linea',
  mountOnEnter = false,
  id,
  className,
}: TabsCRProps) => {
  const idGenerado = useId()
  const prefijo = id ?? `tabs-cr-${idGenerado.replace(/:/g, '')}`
  const botones = useRef<(HTMLButtonElement | null)[]>([])

  const pestanas: PestanaInterna[] = (Children.toArray(children).filter(isValidElement) as ReactElement<TabCRProps>[])
    .map((tab, i) => ({ ...tab.props, key: tab.props.eventKey ?? String(i) }))
  const habilitadas = pestanas.filter((pestana) => !pestana.disabled)
  const claveValida = (clave?: string) => (clave !== undefined && habilitadas.some((p) => p.key === clave) ? clave : undefined)

  const [claveInterna, setClaveInterna] = useState<string | undefined>(() => claveValida(defaultActiveKey) ?? habilitadas[0]?.key)
  const controlado = activeKey !== undefined
  // Si la clave pedida no existe (o está deshabilitada), se muestra la primera habilitada
  const claveActiva = claveValida(controlado ? activeKey : claveInterna) ?? habilitadas[0]?.key

  // Paneles ya abiertos al menos una vez (para mountOnEnter)
  const [visitadas, setVisitadas] = useState<Set<string>>(() => new Set(claveActiva ? [claveActiva] : []))
  if (claveActiva && !visitadas.has(claveActiva)) setVisitadas(new Set(visitadas).add(claveActiva))

  const seleccionar = (clave: string) => {
    if (!controlado) setClaveInterna(clave)
    onSelect?.(clave)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const indiceActual = habilitadas.findIndex((p) => p.key === claveActiva)
    const destino: Record<string, number> = {
      ArrowRight: (indiceActual + 1) % habilitadas.length,
      ArrowLeft: (indiceActual - 1 + habilitadas.length) % habilitadas.length,
      Home: 0,
      End: habilitadas.length - 1,
    }
    if (!(e.key in destino) || habilitadas.length === 0) return
    e.preventDefault()
    const siguiente = habilitadas[destino[e.key]]
    seleccionar(siguiente.key)
    botones.current[pestanas.indexOf(siguiente)]?.focus()
  }

  return (
    <div className={classNames('tabs-cr', `tabs-cr--${variant}`, className)}>
      <div className="tabs-cr__lista" role="tablist">
        {pestanas.map((pestana, i) => {
          const activa = pestana.key === claveActiva
          return (
            <button
              key={pestana.key}
              ref={(el) => { botones.current[i] = el }}
              type="button"
              role="tab"
              id={`${prefijo}-tab-${pestana.key}`}
              aria-selected={activa}
              aria-controls={`${prefijo}-panel-${pestana.key}`}
              tabIndex={activa ? 0 : -1}
              disabled={pestana.disabled}
              className={classNames('tabs-cr__tab', { 'tabs-cr__tab--activa': activa })}
              onClick={() => seleccionar(pestana.key)}
              onKeyDown={onKeyDown}
            >
              {pestana.title}
            </button>
          )
        })}
      </div>
      {pestanas.map((pestana) => {
        const activa = pestana.key === claveActiva
        if (mountOnEnter && !visitadas.has(pestana.key)) return null
        return (
          <div
            key={pestana.key}
            role="tabpanel"
            id={`${prefijo}-panel-${pestana.key}`}
            aria-labelledby={`${prefijo}-tab-${pestana.key}`}
            hidden={!activa}
            className="tabs-cr__panel"
          >
            {pestana.children}
          </div>
        )
      })}
    </div>
  )
}
