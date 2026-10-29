import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useThemeStore } from '@/components/TopBar/useThemeStore'
import { getFormatMoney } from '@/helpers/getFormatMoney'
import type { BarraComparacion } from '../helpers/barrasComparacion'
import { formatearMedida, type MedidaReporte } from '../helpers/medidaReporte'
import { COLORES_REPORTE_VENTAS } from '../helpers/coloresReporteVentas'

type GraficoBarrasProps = {
  barras: BarraComparacion[]
  medida: MedidaReporte
  /** Elemento resaltado (su barra en azul, las demás en gris); null = todas en azul */
  idElegido: number | null
}

/** Alto de cada fila del gráfico (barra de 18px + aire) */
const ALTO_FILA = 36

/** Ancho aproximado de un texto en px (promedio por carácter según el tamaño de letra) */
const anchoTexto = (texto: string, pxPorCaracter: number) => Math.ceil(texto.length * pxPorCaracter)
const limitar = (valor: number, minimo: number, maximo: number) => Math.min(Math.max(valor, minimo), maximo)

/** "S/ 5 mil (S/ 2 mil | 60%)" -> ["S/ 5 mil", "(S/ 2 mil | 60%)"]; sin comparación, una sola línea */
const lineasEtiqueta = (etiqueta: string) => {
  const inicio = etiqueta.indexOf(' (')
  return inicio === -1 ? [etiqueta] : [etiqueta.slice(0, inicio), etiqueta.slice(inicio + 1)]
}

/**
 * Barras horizontales del reporte de ventas (asesor, origen, programa y plan).
 * Barra fina redondeada en el extremo del dato, valor/comparación al final de cada barra, grilla suave y tooltip.
 */
export const GraficoBarras = ({ barras, medida, idElegido }: GraficoBarrasProps) => {
  const { theme } = useThemeStore()
  const colores = COLORES_REPORTE_VENTAS[theme]
  const hayElegido = idElegido !== null
  // El espacio de los nombres (izquierda) y de las etiquetas (derecha) se ajusta al texto más largo que se
  // muestra, así las barras usan casi todo el ancho de la card (con un mínimo y un máximo).
  // La comparación va en una segunda línea, así la etiqueta ocupa el ancho de su línea más larga.
  const anchoNombres = limitar(Math.max(...barras.map((b) => anchoTexto(b.nombre, 7.2))) + 14, 50, 170)
  const margenDerecho = limitar(Math.max(...barras.flatMap((b) => lineasEtiqueta(b.etiqueta).map((l) => anchoTexto(l, 7)))) + 16, 30, 220)

  /** Etiqueta al final de la barra: el valor y, si hay comparación, debajo en letra más chica */
  const renderEtiqueta = ({ x, y, width, height, index }: { x?: number | string, y?: number | string, width?: number | string, height?: number | string, index?: number }) => {
    const barra = barras[index ?? 0]
    if (!barra) return null
    const [valor, comparacion] = lineasEtiqueta(barra.etiqueta)
    const xTexto = Number(x) + Number(width) + 6
    const yCentro = Number(y) + Number(height) / 2
    return (
      <text x={xTexto} y={comparacion ? yCentro - 3 : yCentro + 4} fill={colores.texto} fontSize={11} fontWeight={600}>
        <tspan>{valor}</tspan>
        {comparacion && <tspan x={xTexto} dy={13} fontSize={10} fontWeight={500}>{comparacion}</tspan>}
      </text>
    )
  }

  const colorBarra = (barra: BarraComparacion) => (!hayElegido || barra.id === idElegido ? colores.ventas : colores.atenuado)

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, barras.length * ALTO_FILA + 30)}>
      <BarChart data={barras} layout="vertical" margin={{ top: 0, right: margenDerecho, bottom: 0, left: 0 }}>
        <CartesianGrid horizontal={false} stroke={colores.grilla} strokeWidth={1} />
        {/* El eje termina en el valor máximo (no en un número "redondo" mayor): la barra más larga llega al final */}
        <XAxis
          type="number"
          domain={[0, 'dataMax']}
          tickFormatter={(valor: number) => medida === 'monto' ? getFormatMoney(valor, { is_version_cut: true }) : String(valor)}
          allowDecimals={false}
          tick={{ fill: colores.texto, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="nombre"
          width={anchoNombres}
          tick={{ fill: colores.texto, fontSize: 12 }}
          axisLine={{ stroke: colores.grilla }}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: colores.grilla, opacity: 0.5 }}
          content={({ active, payload }) => active && payload?.length ? (
            <div className="card-mode-actual rounded shadow-sm px-3 py-2 small">
              <div className="fw-bold">{(payload[0].payload as BarraComparacion).nombre}</div>
              <span className="opacity-75">{medida === 'monto' ? 'Vendido: ' : 'Ventas: '}</span>
              <span className="fw-semibold">{formatearMedida(Number(payload[0].value) || 0, medida)}</span>
            </div>
          ) : null}
        />
        <Bar dataKey="valor" barSize={18} radius={[0, 4, 4, 0]} isAnimationActive={false}>
          {barras.map((barra) => <Cell key={barra.id} fill={colorBarra(barra)} />)}
          <LabelList dataKey="etiqueta" content={renderEtiqueta} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
