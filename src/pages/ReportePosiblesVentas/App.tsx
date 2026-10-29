import { useEffect, type ReactNode } from 'react'
import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'
import { DataTableSimple2, type ColumnaSimple2 } from '@/components/DataTableSimple/DataTableSimple2'
import { DIAS_ASISTENCIA, useMembresiasSeguimiento, type MembresiaAsistenciaProps } from './hook/useMembresiasSeguimiento'
import { peso } from './formPeso'
import {
  puntajeAsistencia, puntajeRecencia, puntajeRenovaciones, puntajeTendencia, puntajeTotal, puntajeUsoSesiones, type PuntajeMetrica,
} from './helpers/puntaje'

/** Celda de una métrica: arriba su fórmula ponderada y abajo el dato */
const ConFormula = ({ puntaje, children }: { puntaje: PuntajeMetrica, children: ReactNode }) => (
  <div className='lh-sm'>
    <div className='small fw-semibold text-primary text-nowrap'>{puntaje.formula}</div>
    <div>{children}</div>
  </div>
)

/** Diferencia en días con signo: ▲ +3 días / ▼ −1.5 días / = 0 días */
const Tendencia = ({ dias }: { dias: number }) => {
  const valor = Math.abs(dias).toLocaleString('es-PE', { maximumFractionDigits: 1 })
  const unidad = Math.abs(dias) === 1 ? 'día' : 'días'
  if (dias > 0) return <span className='text-success fw-semibold'>▲ +{valor} {unidad}</span>
  if (dias < 0) return <span className='text-danger fw-semibold'>▼ −{valor} {unidad}</span>
  return <span className='opacity-75'>= 0 días</span>
}

/** Título de la columna con su peso (formPeso.ts) debajo, en porcentaje */
const ConPeso = ({ titulo, valor }: { titulo: string, valor: number }) => (
  <div className='lh-sm'>
    <div>{titulo}</div>
    <div className='small fw-normal opacity-75'>Peso {Math.round(valor * 100)}%</div>
  </div>
)

const columnas: ColumnaSimple2<MembresiaAsistenciaProps>[] = [
  { id: 'id', header: 'ID', render: (row) => row.id, sortValue: (row) => row.id ?? 0 },
  {
    id: 'cliente',
    header: 'Cliente',
    render: (row) => row.label_nombres_apellidos_cli,
    searchValue: (row) => row.label_nombres_apellidos_cli ?? '',
  },
  {
    id: 'asistencia',
    header: <ConPeso titulo={`Asistencia últimos ${DIAS_ASISTENCIA} días`} valor={peso.asistenciaUltimos30dias} />,
    render: (row) => <ConFormula puntaje={puntajeAsistencia(row)}>{`${row.dias_asistidos} ${row.dias_asistidos === 1 ? 'día' : 'días'}`}</ConFormula>,
    sortValue: (row) => row.dias_asistidos,
  },
  {
    id: 'recencia',
    header: <ConPeso titulo='Recencia de asistencia' valor={peso.recensiaAsistencia} />,
    render: (row) => (
      <ConFormula puntaje={puntajeRecencia(row)}>
        {row.dias_desde_ultima === null
          ? <span className='opacity-75'>Nunca asistió</span>
          : row.dias_desde_ultima === 0 ? 'Hoy' : `Hace ${row.dias_desde_ultima} ${row.dias_desde_ultima === 1 ? 'día' : 'días'}`}
      </ConFormula>
    ),
    // Los que nunca asistieron, al final al ordenar de menos a más
    sortValue: (row) => row.dias_desde_ultima ?? Number.MAX_SAFE_INTEGER,
  },
  {
    id: 'tendencia',
    header: <ConPeso titulo='Tendencia de asistencia' valor={peso.tendenciaAsistencia} />,
    render: (row) => (
      <ConFormula puntaje={puntajeTendencia(row)}>
        {row.dias_desde_ultima === null ? <span className='opacity-75'>Sin asistencias</span> : <Tendencia dias={row.tendencia} />}
      </ConFormula>
    ),
    sortValue: (row) => row.tendencia,
  },
  {
    id: 'renovaciones',
    header: <ConPeso titulo='Renovaciones anteriores' valor={peso.renovacionesAnteriores} />,
    render: (row) => <ConFormula puntaje={puntajeRenovaciones(row)}>{row.renovaciones_anteriores}</ConFormula>,
    sortValue: (row) => row.renovaciones_anteriores,
  },
  {
    id: 'clases',
    header: <ConPeso titulo='Clases consumidas' valor={peso.usoSesiones} />,
    render: (row) => (
      <ConFormula puntaje={puntajeUsoSesiones(row)}>
        {row.sesiones_totales ? `${row.clases_consumidas} de ${row.sesiones_totales}` : <>{row.clases_consumidas} <span className='opacity-75'>(sin inicio)</span></>}
      </ConFormula>
    ),
    sortValue: (row) => row.clases_consumidas,
  },
  {
    id: 'puntaje',
    header: 'Puntaje',
    render: (row) => <span className='fw-bold fs-5'>{puntajeTotal(row).toLocaleString('es-PE', { maximumFractionDigits: 1 })}</span>,
    sortValue: puntajeTotal,
  },
]

export const App = () => {
  const { membresias, cargando, obtenerMembresias } = useMembresiasSeguimiento()

  useEffect(() => {
    obtenerMembresias()
  }, [])

  return (
    <div>
      <PageBreadCumb title="Posibles ventas" />
      <div className="p-2 card-actual">
        <h5 className="fw-bold mb-2 fs-4">Membresías en seguimiento ({membresias.length})</h5>
        {cargando
          ? <div className="small opacity-75 py-2">Cargando membresías...</div>
          : <DataTableSimple2 data={membresias} columns={columnas} />}
      </div>
    </div>
  )
}
