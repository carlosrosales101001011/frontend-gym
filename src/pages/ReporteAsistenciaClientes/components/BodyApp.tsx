import { CardResumen } from '@/components/CardResumen/CardResumen'
import { useReporteAsistenciaStore } from '../hook/useReporteAsistenciaStore'
import { clientesAsistidos, diasDelRango, franjaHora, horaPico } from '../helpers/resumenAsistencia'

/**
 * Cuerpo del reporte: tres cards pequeñas con los filtros del header — clientes que asistieron, clientes con
 * membresía vigente que no asistieron y la hora pico (con su promedio de asistencias por día).
 */
export const BodyApp = () => {
  const { asistencias, clientesSinAsistir, filtros, cargando } = useReporteAsistenciaStore()
  const dias = diasDelRango(filtros.fecha_inicio, filtros.fecha_fin)
  const pico = horaPico(asistencias, dias)

  return (
    <div className="card-resumen-grupo">
      <CardResumen
        icono="users"
        titulo="Clientes asistidos"
        valor={clientesAsistidos(asistencias)}
        detalle={`${asistencias.length} asistencias en el rango`}
        cargando={cargando}
      />
      <CardResumen
        icono="user"
        titulo="Clientes sin asistir"
        valor={clientesSinAsistir}
        detalle="Con membresía vigente en el rango"
        cargando={cargando}
      />
      <CardResumen
        icono="reloj"
        titulo="Hora pico (promedio)"
        valor={pico ? franjaHora(pico.hora) : '—'}
        detalle={pico
          ? `${pico.promedioPorDia.toFixed(1)} asistencias por día · ${pico.asistencias} en ${dias} día${dias === 1 ? '' : 's'}`
          : 'Sin asistencias en el rango'}
        cargando={cargando}
      />
    </div>
  )
}
