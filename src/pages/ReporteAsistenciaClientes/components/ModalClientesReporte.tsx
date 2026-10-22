import { useEffect } from 'react'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import ModalCR from '@/components/Modal/ModalCR'
import { DataTableSimple2, type ColumnaSimple2 } from '@/components/DataTableSimple/DataTableSimple2'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { formatDate } from '@/helpers/FormatDate'
import { useReporteAsistenciaStore } from '../hook/useReporteAsistenciaStore'
import { useClientesResumenReporte, type ClienteResumenProps } from '../hook/useClientesResumenReporte'
import { pluralDiaSemana, type ClienteAsistido, type NivelFrecuencia } from '../helpers/resumenAsistencia'

/**
 * Card del reporte cuyos clientes se listan (dia_semana: una de las cards de lunes a sábado, ver diaSemana;
 * dia: un punto del gráfico de asistidos por día, ver dia)
 */
export type CardClientes = 'asistidos' | 'hora_pico' | NivelFrecuencia | 'sin_asistir' | 'en_riesgo' | 'criticos' | 'nunca' | 'dia_semana' | 'dia'

const TITULO: Record<Exclude<CardClientes, 'dia_semana' | 'dia'>, string> = {
  asistidos: 'Clientes asistidos',
  hora_pico: 'Clientes en la hora pico',
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

const columnasAsistidos = (conFrecuencia: boolean): ColumnaSimple2<ClienteAsistido>[] => [
  columnaCliente<ClienteAsistido>(),
  { id: 'asistencias', header: 'Asistencias', render: (c) => <strong>{c.asistencias}</strong>, sortValue: (c) => c.asistencias },
  ...(conFrecuencia ? [
    { id: 'dias', header: 'Días asistidos', render: (c: ClienteAsistido) => c.dias_asistidos, sortValue: (c: ClienteAsistido) => c.dias_asistidos },
    { id: 'semana', header: 'Por semana', render: (c: ClienteAsistido) => c.por_semana.toFixed(1), sortValue: (c: ClienteAsistido) => c.por_semana },
  ] : []),
  { id: 'ultima', header: 'Última asistencia', render: (c) => fechaHora(c.ultima_asistencia), sortValue: (c) => c.ultima_asistencia },
]

/** Un día de la semana: cuántos de esos días vino cada cliente (la suma es el total de la card) */
const columnasDiaSemana = (nombre: string): ColumnaSimple2<ClienteAsistido>[] => [
  columnaCliente<ClienteAsistido>(),
  { id: 'dias', header: `${nombre} asistidos`, render: (c) => <strong>{c.dias_asistidos}</strong>, sortValue: (c) => c.dias_asistidos },
  { id: 'ultima', header: `Último ${nombre.toLowerCase()}`, render: (c) => fechaHora(c.ultima_asistencia), sortValue: (c) => c.ultima_asistencia },
]

/** Un día: a qué hora marcó cada cliente (la última, si marcó varias veces) y cuántas veces */
const columnasDia: ColumnaSimple2<ClienteAsistido>[] = [
  columnaCliente<ClienteAsistido>(),
  {
    id: 'hora', header: 'Hora',
    render: (c) => formatDate(new Date(c.ultima_asistencia), 'yyyy-mm-dd', 'hh:mm'),
    sortValue: (c) => c.ultima_asistencia,
  },
  { id: 'marcaciones', header: 'Marcaciones', render: (c) => c.asistencias, sortValue: (c) => c.asistencias },
]

type ModalClientesReporteProps = {
  /** null = cerrado */
  card: CardClientes | null
  onHide: () => void
  /** Clientes que asistieron en el rango y los de la franja de la hora pico */
  asistidos?: ClienteAsistido[]
  asistidosHoraPico?: ClienteAsistido[]
  /** Con card 'dia_semana': el día ("Lunes") y los clientes que asistieron ese día de la semana */
  diaSemana?: { nombre: string, clientes: ClienteAsistido[] }
  /** Con card 'dia': la fecha (yyyy-mm-dd) y los clientes que asistieron ese día */
  dia?: { fecha: string, clientes: ClienteAsistido[] }
}

/** Nombres de los clientes de una card del reporte, en una tabla con buscador */
export const ModalClientesReporte = ({ card, onHide, asistidos = [], asistidosHoraPico = [], diaSemana, dia }: ModalClientesReporteProps) => {
  const { filtros } = useReporteAsistenciaStore()
  const { clientes, cargando, obtenerClientes } = useClientesResumenReporte()
  const filtroResumen = card ? FILTRO_RESUMEN[card] : undefined

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
    { id: 'en-rango', header: 'Asistencias en el rango', render: (c) => c.asistencias_en_rango, sortValue: (c) => c.asistencias_en_rango },
  ]

  const contenido = () => {
    if (!card) return null
    if (filtroResumen) return <DataTableSimple2 data={clientes.filter(filtroResumen)} columns={columnasResumen} />
    if (card === 'dia_semana') return diaSemana
      ? <DataTableSimple2 data={diaSemana.clientes} columns={columnasDiaSemana(diaSemana.nombre)} />
      : null
    if (card === 'dia') return dia ? <DataTableSimple2 data={dia.clientes} columns={columnasDia} /> : null
    if (card === 'hora_pico') return <DataTableSimple2 data={asistidosHoraPico} columns={columnasAsistidos(false)} />
    const lista = card === 'asistidos' ? asistidos : asistidos.filter((c) => c.nivel === card)
    return <DataTableSimple2 data={lista} columns={columnasAsistidos(true)} />
  }

  const titulo = !card ? ''
    : card === 'dia_semana' ? `Clientes que asistieron los ${pluralDiaSemana(diaSemana?.nombre ?? '')}`
    : card === 'dia' ? `Clientes que asistieron el ${dia ? formatDate(dia.fecha, 'yyyy-mm-dd', 'DDDD dd [de] MMMM [del] yyyy') : ''}`
    : TITULO[card]

  return (
    <ModalCR show={!!card} onHide={onHide} size="lg" position="center">
      <ModalCR.Header>
        <ModalCR.Title>{titulo}</ModalCR.Title>
      </ModalCR.Header>
      <ModalCR.Body>
        <div className="position-relative">
          <LoadingOverlay show={!!filtroResumen && cargando} interno texto="Cargando" />
          {contenido()}
        </div>
      </ModalCR.Body>
    </ModalCR>
  )
}
