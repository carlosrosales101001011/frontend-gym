import { useMemo, useState } from 'react'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { prepararBarras, type BarraComparacion, type ItemBarra } from './barrasComparacion'
import type { MedidaReporte } from './medidaReporte'
import { SelectorMedida } from './SelectorMedida'
import { PanelBarras } from './PanelBarras'

type CardBarrasReporteProps = {
  titulo: string
  /** Un ítem por barra: monto (S/) y cantidad */
  items: ItemBarra[]
  /** Título de la primera columna de la tabla ("Asesor", "Programa", ...) */
  etiquetaColumna: string
  /** Medida con la que abre la card (default: monto) */
  medidaInicial?: MedidaReporte
  /** Barra resaltada (las demás en gris, con % de alcance las que la superan); null = ninguna */
  idElegido?: number | null
  /** Click en una fila del modo tabla (ej. para filtrar el reporte por ella) */
  onClickFila?: (barra: BarraComparacion) => void
  /** Tramos (edad, días, ...): se mantiene su orden por id en vez de ir de mayor a menor */
  ordenFijo?: boolean
  loading: boolean
  error: string
  /** Texto del loading (default: "Cargando") */
  textoCargando?: string
  /** Aviso sin datos (default: "No hay datos.") */
  textoVacio?: string
}

/**
 * Card de barras de los reportes: título, botones Monto / Cantidad y pestañas Gráfica / Tabla con los mismos datos.
 * Loading interno, error y aviso de vacío (sin ítems o todos en 0).
 */
export const CardBarrasReporte = ({
  titulo, items, etiquetaColumna, medidaInicial = 'monto', idElegido = null, onClickFila, ordenFijo = false,
  loading, error, textoCargando = 'Cargando', textoVacio = 'No hay datos.',
}: CardBarrasReporteProps) => {
  const [medida, setMedida] = useState<MedidaReporte>(medidaInicial)
  const barras = useMemo(() => {
    const preparadas = prepararBarras(items, medida, idElegido)
    return ordenFijo ? preparadas.sort((a, b) => a.id - b.id) : preparadas
  }, [items, medida, idElegido, ordenFijo])
  const vacio = items.every((item) => item.cantidad === 0)

  return (
    <div className="card-mode-actual rounded p-3 h-100 position-relative">
      <LoadingOverlay texto={textoCargando} show={loading} interno />
      <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
        <h5 className="fw-bold mb-0">{titulo}</h5>
        <SelectorMedida medida={medida} onChange={setMedida} />
      </div>

      {error && <div className="text-danger small">No se pudieron cargar los datos: {error}</div>}
      {!error && !loading && vacio && <div className="small opacity-75 py-5 text-center">{textoVacio}</div>}
      {!error && !vacio && <PanelBarras barras={barras} medida={medida} idElegido={idElegido} etiquetaColumna={etiquetaColumna} onClickFila={onClickFila} />}
    </div>
  )
}
