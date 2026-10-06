import { Children, type DragEvent, type ReactNode } from 'react'
import IconCR, { type IconName } from '@/components/Icons/IconCR'

/*
 * Piezas de los modales de asignación en dos columnas ("lo mío" → "lo del usuario"), con arrastre y flechas.
 * Las usan Módulos por usuario y Secciones por módulo. Estilos: .modulos-usuario__* en _gestionModulosUsuario.scss.
 */

type ColumnaAsignacionProps = {
  titulo: string
  total: number
  /** Se está arrastrando una tarjeta encima */
  sobre: boolean
  cargando?: boolean
  vacio: string
  children: ReactNode
  onDragOver: (e: DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: DragEvent) => void
}

/** Columna: zona donde se sueltan las tarjetas */
export const ColumnaAsignacion = ({ titulo, total, sobre, cargando = false, vacio, children, ...zona }: ColumnaAsignacionProps) => {
  // Aplana las listas de tarjetas y descarta los null para saber si quedó vacía
  const tarjetas = Children.toArray(children)
  return (
    <section className={`modulos-usuario__columna ${sobre ? 'modulos-usuario__columna--sobre' : ''}`} {...zona}>
      <header className="modulos-usuario__columna-titulo">
        {titulo} <span className="modulos-usuario__contador">{total}</span>
      </header>
      <div className="modulos-usuario__lista">
        {cargando
          ? Array.from({ length: 3 }, (_, i) => <span key={i} className="skeleton-cr" style={{ height: 44 }} />)
          : tarjetas.length ? tarjetas : <p className="modulos-usuario__vacio">{vacio}</p>}
      </div>
    </section>
  )
}

type TarjetaAsignableProps = {
  icono: string
  label: string
  /** Tooltip del nombre */
  descripcion?: string
  /** Botones a la derecha */
  accion?: ReactNode
  /** Botón a la izquierda (la flecha para devolverla) */
  accionInicio?: ReactNode
  bloqueado?: boolean
  arrastrandose?: boolean
  draggable?: boolean
  onDragStart?: (e: DragEvent) => void
  onDragEnd?: () => void
}

/** Tarjeta con ícono y nombre; se arrastra salvo que esté bloqueada */
export const TarjetaAsignable = ({ icono, label, descripcion, accion, accionInicio, bloqueado = false, arrastrandose = false, draggable = false, ...eventos }: TarjetaAsignableProps) => (
  <div
    className={`modulos-usuario__tarjeta ${bloqueado ? 'modulos-usuario__tarjeta--bloqueada' : ''} ${arrastrandose ? 'modulos-usuario__tarjeta--arrastrando' : ''}`}
    draggable={draggable && !bloqueado}
    {...(bloqueado ? {} : eventos)}
  >
    {!bloqueado && <span className="modulos-usuario__agarre"><IconCR name="arrastrar" size={16} className="" /></span>}
    {accionInicio}
    <span className="modulos-usuario__icono icono-modulo">
      <IconCR name={(icono || 'no-icon') as IconName} size={16} className="" />
    </span>
    <span className="modulos-usuario__nombre" title={descripcion}>{label}</span>
    <span className="modulos-usuario__acciones">{accion}</span>
  </div>
)

/** Candado de una tarjeta bloqueada (algo del usuario que quien administra no tiene) */
export const CandadoAsignacion = ({ titulo }: { titulo: string }) => (
  <span className="modulos-usuario__candado" title={titulo}><IconCR name="lock" size={12} className="" /></span>
)

type BotonIconoProps = {
  icono: IconName
  titulo: string
  onClick: () => void
  activo?: boolean
  disabled?: boolean
}

export const BotonIcono = ({ icono, titulo, onClick, activo, disabled }: BotonIconoProps) => (
  <button type="button" className={`modulos-usuario__boton ${activo ? 'modulos-usuario__boton--activo' : ''}`}
    onClick={onClick} disabled={disabled} title={titulo} aria-label={titulo} aria-pressed={activo}>
    <IconCR name={icono} size={16} className="" />
  </button>
)
