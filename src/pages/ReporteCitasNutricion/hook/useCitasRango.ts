import { useEffect, useState } from 'react'
import { useReporteCitasStore } from './useReporteCitasStore'
import type { CitaReporteProps } from '../store/reporteCitasSlice'

/**
 * Citas del rango para un componente del reporte (cada card lleva su propio loading).
 * Se vuelven a pedir al cambiar las fechas; se ignora la respuesta de un rango anterior.
 */
export const useCitasRango = (fecha_inicio: string, fecha_fin: string, habilitado = true) => {
  const { obtenerCitasRango } = useReporteCitasStore()
  const [citas, setCitas] = useState<CitaReporteProps[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!habilitado) return
    let vigente = true
    const cargar = async () => {
      setLoading(true)
      setError('')
      try {
        const lista = await obtenerCitasRango(fecha_inicio, fecha_fin)
        if (vigente) setCitas(lista)
      } catch (e) {
        if (vigente) setError(String(e))
      } finally {
        if (vigente) setLoading(false)
      }
    }
    cargar()
    return () => { vigente = false }
  }, [fecha_inicio, fecha_fin, habilitado])

  return { citas, loading, error }
}
