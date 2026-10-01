import { Card } from 'react-bootstrap'
import type { ModuloDisponibleProps } from '../store/usuariosSlice'
import { FilaSeccion } from './FilaSeccion'

type PanelSeccionesAsignadasProps = {
  /** Módulos con solo sus secciones asignadas */
  modulos: ModuloDisponibleProps[]
  /** Cantidad de secciones de cada módulo, para mostrar "2 de 5" */
  totalPorModulo: Record<number, number>
  onQuitar: (idsSeccion: number[]) => void
}

/** Secciones asignadas al nuevo usuario, agrupadas por módulo, con "Quitar todo" */
export const PanelSeccionesAsignadas = ({ modulos, totalPorModulo, onQuitar }: PanelSeccionesAsignadasProps) => {
  const idsAsignadas = modulos.flatMap((modulo) => modulo.secciones.map((seccion) => seccion.id_seccion))

  return (
    <Card className="card-mode-actual h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="secciones-usuario__titulo mb-0">Asignadas al usuario</h2>
          <div className="d-flex align-items-center gap-3">
            <span className="secciones-usuario__contador">
              {modulos.length} {modulos.length === 1 ? 'módulo' : 'módulos'}, {idsAsignadas.length} {idsAsignadas.length === 1 ? 'sección' : 'secciones'}
            </span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 secciones-usuario__link"
              disabled={idsAsignadas.length === 0}
              onClick={() => onQuitar(idsAsignadas)}
            >
              Quitar todo
            </button>
          </div>
        </div>
        <div className="secciones-usuario__scroll scroll-mode-actual">
          {modulos.length === 0 ? (
            <p className="secciones-usuario__vacio">Aún no hay secciones asignadas.</p>
          ) : modulos.map((modulo) => (
            <div key={modulo.id_modulo} className="secciones-usuario__grupo">
              <div className="d-flex align-items-baseline gap-2 mb-2">
                <h3 className="secciones-usuario__grupo-titulo">{modulo.label}</h3>
                <span className="secciones-usuario__contador">
                  {modulo.secciones.length} de {totalPorModulo[modulo.id_modulo] ?? modulo.secciones.length}
                </span>
              </div>
              <div className="d-flex flex-column gap-2">
                {modulo.secciones.map((seccion) => (
                  <FilaSeccion key={seccion.id_seccion} label={seccion.label} signo="−" onClick={() => onQuitar([seccion.id_seccion])} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}
