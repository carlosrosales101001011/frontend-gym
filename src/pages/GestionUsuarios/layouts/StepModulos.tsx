import { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useGestionUsuariosStore } from "../hook/useGestionUsuariosStore";
import { coincideBusqueda, filtrarSecciones } from "../helpers/seccionesPorModulo";
import { PanelSeccionesDisponibles } from "../components/PanelSeccionesDisponibles";
import { PanelSeccionesAsignadas } from "../components/PanelSeccionesAsignadas";
import { PieStep } from "../components/PieStep";
import { ID_TIPO_MODULO_PERSONAL } from "@/stores/permisos/permisoSlice";

type StepModulosProps = {
  setStep: (step: number) => void;
}

/**
 * Paso 2: qué secciones ve el nuevo usuario. Se ofrecen las secciones de quien registra
 * (a la izquierda) y se pasan al medio al asignarlas; los módulos salen de las secciones.
 * Solo módulos empresariales: los personales se eligen en el paso 3.
 */
export const StepModulos = ({ setStep }: StepModulosProps) => {
  const { modulosDisponibles, idsSeccionAsignadas, obtenerAccesosCreador, asignarSecciones } = useGestionUsuariosStore()
  const [asignadas, setAsignadas] = useState(() => new Set(idsSeccionAsignadas))
  const [busqueda, setBusqueda] = useState("")

  useEffect(() => {
    obtenerAccesosCreador()
  }, [])

  // Solo empresariales: los personales van en el paso 3 (sus secciones asignadas se conservan en el store)
  const modulosEmpresariales = useMemo(
    () => modulosDisponibles.filter((modulo) => modulo.id_tipo !== ID_TIPO_MODULO_PERSONAL),
    [modulosDisponibles]
  )

  const modulosSinAsignar = useMemo(
    () => filtrarSecciones(modulosEmpresariales, (seccion) => !asignadas.has(seccion.id_seccion)),
    [modulosEmpresariales, asignadas]
  )
  const modulosBuscados = useMemo(
    () => filtrarSecciones(modulosSinAsignar, (seccion) => coincideBusqueda(seccion, busqueda)),
    [modulosSinAsignar, busqueda]
  )
  const modulosAsignados = useMemo(
    () => filtrarSecciones(modulosEmpresariales, (seccion) => asignadas.has(seccion.id_seccion)),
    [modulosEmpresariales, asignadas]
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

  /** Pasa a "Módulos personales" conservando las secciones elegidas */
  const siguiente = () => {
    asignarSecciones([...asignadas])
    setStep(2)
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
      <PieStep onAtras={volver} onSiguiente={siguiente} />
    </div>
  );
}
