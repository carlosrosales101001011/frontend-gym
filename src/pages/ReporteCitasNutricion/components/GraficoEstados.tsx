import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useThemeStore } from '@/components/TopBar/useThemeStore'
import { COLORES_REPORTE_VENTAS } from '@/pages/ReporteVentas/helpers/coloresReporteVentas'
import type { ConteoEstado } from '../helpers/resumenCitas'

type GraficoEstadosProps = {
  conteos: ConteoEstado[]
  /** Estado elegido en el header (su barra con su color, las demás en gris); null = todas con su color */
  idElegido: number | null
}

/** Alto de cada fila del gráfico (barra de 18px + aire) */
const ALTO_FILA = 36

/** Barras horizontales con las citas de cada estado (en el color del estado) y "cantidad (participación%)" al final */
export const GraficoEstados = ({ conteos, idElegido }: GraficoEstadosProps) => {
  const { theme } = useThemeStore()
  const colores = COLORES_REPORTE_VENTAS[theme]
  const filas = conteos.map((conteo) => ({ ...conteo, etiqueta: `${conteo.cantidad} (${conteo.participacion}%)` }))

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, conteos.length * ALTO_FILA + 30)}>
      <BarChart data={filas} layout="vertical" margin={{ top: 0, right: 90, bottom: 0, left: 0 }}>
        <CartesianGrid horizontal={false} stroke={colores.grilla} strokeWidth={1} />
        <XAxis type="number" domain={[0, 'dataMax']} allowDecimals={false} tick={{ fill: colores.texto, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="label" width={100} tick={{ fill: colores.texto, fontSize: 12 }} axisLine={{ stroke: colores.grilla }} tickLine={false} />
        <Tooltip
          cursor={{ fill: colores.grilla, opacity: 0.5 }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const fila = payload[0].payload as (typeof filas)[number]
            return (
              <div className="card-mode-actual rounded shadow-sm px-3 py-2 small">
                <div className="fw-bold">{fila.label}</div>
                <span className="opacity-75">Citas: </span>
                <span className="fw-semibold">{fila.etiqueta}</span>
              </div>
            )
          }}
        />
        <Bar dataKey="cantidad" barSize={18} radius={[0, 4, 4, 0]} isAnimationActive={false}>
          {conteos.map((conteo) => (
            <Cell key={conteo.value} fill={idElegido === null || conteo.value === idElegido ? conteo.color : colores.atenuado} />
          ))}
          <LabelList
            dataKey="etiqueta"
            position="right"
            fill={colores.texto}
            fontSize={11}
            fontWeight={600}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
