import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useThemeStore } from '@/components/TopBar/useThemeStore'
import type { EstadoEvento } from '@/pages/AgendaNutricionista/helpers/agendaHelpers'
import { COLORES_REPORTE_VENTAS } from '@/components/ReporteBarras/coloresReporteVentas'
import type { FilaApilada } from '../helpers/resumenCitas'

type GraficoApiladoProps = {
  filas: FilaApilada[]
  /** Un segmento por estado, con su color */
  estados: EstadoEvento[]
  /** columnas: categorías en el eje X (días, horas) · barras: categorías en el eje Y (nutricionistas) */
  orientacion: 'columnas' | 'barras'
}

/** Alto de cada fila en orientación "barras" (barra de 18px + aire) */
const ALTO_FILA = 36

/** Barras apiladas por estado de cita (citas por día, por nutricionista y por hora), con leyenda y tooltip */
export const GraficoApilado = ({ filas, estados, orientacion }: GraficoApiladoProps) => {
  const { theme } = useThemeStore()
  const colores = COLORES_REPORTE_VENTAS[theme]
  const enBarras = orientacion === 'barras'
  const ejeNumerico = { type: 'number' as const, allowDecimals: false, tick: { fill: colores.texto, fontSize: 11 }, axisLine: false, tickLine: false }
  const ejeCategorias = { type: 'category' as const, dataKey: 'nombre', tick: { fill: colores.texto, fontSize: enBarras ? 12 : 11 }, axisLine: { stroke: colores.grilla }, tickLine: false }

  return (
    <ResponsiveContainer width="100%" height={enBarras ? Math.max(160, filas.length * ALTO_FILA + 60) : 300}>
      <BarChart data={filas} layout={enBarras ? 'vertical' : 'horizontal'} margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid horizontal={!enBarras} vertical={enBarras} stroke={colores.grilla} strokeWidth={1} />
        {enBarras
          ? <><XAxis {...ejeNumerico} /><YAxis {...ejeCategorias} width={150} /></>
          : <><XAxis {...ejeCategorias} interval={0} /><YAxis {...ejeNumerico} width={32} /></>}
        <Tooltip
          cursor={{ fill: colores.grilla, opacity: 0.5 }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const fila = payload[0].payload as FilaApilada
            return (
              <div className="card-mode-actual rounded shadow-sm px-3 py-2 small" style={{ minWidth: 180 }}>
                <div className="fw-bold mb-1">{fila.titulo}</div>
                {estados.filter((estado) => fila.porEstado[estado.value]).map((estado) => (
                  <div key={estado.value} className="d-flex align-items-center gap-2">
                    <span className="d-inline-block rounded-circle" style={{ width: 8, height: 8, backgroundColor: estado.color }} />
                    <span className="opacity-75">{estado.label}</span>
                    <span className="fw-semibold ms-auto">{fila.porEstado[estado.value]}</span>
                  </div>
                ))}
                <div className="d-flex border-top mt-1 pt-1">
                  <span className="opacity-75">Total</span>
                  <span className="fw-semibold ms-auto">{fila.total}</span>
                </div>
              </div>
            )
          }}
        />
        <Legend
          verticalAlign="top"
          align="right"
          height={28}
          iconType="circle"
          formatter={(valor: string) => <span style={{ color: colores.texto }}>{valor}</span>}
        />
        {estados.map((estado) => (
          <Bar
            key={estado.value}
            name={estado.label}
            dataKey={(fila: FilaApilada) => fila.porEstado[estado.value] ?? 0}
            stackId="estados"
            fill={estado.color}
            barSize={18}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
