import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { DataTableSeguimiento, diasVencidos } from "./DataTableSeguimiento"
import { useSeguimientoMembresiaStore } from "./useSeguimientoMembresiaStore"
import { useEffect, useMemo } from "react"
import { Col, Row } from "react-bootstrap"

export const App = () => {
    const { obtenerMembresiaSeguimiento, SeguimientoMembresias } = useSeguimientoMembresiaStore()
    useEffect(() => {
        obtenerMembresiaSeguimiento()
    }, [])

    // Activos: fecha_actual <= fecha_vencimiento (el dia del vencimiento aun cuenta como activo)
    // Inactivos: fecha_actual > fecha_vencimiento
    const { activos, inactivos } = useMemo(() => {
        const conFecha = SeguimientoMembresias.filter((m) => m.fecha_vencimiento)
        return {
            activos: conFecha.filter((m) => diasVencidos(m.fecha_vencimiento) <= 0),
            inactivos: conFecha.filter((m) => diasVencidos(m.fecha_vencimiento) > 0),
        }
    }, [SeguimientoMembresias])

  return (
    <div>
        <PageBreadCumb title="Seguimiento"/>
        <Row className="g-3 m-0">
            <Col md={6}>
                <div className="p-2 card-actual h-100">
                    <h5 className="fw-bold mb-2 fs-4">Clientes activos ({activos.length})</h5>
                    <DataTableSeguimiento data={activos} tipo="activo"/>
                </div>
            </Col>
            <Col md={6}>
                <div className="p-2 card-actual h-100">
                    <h5 className="fw-bold mb-2 fs-4">Clientes inactivos ({inactivos.length})</h5>
                    <DataTableSeguimiento data={inactivos} tipo="inactivo"/>
                </div>
            </Col>
        </Row>
    </div>
  )
}
