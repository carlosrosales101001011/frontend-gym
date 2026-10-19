import { useMemo } from 'react'
import { useReporteCitasStore } from '../hook/useReporteCitasStore'
import { useCitasRango } from '../hook/useCitasRango'
import { citasPorHora, estadosConCitas } from '../helpers/resumenCitas'
import { CardCitas } from '../components/CardCitas'
import { GraficoApilado } from '../components/GraficoApilado'
import { PanelCitas, TablaApilada } from '../components/PanelCitas'

type CitasPorHoraProps = {
  /** yyyy-MM-dd */
  fecha_inicio: string
  /** yyyy-MM-dd */
  fecha_fin: string
}

/** Card "Citas por hora": franjas de una hora (según la hora de inicio) apiladas por estado, con todos los filtros */
export const CitasPorHora = ({ fecha_inicio, fecha_fin }: CitasPorHoraProps) => {
  const { estados, filtrarCitas } = useReporteCitasStore()
  const { citas, loading, error } = useCitasRango(fecha_inicio, fecha_fin)

  const { filas, estadosCitas } = useMemo(() => {
    const filtradas = filtrarCitas(citas)
    return { filas: citasPorHora(filtradas), estadosCitas: estadosConCitas(estados, filtradas) }
  }, [citas, estados, filtrarCitas])

  return (
    <CardCitas titulo="Citas por hora" loading={loading} error={error} vacio={filas.length === 0}>
      <PanelCitas
        grafica={<GraficoApilado filas={filas} estados={estadosCitas} orientacion="columnas" />}
        tabla={<TablaApilada filas={filas.filter((fila) => fila.total)} estados={estadosCitas} etiquetaColumna="Hora" />}
      />
    </CardCitas>
  )
}
