import { CardResumen } from '@/components/CardResumen/CardResumen'
import { useReporteAsistenciaStore } from '../hook/useReporteAsistenciaStore'
import { clientesAsistidos, diasDelRango, franjaHora, frecuenciaClientes, horaPico } from '../helpers/resumenAsistencia'

/**
 * Cuerpo del reporte (con los filtros del header): clientes que asistieron, clientes con membresía vigente que no
 * asistieron y la hora pico; la frecuencia semanal de los que asistieron; y los clientes con membresía vigente
 * según cuánto llevan sin asistir (hasta la fecha fin).
 */
export const BodyApp = () => {
  const { asistencias, resumen, filtros, cargando } = useReporteAsistenciaStore()
  const dias = diasDelRango(filtros.fecha_inicio, filtros.fecha_fin)
  const pico = horaPico(asistencias, dias)
  const frecuencia = frecuenciaClientes(asistencias, dias)

  return (
    <>
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
          valor={resumen.clientes_sin_asistir}
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
      <div className="card-resumen-grupo mt-3">
        <CardResumen
          icono="estrella"
          titulo="Clientes frecuentes"
          valor={frecuencia.frecuentes}
          detalle="≥ 3 asistencias por semana"
          cargando={cargando}
        />
        <CardResumen
          icono="check"
          titulo="Clientes regulares"
          valor={frecuencia.regulares}
          detalle="2 asistencias por semana"
          cargando={cargando}
        />
        <CardResumen
          icono="calendar"
          titulo="Baja frecuencia"
          valor={frecuencia.baja}
          detalle="1 asistencia por semana"
          cargando={cargando}
        />
      </div>
      <div className="card-resumen-grupo mt-3">
        <CardResumen
          icono="notificaciones"
          titulo="En riesgo"
          valor={resumen.clientes_en_riesgo}
          detalle="7–13 días sin asistir"
          cargando={cargando}
        />
        <CardResumen
          icono="times"
          titulo="Críticos"
          valor={resumen.clientes_criticos}
          detalle="≥ 14 días sin asistir"
          cargando={cargando}
        />
        <CardResumen
          icono="membresia"
          titulo="Nunca asistieron"
          valor={resumen.clientes_nunca_asistieron}
          detalle="Con membresía y 0 marcaciones"
          cargando={cargando}
        />
      </div>
    </>
  )
}
