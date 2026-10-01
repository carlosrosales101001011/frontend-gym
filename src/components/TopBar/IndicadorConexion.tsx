import IconCR, { type IconName } from '@/components/Icons/IconCR'
import { useConexion, type EstadoConexion } from '@/hook/useConexion'

const PRESENTACION: Record<EstadoConexion, { icono: IconName, texto: string }> = {
  'buena': { icono: 'wifi', texto: 'Conexión estable' },
  'lenta': { icono: 'wifiLento', texto: 'Conexión lenta' },
  'sin-conexion': { icono: 'wifiOff', texto: 'Sin conexión' },
}

/** Ícono de wifi del Topbar: verde con conexión, amarillo si está lenta y rojo sin conexión */
export const IndicadorConexion = () => {
  const estado = useConexion()
  const { icono, texto } = PRESENTACION[estado]
  return (
    <span className="topbar__conexion" role="status" title={texto} aria-label={texto}>
      <IconCR name={icono} size={18} className={`topbar__conexion--${estado}`} />
    </span>
  )
}
