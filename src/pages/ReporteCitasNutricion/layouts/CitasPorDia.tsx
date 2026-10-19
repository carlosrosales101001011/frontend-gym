import { useMemo } from 'react'
import { useReporteCitasStore } from '../hook/useReporteCitasStore'
import { useCitasRango } from '../hook/useCitasRango'
import { citasPorDia, estadosConCitas } from '../helpers/resumenCitas'
import { CardCitas } from '../components/CardCitas'
import { GraficoApilado } from '../components/GraficoApilado'
import { PanelCitas, TablaApilada } from '../components/PanelCitas'

type CitasPorDiaProps = {
  /** yyyy-MM-dd */
  fecha_inicio: string
  /** yyyy-MM-dd */
  fecha_fin: string
}

/** Card "Citas por día": cada día del rango con sus citas apiladas por estado (con todos los filtros del header) */
export const CitasPorDia = ({ fecha_inicio, fecha_fin }: CitasPorDiaProps) => {
  const { estados, filtrarCitas } = useReporteCitasStore()
  const { citas, loading, error } = useCitasRango(fecha_inicio, fecha_fin)

  const { filas, estadosCitas } = useMemo(() => {
    const filtradas = filtrarCitas(citas)
    return { filas: filtradas.length ? citasPorDia(filtradas, fecha_inicio, fecha_fin) : [], estadosCitas: estadosConCitas(estados, filtradas) }
  }, [citas, estados, fecha_inicio, fecha_fin, filtrarCitas])

  return (
    <CardCitas titulo="Citas por día" loading={loading} error={error} vacio={filas.length === 0}>
      <PanelCitas
        grafica={<GraficoApilado filas={filas} estados={estadosCitas} orientacion="columnas" />}
        tabla={<TablaApilada filas={filas.filter((fila) => fila.total)} estados={estadosCitas} etiquetaColumna="Día" />}
      />
    </CardCitas>
  )
}
