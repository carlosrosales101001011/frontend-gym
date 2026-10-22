import { useEffect } from 'react'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import ModalCR from '@/components/Modal/ModalCR'
import { DataTableSimple2, type ColumnaSimple2 } from '@/components/DataTableSimple/DataTableSimple2'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { formatDate } from '@/helpers/FormatDate'
import { useReporteAsistenciaStore } from '../hook/useReporteAsistenciaStore'
import { useClientesResumenReporte, type ClienteResumenProps } from '../hook/useClientesResumenReporte'
import type { AsistenciaReporteProps } from '../store/reporteAsistenciaSlice'
import {
  asistenciasDeLaHora,
  asistenciasDelDia,
  asistenciasDelDiaSemana,
  detalleClientesAsistidos,
  diasDelRango,
  franjaHora,
  horaPico,
  pluralDiaSemana,
  type NivelFrecuencia,
} from '../helpers/resumenAsistencia'

/**
 * Card del reporte cuyos clientes se listan (dia_semana: una de las cards de lunes a sábado, ver diaSemana;
 * dia: un punto del gráfico de asistidos por día, ver fecha)
 */
export type CardClientes = 'asistidos' | 'hora_pico' | NivelFrecuencia | 'sin_asistir' | 'en_riesgo' | 'criticos' | 'nunca' | 'dia_semana' | 'dia'

const TITULO: Record<Exclude<CardClientes, 'dia_semana' | 'dia' | 'hora_pico'>, string> = {
  asistidos: 'Clientes asistidos',
  frecuentes: 'Clientes frecuentes',
  regulares: 'Clientes regulares',
  baja: 'Clientes de baja frecuencia',
  sin_asistir: 'Clientes sin asistir',
  en_riesgo: 'Clientes en riesgo',
  criticos: 'Clientes críticos',
  nunca: 'Clientes que nunca asistieron',
}

/** Cards cuyos clientes vienen del backend (el resumen de membresías vigentes) y cómo se filtran */
const FILTRO_RESUMEN: Partial<Record<CardClientes, (c: ClienteResumenProps) => boolean>> = {
  sin_asistir: (c) => c.sin_asistir,
  en_riesgo: (c) => c.en_riesgo,
  criticos: (c) => c.critico,
  nunca: (c) => c.nunca_asistio,
}

const fechaHora = (valor: string) => formatDate(new Date(valor), 'yyyy-mm-dd', 'dd/mm/yyyy hh:mm')
const sinDato = <span className="opacity-50">—</span>

const columnaCliente = <T extends { label_nombres_apellidos_persona: string }>(): ColumnaSimple2<T> => ({
  id: 'cliente', header: 'Cliente',
  render: (c) => c.label_nombres_apellidos_persona,
  searchValue: (c) => c.label_nombres_apellidos_persona,
  sortValue: (c) => c.label_nombres_apellidos_persona,
})

/** Una fila por asistencia (ya es 1 por cliente por día): cliente y fecha y hora en que llegó */
const columnasAsistencias: ColumnaSimple2<AsistenciaReporteProps>[] = [
  columnaCliente<AsistenciaReporteProps>(),
  {
    id: 'fecha', header: 'Fecha y hora',
    render: (a) => fechaHora(a.fecha_registro),
    sortValue: (a) => a.fecha_registro,
  },
]

type ModalClientesReporteProps = {
  /** null = cerrado */
  card: CardClientes | null
  onHide: () => void
  /** Con card 'dia_semana': el día (getDay, 1 = lunes) y su nombre ("Lunes") */
  diaSemana?: { dia: number, nombre: string }
  /** Con card 'dia': yyyy-mm-dd */
  fecha?: string
}

/**
 * Clientes de una card del reporte, en una tabla con buscador. Las cards que salen de las asistencias listan cada
 * asistencia (cliente y fecha y hora); las del resumen de membresías, cada cliente con su última asistencia.
 */
export const ModalClientesReporte = ({ card, onHide, diaSemana, fecha }: ModalClientesReporteProps) => {
  const { asistencias, filtros } = useReporteAsistenciaStore()
  const { clientes, cargando, obtenerClientes } = useClientesResumenReporte()
  const filtroResumen = card ? FILTRO_RESUMEN[card] : undefined
  const dias = diasDelRango(filtros.fecha_inicio, filtros.fecha_fin)
  const pico = horaPico(asistencias, dias)

  useEffect(() => {
    if (filtroResumen) obtenerClientes(filtros)
  }, [card])

  // Días sin asistir hasta la fecha fin (o hoy), como en el resumen
  const referencia = filtros.fecha_fin ? parseISO(filtros.fecha_fin) : new Date()
  const columnasResumen: ColumnaSimple2<ClienteResumenProps>[] = [
    columnaCliente<ClienteResumenProps>(),
    {
      id: 'ultima', header: 'Última asistencia',
      render: (c) => c.ultima_asistencia ? fechaHora(c.ultima_asistencia) : sinDato,
      sortValue: (c) => c.ultima_asistencia ?? '',
    },
    {
      id: 'dias-sin', header: 'Días sin asistir',
      render: (c) => c.ultima_asistencia
        ? <strong>{differenceInCalendarDays(referencia, new Date(c.ultima_asistencia))}</strong>
        : sinDato,
      sortValue: (c) => c.ultima_asistencia ? differenceInCalendarDays(referencia, new Date(c.ultima_asistencia)) : Infinity,
    },
    { id: 'en-rango', header: 'Días asistidos en el rango', render: (c) => c.asistencias_en_rango, sortValue: (c) => c.asistencias_en_rango },
  ]

  /** Asistencias de la card (más reciente primero) */
  const asistenciasCard = (): AsistenciaReporteProps[] => {
    if (card === 'dia_semana') return diaSemana ? asistenciasDelDiaSemana(asistencias, diaSemana.dia) : []
    if (card === 'dia') return fecha ? asistenciasDelDia(asistencias, fecha) : []
    if (card === 'hora_pico') return pico ? asistenciasDeLaHora(asistencias, pico.hora) : []
    if (card === 'asistidos') return asistencias
    // Frecuentes / regulares / baja: todas las asistencias de los clientes de ese nivel
    const ids = new Set(detalleClientesAsistidos(asistencias, dias).filter((c) => c.nivel === card).map((c) => c.id_persona))
    return asistencias.filter((a) => ids.has(a.id_persona))
  }

  const titulo = !card ? ''
    : card === 'dia_semana' ? `Clientes que asistieron los ${pluralDiaSemana(diaSemana?.nombre ?? '')}`
    : card === 'dia' ? `Clientes que asistieron el ${fecha ? formatDate(fecha, 'yyyy-mm-dd', 'DDDD dd [de] MMMM [del] yyyy') : ''}`
    : card === 'hora_pico' ? `Clientes en la hora pico${pico ? ` (${franjaHora(pico.hora)})` : ''}`
    : TITULO[card]

  return (
    <ModalCR show={!!card} onHide={onHide} size="lg" position="center">
      <ModalCR.Header>
        <ModalCR.Title>{titulo}</ModalCR.Title>
      </ModalCR.Header>
      <ModalCR.Body>
        <div className="position-relative">
          <LoadingOverlay show={!!filtroResumen && cargando} interno texto="Cargando" />
          {card && (filtroResumen
            ? <DataTableSimple2 data={clientes.filter(filtroResumen)} columns={columnasResumen} />
            : <DataTableSimple2 data={asistenciasCard()} columns={columnasAsistencias} />)}
        </div>
      </ModalCR.Body>
    </ModalCR>
  )
}
