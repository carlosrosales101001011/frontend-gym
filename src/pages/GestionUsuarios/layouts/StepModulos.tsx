import { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { useGestionUsuariosStore } from "../hook/useGestionUsuariosStore";
import { coincideBusqueda, filtrarSecciones } from "../helpers/seccionesPorModulo";
import { PanelSeccionesDisponibles } from "../components/PanelSeccionesDisponibles";
import { PanelSeccionesAsignadas } from "../components/PanelSeccionesAsignadas";
import { PieStep } from "../components/PieStep";

type StepModulosProps = {
  setStep: (step: number) => void;
  /** Se llama cuando el usuario quedó registrado (este es el último paso mientras "Entidades" está en pausa) */
  onGuardado: () => void;
}

/**
 * Paso 2: qué secciones ve el nuevo usuario. Se ofrecen las secciones de quien registra
 * (a la izquierda) y se pasan a la derecha al asignarlas; los módulos salen de las secciones.
 */
export const StepModulos = ({ setStep, onGuardado }: StepModulosProps) => {
  const { modulosDisponibles, idsSeccionAsignadas, obtenerAccesosCreador, asignarSecciones, guardarUsuario } = useGestionUsuariosStore()
  const [asignadas, setAsignadas] = useState(() => new Set(idsSeccionAsignadas))
  const [busqueda, setBusqueda] = useState("")
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    obtenerAccesosCreador()
  }, [])

  const modulosSinAsignar = useMemo(
    () => filtrarSecciones(modulosDisponibles, (seccion) => !asignadas.has(seccion.id_seccion)),
    [modulosDisponibles, asignadas]
  )
  const modulosBuscados = useMemo(
    () => filtrarSecciones(modulosSinAsignar, (seccion) => coincideBusqueda(seccion, busqueda)),
    [modulosSinAsignar, busqueda]
  )
  const modulosAsignados = useMemo(
    () => filtrarSecciones(modulosDisponibles, (seccion) => asignadas.has(seccion.id_seccion)),
    [modulosDisponibles, asignadas]
  )
  const totalPorModulo = useMemo(
    () => Object.fromEntries(modulosDisponibles.map((modulo) => [modulo.id_modulo, modulo.secciones.length])),
    [modulosDisponibles]
  )
  const totalSinAsignar = modulosSinAsignar.reduce((total, modulo) => total + modulo.secciones.length, 0)

  const asignar = (ids: number[]) => setAsignadas((actual) => new Set([...actual, ...ids]))
  const quitar = (ids: number[]) => setAsignadas((actual) => new Set([...actual].filter((id) => !ids.includes(id))))

  /** Vuelve a "Información" conservando las secciones elegidas */
  const volver = () => {
    asignarSecciones([...asignadas])
    setStep(0)
  }

  /** Registra el usuario con las secciones elegidas (sin permisos por entidad mientras ese paso está en pausa) */
  const guardar = async () => {
    if (asignadas.size === 0) {
      await Swal.fire({ icon: 'warning', title: 'Sin secciones', text: 'Asigna al menos una sección al usuario.' })
      return
    }
    const ids = [...asignadas]
    asignarSecciones(ids)
    setGuardando(true)
    const guardado = await guardarUsuario([], ids)
    setGuardando(false)
    if (guardado) onGuardado()
  }

  return (
    <div>
      <Row className="g-3">
        <Col lg={5}>
          <PanelSeccionesDisponibles
            modulos={modulosBuscados}
            totalSinAsignar={totalSinAsignar}
            busqueda={busqueda}
            onBuscar={setBusqueda}
            onAsignar={asignar}
          />
        </Col>
        <Col lg={7}>
          <PanelSeccionesAsignadas modulos={modulosAsignados} totalPorModulo={totalPorModulo} onQuitar={quitar} />
        </Col>
      </Row>
      <PieStep
        onAtras={volver}
        labelSiguiente={guardando ? 'Guardando...' : 'Guardar usuario'}
        onSiguiente={guardar}
        disabled={guardando}
      />
    </div>
  );
}
