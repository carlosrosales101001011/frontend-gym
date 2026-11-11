import { useEffect, useSyncExternalStore } from 'react'
import IconCR, { type IconName } from '@/components/Icons/IconCR'
import { obtenerAlertas, POSITION_DEFAULT, quitarAlerta, suscribirAlertas, type AlertaProps, type PositionAlerta, type VarianteAlerta } from './alertas'

const ESTILO_VARIANTE: Record<VarianteAlerta, { fondo: string, icono: IconName }> = {
  warning: { fondo: 'bg-warning', icono: 'warning' },
  success: { fondo: 'bg-success', icono: 'check' },
  error: { fondo: 'bg-danger', icono: 'times' },
}

const CLASES_POSITION: Record<PositionAlerta, string> = {
  'top-left': 'top-0 start-0',
  top: 'top-0 start-50 translate-middle-x',
  'top-right': 'top-0 end-0',
  left: 'top-50 start-0 translate-middle-y',
  center: 'top-50 start-50 translate-middle',
  right: 'top-50 end-0 translate-middle-y',
  'bottom-left': 'bottom-0 start-0',
  bottom: 'bottom-0 start-50 translate-middle-x',
  'bottom-right': 'bottom-0 end-0',
}

type AlertaCRProps = AlertaProps & {
  /** Al cumplirse tiempoEnPantalla */
  onClose?: () => void
}

/** Oscurece la pantalla mientras hay alertas: tampoco deja hacer click detrás */
const OverlayAlertas = () => (
  <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1999, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
)

/** Lugar de la pantalla donde se apilan las alertas, encima de los modales */
const ZonaAlertas = ({ position, children }: { position: PositionAlerta, children: React.ReactNode }) => (
  <div className={`position-fixed ${CLASES_POSITION[position]} p-3 d-flex flex-column gap-2`} style={{ zIndex: 2000 }}>
    {children}
  </div>
)

/** Ícono a la izquierda y concepto a la derecha, del color de la variante. Se cierra sola (por defecto a los 3 segundos) */
const TarjetaAlerta = ({ variante, concepto, tiempoEnPantalla = 3, onClose }: AlertaCRProps) => {
  const { fondo, icono } = ESTILO_VARIANTE[variante]

  useEffect(() => {
    const espera = setTimeout(() => onClose?.(), tiempoEnPantalla * 1000)
    return () => clearTimeout(espera)
  }, [tiempoEnPantalla])

  return (
    <div role="alert" className={`${fondo} rounded shadow d-flex align-items-center gap-4 px-5 py-4 fw-bold`} style={{ minWidth: 'min(480px, calc(100vw - 2rem))', maxWidth: 'calc(100vw - 2rem)' }}>
      <IconCR name={icono} size={44} className="flex-shrink-0" />
      <span style={{ fontSize: 20 }}>{concepto}</span>
    </div>
  )
}

/** Alerta suelta dentro de un componente; desde hooks o para que siga visible al cambiar de página, usar mostrarAlerta() */
export const AlertaCR = ({ position = POSITION_DEFAULT, ...alerta }: AlertaCRProps) => (
  <>
    <OverlayAlertas />
    <ZonaAlertas position={position}>
      <TarjetaAlerta {...alerta} />
    </ZonaAlertas>
  </>
)

/** Alertas de mostrarAlerta(), agrupadas por position. Va una sola vez, en App */
export const ContenedorAlertasCR = () => {
  const alertas = useSyncExternalStore(suscribirAlertas, obtenerAlertas)
  const positions = [...new Set(alertas.map(({ position = POSITION_DEFAULT }) => position))]
  if (alertas.length === 0) return null
  return (
    <>
      <OverlayAlertas />
      {positions.map((position) => (
        <ZonaAlertas key={position} position={position}>
          {alertas
            .filter((alerta) => (alerta.position ?? POSITION_DEFAULT) === position)
            .map(({ id, ...alerta }) => <TarjetaAlerta key={id} {...alerta} onClose={() => quitarAlerta(id)} />)}
        </ZonaAlertas>
      ))}
    </>
  )
}
