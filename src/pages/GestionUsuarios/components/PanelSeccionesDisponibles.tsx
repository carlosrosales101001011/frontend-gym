import { Card } from 'react-bootstrap'
import { InputCR } from '@/components/TextFields/InputCR'
import type { ModuloDisponibleProps } from '../store/usuariosSlice'
import { FilaSeccion } from './FilaSeccion'

type PanelSeccionesDisponiblesProps = {
  /** Módulos con solo sus secciones sin asignar que coinciden con la búsqueda */
  modulos: ModuloDisponibleProps[]
  totalSinAsignar: number
  busqueda: string
  onBuscar: (busqueda: string) => void
  onAsignar: (idsSeccion: number[]) => void
}

/** Secciones que aún se pueden asignar, agrupadas por módulo, con búsqueda y "Añadir todo" por módulo */
export const PanelSeccionesDisponibles = ({ modulos, totalSinAsignar, busqueda, onBuscar, onAsignar }: PanelSeccionesDisponiblesProps) => (
  <Card className="card-mode-actual h-100">
    <Card.Body>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="secciones-usuario__titulo mb-0">Secciones disponibles</h2>
        <span className="secciones-usuario__contador">{totalSinAsignar} sin asignar</span>
      </div>
      <InputCR label="Buscar sección" value={busqueda} onChange={(e) => onBuscar(e.target.value)} />
      <div className="secciones-usuario__scroll scroll-mode-actual mt-3">
        {modulos.length === 0 ? (
          <p className="secciones-usuario__vacio">
            {totalSinAsignar === 0 ? 'Ya asignaste todas las secciones.' : 'No se encontraron secciones.'}
          </p>
        ) : modulos.map((modulo) => (
          <div key={modulo.id_modulo} className="secciones-usuario__grupo">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h3 className="secciones-usuario__grupo-titulo">{modulo.label}</h3>
              <button
                type="button"
                className="btn btn-link btn-sm p-0 secciones-usuario__link"
                onClick={() => onAsignar(modulo.secciones.map((seccion) => seccion.id_seccion))}
              >
                Añadir todo
              </button>
            </div>
            <div className="d-flex flex-column gap-2">
              {modulo.secciones.map((seccion) => (
                <FilaSeccion key={seccion.id_seccion} label={seccion.label} signo="+" onClick={() => onAsignar([seccion.id_seccion])} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card.Body>
  </Card>
)
