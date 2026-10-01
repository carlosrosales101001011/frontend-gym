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
}

/**
 * Paso 2: qué secciones ve el nuevo usuario. Se ofrecen las secciones de quien registra
 * (a la izquierda) y se pasan a la derecha al asignarlas; los módulos salen de las secciones.
 */
export const StepModulos = ({ setStep }: StepModulosProps) => {
  const { modulosDisponibles, idsSeccionAsignadas, obtenerAccesosCreador, asignarSecciones } = useGestionUsuariosStore()
  const [asignadas, setAsignadas] = useState(() => new Set(idsSeccionAsignadas))
  const [busqueda, setBusqueda] = useState("")

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

  const guardarYSeguir = async (siguiente: number) => {
    if (siguiente > 1 && asignadas.size === 0) {
      await Swal.fire({ icon: 'warning', title: 'Sin secciones', text: 'Asigna al menos una sección al usuario.' })
      return
    }
    asignarSecciones([...asignadas])
    setStep(siguiente)
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
      <PieStep onAtras={() => guardarYSeguir(0)} onSiguiente={() => guardarYSeguir(2)} />
    </div>
  );
}
