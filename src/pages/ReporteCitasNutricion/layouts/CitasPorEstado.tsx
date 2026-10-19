import { useMemo } from 'react'
import { useReporteCitasStore } from '../hook/useReporteCitasStore'
import { useCitasRango } from '../hook/useCitasRango'
import { contarPorEstado, estadosReportados } from '../helpers/resumenCitas'
import { CardCitas } from '../components/CardCitas'
import { GraficoEstados } from '../components/GraficoEstados'
import { PanelCitas, TablaEstados } from '../components/PanelCitas'
import { ID_TODOS } from '../store/reporteCitasSlice'

type CitasPorEstadoProps = {
  /** yyyy-MM-dd */
  fecha_inicio: string
  /** yyyy-MM-dd */
  fecha_fin: string
}

/**
 * Card "Citas por estado": cantidad y % de cada estado. Muestra todos los estados para comparar
 * (el estado del header no filtra aquí, se resalta); el nutricionista sí filtra.
 */
export const CitasPorEstado = ({ fecha_inicio, fecha_fin }: CitasPorEstadoProps) => {
  const { estados, idEstadoSeleccionado, filtrarCitas } = useReporteCitasStore()
  const { citas, loading, error } = useCitasRango(fecha_inicio, fecha_fin)

  const conteos = useMemo(() => {
    const filtradas = filtrarCitas(citas, { ignorarEstado: true })
    return filtradas.length ? contarPorEstado(filtradas, estadosReportados(estados, filtradas)) : []
  }, [citas, estados, filtrarCitas])

  return (
    <CardCitas titulo="Citas por estado" loading={loading} error={error} vacio={conteos.length === 0}>
      <PanelCitas
        grafica={<GraficoEstados conteos={conteos} idElegido={idEstadoSeleccionado !== ID_TODOS ? idEstadoSeleccionado : null} />}
        tabla={<TablaEstados conteos={conteos} />}
      />
    </CardCitas>
  )
}
