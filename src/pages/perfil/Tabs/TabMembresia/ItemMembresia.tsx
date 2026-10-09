import { useState } from 'react'
import { format, parseISO, subDays } from 'date-fns'
import IconCR, { type IconName } from '@/components/Icons/IconCR'
import { formatDate } from '@/helpers/FormatDate'
import { diasVencidos, sesionesDisponibles } from '@/helpers/diasMembresia'
import type { MembresiaDetalleProps } from './types'
import { ModalDetalleMembresia, type DetalleMembresia } from './ModalDetalleMembresia'

/** Con 7 días o menos para vencer se avisa en amarillo */
const DIAS_AVISO = 7

type EstadoMembresia = 'activa' | 'por-vencer' | 'vencida'

const ETIQUETA_ESTADO: Record<EstadoMembresia, string> = {
  'activa': 'Activa',
  'por-vencer': 'Por vencer',
  'vencida': 'Vencida',
}

type ItemMembresiaProps = {
  membresia: MembresiaDetalleProps
  /** Tras registrar un congelamiento o regalo desde su modal (ej. para recargar las membresías) */
  onCambio: () => void
}

const FORMATO_FECHA_LARGA = 'DDDD dd [de] MMMM [del] yyyy'

/** "1 Meses" -> "1 mes", "3 Meses" -> "3 meses"; sin plan -> "" */
const textoPlan = (label_plan: string | null) => {
  const meses = parseInt(label_plan ?? '', 10)
  if (Number.isNaN(meses)) return label_plan ?? ''
  return `${meses} ${meses === 1 ? 'mes' : 'meses'}`
}

/**
 * Card de una membresía del gym: estado (activa / por vencer / vencida), días de entrenamiento
 * que le quedan (o hace cuánto venció), "[programa], [plan]" como título con el horario debajo,
 * congelamiento y citas de nutrición (disponibles / regalados) extensión actual y, en el pie, inicio y vencimiento
 * (con días sumados: "fin de la venta + días" en gris sobre el vencimiento).
 * Regalo, congelamiento y citas abren un modal con su detalle (congelamiento y regalo se pueden registrar ahí).
 */
export const ItemMembresia = ({ membresia, onCambio }: ItemMembresiaProps) => {
  const [detalleAbierto, setDetalleAbierto] = useState<DetalleMembresia | null>(null)
  const vencidaHace = diasVencidos(membresia.fecha_vencimiento)
  const diasRestantes = sesionesDisponibles(membresia.fecha_vencimiento)
  const estado: EstadoMembresia = vencidaHace > 0 ? 'vencida' : diasRestantes <= DIAS_AVISO ? 'por-vencer' : 'activa'
  const numero = estado === 'vencida' ? vencidaHace : diasRestantes
  const plural = (n: number) => (n === 1 ? 'día' : 'días')
  // Días que se sumaron a la fecha fin de la venta para llegar al vencimiento (regalo + congelamientos)
  const diasSumados = membresia.dias_regalo + membresia.dias_congelados
  // vencimiento = fecha fin de la venta + días corridos de las extensiones -> se resta para obtenerla
  const fechaFinVenta = format(subDays(parseISO(membresia.fecha_vencimiento), diasSumados), 'yyyy-MM-dd')

  return (
    <div className={`item-membresia item-membresia--${estado} card-mode-actual`}>
      <div className="item-membresia__encabezado">
        <span className="item-membresia__icono">
          <IconCR name="apple" size={16} />
        </span>
        <div className="flex-grow-1 overflow-hidden">
          <div className="item-membresia__titulo">
            {[membresia.label_programa || 'Membresía gym', textoPlan(membresia.label_plan)].filter(Boolean).join(', ')}
          </div>
          <div className="item-membresia__detalle">
            {membresia.label_horario ? `Horario ${membresia.label_horario}` : 'Sin horario'}
          </div>
        </div>
        <span className="item-membresia__estado">{ETIQUETA_ESTADO[estado]}</span>
      </div>

      <div className="item-membresia__dias">
        <span className="item-membresia__numero">{numero}</span>
        <span>{estado === 'vencida' ? `${plural(numero)} de vencida` : `${plural(numero)} de entrenamiento restantes`}</span>
      </div>

      <div className="item-membresia__pie">
        {/* Dos columnas: etiquetas (Inicia el / Vence el) y sus fechas */}
        <div className="item-membresia__fechas">
          {membresia.fecha_inicio && (
            <>
              <div className="item-membresia__etiqueta">{estado === 'vencida' ? 'Inició el' : 'Inicia el'}</div>
              <div className="text-capitalize">{formatDate(membresia.fecha_inicio, 'yyyy-mm-dd', FORMATO_FECHA_LARGA)}</div>
            </>
          )}
          <div className="item-membresia__etiqueta">{estado === 'vencida' ? 'Venció el' : 'Vence el'}</div>
          <div>
            {/* Con días sumados: "fecha fin de la venta + días" en gris (días en rojo) */}
            {diasSumados > 0 && (
              <div className="item-membresia__etiqueta">
                <span className="text-capitalize">{formatDate(fechaFinVenta, 'yyyy-mm-dd', FORMATO_FECHA_LARGA)}</span>
                <span className="item-membresia__extra" title="Días de regalo y congelamiento"> + {diasSumados} {plural(diasSumados)}</span>
              </div>
            )}
            <div className="text-capitalize">{formatDate(membresia.fecha_vencimiento, 'yyyy-mm-dd', FORMATO_FECHA_LARGA)}</div>
          </div>
        </div>
        <div className="item-membresia__cupos">
          {/* La de regalo ya se ve en "Regalo" */}
          {membresia.label_extension_actual && membresia.label_extension_actual !== 'Regalo' && (
            <div className="text-end">
              <div className="item-membresia__etiqueta">Extensión</div>
              <div>{membresia.label_extension_actual}</div>
            </div>
          )}
          {/* Siempre a la vista: desde su modal se registra el primer regalo */}
          <button type="button" className="item-membresia__cupo" onClick={() => setDetalleAbierto('regalo')} title="Ver y registrar regalos">
            <span className="item-membresia__cupo-icono">
              <IconCR name="regalo" size={14} />
            </span>
            <div>
              <div className="item-membresia__etiqueta">Regalo</div>
              {membresia.dias_regalo > 0
                ? <div><strong>{membresia.dias_regalo}</strong> {plural(membresia.dias_regalo)}</div>
                : <div className="opacity-50">Sin regalo</div>}
            </div>
          </button>
          {/* Congelamiento: días ya congelados de los regalados (empieza en 0 y sube con cada congelamiento) */}
          <CupoMembresia
            icono="freeze"
            etiqueta="Congelamiento"
            valor={membresia.dias_congelados}
            regalados={membresia.congelamiento_regalados}
            unidad="días"
            onClick={() => setDetalleAbierto('congelamiento')}
          />
          {/* Citas: atendidas de las regaladas (empieza en 0 y sube con cada cita atendida) */}
          <CupoMembresia
            icono="apple"
            etiqueta="Citas nutricionista"
            valor={membresia.citas_atendidas}
            regalados={membresia.citas_regaladas}
            unidad="citas"
            onClick={() => setDetalleAbierto('citas')}
          />
        </div>
      </div>
      {detalleAbierto && (
        <ModalDetalleMembresia
          detalle={detalleAbierto}
          membresia={membresia}
          show
          onHide={() => setDetalleAbierto(null)}
          onRegistrado={onCambio}
        />
      )}
    </div>
  )
}

type CupoMembresiaProps = {
  icono: IconName
  etiqueta: string
  /** Número de la izquierda: lo ya usado (días congelados o citas atendidas) */
  valor: number
  regalados: number
  unidad: string
  onClick: () => void
}

/** Ícono + etiqueta y "[valor] / [regalados] unidad" (sin regalo -> "Sin regalo"), en el pie a la derecha */
const CupoMembresia = ({ icono, etiqueta, valor, regalados, unidad, onClick }: CupoMembresiaProps) => (
  <button type="button" className="item-membresia__cupo" onClick={onClick} title={`Ver ${etiqueta.toLowerCase()}`}>
    <span className="item-membresia__cupo-icono">
      <IconCR name={icono} size={14} />
    </span>
    <div>
      <div className="item-membresia__etiqueta">{etiqueta}</div>
      {regalados > 0
        ? <div><strong>{valor}</strong> / {regalados} {unidad}</div>
        : <div className="opacity-50">Sin regalo</div>}
    </div>
  </button>
)
