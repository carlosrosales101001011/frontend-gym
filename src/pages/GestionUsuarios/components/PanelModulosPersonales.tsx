import { Card, Form } from 'react-bootstrap'
import type { ModuloPersonalProps } from '../store/usuariosSlice'

type PanelModulosPersonalesProps = {
  /** Todos los módulos personales del catálogo */
  modulos: ModuloPersonalProps[]
  /** Módulos personales marcados */
  seleccionados: Set<number>
  onCambiar: (idModulo: number, marcado: boolean) => void
}

/** Módulos personales del nuevo usuario: un check por módulo con su descripción debajo (vienen todos marcados; se pueden desmarcar) */
export const PanelModulosPersonales = ({ modulos, seleccionados, onCambiar }: PanelModulosPersonalesProps) => (
  <Card className="card-mode-actual h-100">
    <Card.Body>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="secciones-usuario__titulo mb-0">Módulos personales</h2>
        <span className="secciones-usuario__contador">{modulos.filter((m) => seleccionados.has(m.id)).length} de {modulos.length}</span>
      </div>
      <div className="secciones-usuario__scroll scroll-mode-actual">
        {modulos.length === 0 ? (
          <p className="secciones-usuario__vacio">No hay módulos personales.</p>
        ) : (
          <div className="d-flex flex-column gap-2">
            {modulos.map((modulo) => (
              <Form.Check
                key={modulo.id}
                type="checkbox"
                id={`modulo-personal-${modulo.id}`}
                label={
                  <span className="d-flex flex-column lh-sm">
                    <span>{modulo.label}</span>
                    {modulo.descripcion && <span className="small opacity-75">{modulo.descripcion}</span>}
                  </span>
                }
                checked={seleccionados.has(modulo.id)}
                onChange={(e) => onCambiar(modulo.id, e.target.checked)}
              />
            ))}
          </div>
        )}
      </div>
    </Card.Body>
  </Card>
)
