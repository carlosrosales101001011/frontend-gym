import { useMemo } from 'react'
import { useReporteCitasStore } from '../hook/useReporteCitasStore'
import { useCitasRango } from '../hook/useCitasRango'
import { citasPorNutricionista, estadosConCitas } from '../helpers/resumenCitas'
import { CardCitas } from '../components/CardCitas'
import { GraficoApilado } from '../components/GraficoApilado'
import { PanelCitas, TablaApilada } from '../components/PanelCitas'

type CitasPorNutricionistaProps = {
  /** yyyy-MM-dd */
  fecha_inicio: string
  /** yyyy-MM-dd */
  fecha_fin: string
}

/**
 * Card "Citas por nutricionista": citas de cada nutricionista apiladas por estado. Muestra a todos para
 * comparar (el nutricionista del header no filtra aquí); el estado sí filtra.
 */
export const CitasPorNutricionista = ({ fecha_inicio, fecha_fin }: CitasPorNutricionistaProps) => {
  const { estados, filtrarCitas } = useReporteCitasStore()
  const { citas, loading, error } = useCitasRango(fecha_inicio, fecha_fin)

  const { filas, estadosCitas } = useMemo(() => {
    const filtradas = filtrarCitas(citas, { ignorarNutricionista: true })
    return { filas: citasPorNutricionista(filtradas), estadosCitas: estadosConCitas(estados, filtradas) }
  }, [citas, estados, filtrarCitas])

  return (
    <CardCitas titulo="Citas por nutricionista" loading={loading} error={error} vacio={filas.length === 0}>
      <PanelCitas
        grafica={<GraficoApilado filas={filas} estados={estadosCitas} orientacion="barras" />}
        tabla={<TablaApilada filas={filas} estados={estadosCitas} etiquetaColumna="Nutricionista" />}
      />
    </CardCitas>
  )
}
