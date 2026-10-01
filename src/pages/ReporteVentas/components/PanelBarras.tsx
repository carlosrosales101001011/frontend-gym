import IconCR from '@/components/Icons/IconCR'
import { TabsCR } from '@/components/Tabs/TabsCR'
import { TabCR } from '@/components/Tabs/TabCR'
import type { BarraComparacion } from '../helpers/barrasComparacion'
import type { MedidaReporte } from '../helpers/medidaReporte'
import { GraficoBarras } from './GraficoBarras'
import { TablaBarras } from './TablaBarras'

type PanelBarrasProps = {
  barras: BarraComparacion[]
  medida: MedidaReporte
  idElegido: number | null
  /** Título de la primera columna de la tabla: "Vendedor", "Origen" o "Programa" */
  etiquetaColumna: string
}

/** Título de pestaña con solo un ícono (tooltip y aria-label con el texto); el color lo da TabsCR */
const TituloIcono = ({ icono, texto }: { icono: 'grafica' | 'tabla', texto: string }) => (
  <span className="d-inline-flex" title={texto} aria-label={texto}>
    <IconCR name={icono} size={18} className="" />
  </span>
)

/** Contenido de las cards de barras (asesor, origen, programa): pestañas Gráfica y Tabla con los mismos datos */
export const PanelBarras = ({ barras, medida, idElegido, etiquetaColumna }: PanelBarrasProps) => (
  <TabsCR defaultActiveKey="grafica" variant="pildora">
    <TabCR eventKey="grafica" title={<TituloIcono icono="grafica" texto="Gráfica" />}>
      <GraficoBarras barras={barras} medida={medida} idElegido={idElegido} />
    </TabCR>
    <TabCR eventKey="tabla" title={<TituloIcono icono="tabla" texto="Tabla" />}>
      <TablaBarras barras={barras} medida={medida} idElegido={idElegido} etiquetaColumna={etiquetaColumna} />
    </TabCR>
  </TabsCR>
)
