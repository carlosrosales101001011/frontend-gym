import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { DataTableSimple, type ColumnaSimple } from '@/components/DataTableSimple/DataTableSimple'
import { formatDate } from '@/helpers/FormatDate'
import { usePerfilNutricional } from '../../hook/usePerfilNutricional'
import type { Decimal, PerfilNutricional } from '../../hook/usePerfilNutricionalStore'
import { calcularImc, calcularPgc, clasificarImc } from '../TabEvaluacionCorporal/medidasAntropometricas'

/** Valor guardado o "—" si está vacío */
const mostrar = (valor: Decimal) => (valor === null || valor === '' ? '—' : String(valor))

/** Columnas del reporte: IMC y PGC se calculan; el resto es lo guardado en cada fecha */
const COLUMNAS: ColumnaSimple<PerfilNutricional>[] = [
  { id: 'fecha', header: 'Fecha', render: (r) => formatDate(r.fecha.slice(0, 10), 'yyyy-mm-dd', 'dd/mm/yyyy') },
  { id: 'peso', header: 'Peso (kg)', render: (r) => mostrar(r.peso) },
  { id: 'agua', header: 'Agua corporal (L)', render: (r) => mostrar(r.agua_corporal_total) },
  { id: 'mme', header: 'MME (kg)', render: (r) => mostrar(r.masa_musculo_esqueletica) },
  { id: 'grasa', header: 'Masa grasa corporal (kg)', render: (r) => mostrar(r.masa_grasa_corporal) },
  {
    id: 'imc',
    header: 'IMC',
    render: (r) => {
      const imc = calcularImc(r.peso, r.talla)
      const clasificacion = clasificarImc(imc)
      return clasificacion ? <span className={`fw-bold text-${clasificacion.color}`}>{imc}</span> : '—'
    },
  },
  { id: 'pgc', header: 'PGC (%)', render: (r) => calcularPgc(r.masa_grasa_corporal, r.peso) || '—' },
  { id: 'visceral', header: 'Nivel de grasa visceral', render: (r) => mostrar(r.nivel_grasa_viceral) },
]

/** Reporte nutricionista del paciente: una fila por fecha (de la más antigua a la más reciente) */
export const TabReporteNutricionista = () => {
  const { registros } = usePerfilNutricional()

  return (
    <CardSeccionCR titulo="Evolución del paciente" className="mb-3">
      <div className="table-responsive">
        <DataTableSimple data={registros} columns={COLUMNAS} />
      </div>
    </CardSeccionCR>
  )
}
