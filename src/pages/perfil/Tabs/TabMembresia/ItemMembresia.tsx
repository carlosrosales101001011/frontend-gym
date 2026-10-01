import IconCR from '@/components/Icons/IconCR'
import { formatDate } from '@/helpers/FormatDate'
import { diasVencidos, sesionesDisponibles } from '@/helpers/diasMembresia'
import type { SeguimientoMembresiaProps } from '@/pages/SeguimientoMembresia/store/seguimientoMembresiaSlice'

/** Con 7 días o menos para vencer se avisa en amarillo */
const DIAS_AVISO = 7

type EstadoMembresia = 'activa' | 'por-vencer' | 'vencida'

const ETIQUETA_ESTADO: Record<EstadoMembresia, string> = {
  'activa': 'Activa',
  'por-vencer': 'Por vencer',
  'vencida': 'Vencida',
}

type ItemMembresiaProps = {
  membresia: SeguimientoMembresiaProps
}

/**
 * Card de una membresía del gym: estado (activa / por vencer / vencida), días de entrenamiento
 * que le quedan (o hace cuánto venció), fecha de vencimiento, comprobante de la venta y extensión actual.
 */
export const ItemMembresia = ({ membresia }: ItemMembresiaProps) => {
  const vencidaHace = diasVencidos(membresia.fecha_vencimiento)
  const diasRestantes = sesionesDisponibles(membresia.fecha_vencimiento)
  const estado: EstadoMembresia = vencidaHace > 0 ? 'vencida' : diasRestantes <= DIAS_AVISO ? 'por-vencer' : 'activa'
  const numero = estado === 'vencida' ? vencidaHace : diasRestantes
  const plural = (n: number) => (n === 1 ? 'día' : 'días')

  return (
    <div className={`item-membresia item-membresia--${estado} card-mode-actual`}>
      <div className="item-membresia__encabezado">
        <span className="item-membresia__icono">
          <IconCR name="apple" size={16} />
        </span>
        <div className="flex-grow-1 overflow-hidden">
          <div className="item-membresia__titulo">Membresía gym</div>
          <div className="item-membresia__detalle">
            {membresia.label_venta ? `Comprobante ${membresia.label_venta}` : 'Sin comprobante'}
          </div>
        </div>
        <span className="item-membresia__estado">{ETIQUETA_ESTADO[estado]}</span>
      </div>

      <div className="item-membresia__dias">
        <span className="item-membresia__numero">{numero}</span>
        <span>{estado === 'vencida' ? `${plural(numero)} de vencida` : `${plural(numero)} de entrenamiento restantes`}</span>
      </div>

      <div className="item-membresia__pie">
        <div>
          <div className="item-membresia__etiqueta">{estado === 'vencida' ? 'Venció el' : 'Vence el'}</div>
          <div className="text-capitalize">{formatDate(membresia.fecha_vencimiento, 'yyyy-mm-dd', 'DDDD dd [de] MMMM [del] yyyy')}</div>
        </div>
        {membresia.label_extension_actual && (
          <div className="text-end">
            <div className="item-membresia__etiqueta">Extensión</div>
            <div>{membresia.label_extension_actual}</div>
          </div>
        )}
      </div>
    </div>
  )
}
