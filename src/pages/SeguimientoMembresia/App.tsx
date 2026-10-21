import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { DataTableSeguimiento } from "./DataTableSeguimiento"
import { diasVencidos } from "@/helpers/diasMembresia"
import { useSeguimientoMembresiaStore } from "./useSeguimientoMembresiaStore"
import { useEffect, useMemo, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { ExportSeguimientoMembresia } from "./ExportSeguimientoMembresia"
import type { SeguimientoMembresiaProps } from "./store/seguimientoMembresiaSlice"
import { ultimaMembresiaPorCliente } from "./helpers/seguimiento"

export const App = () => {
    const { obtenerMembresiaSeguimiento, SeguimientoMembresias } = useSeguimientoMembresiaStore()
    // Lo que se ve en cada tabla (con su buscador y orden): es lo que se descarga
    const [visiblesActivos, setVisiblesActivos] = useState<SeguimientoMembresiaProps[]>([])
    const [visiblesInactivos, setVisiblesInactivos] = useState<SeguimientoMembresiaProps[]>([])
    useEffect(() => {
        obtenerMembresiaSeguimiento()
    }, [])

    // Solo la última membresía de cada cliente, luego:
    // Activos: fecha_actual <= fecha_vencimiento (el dia del vencimiento aun cuenta como activo)
    // Inactivos: fecha_actual > fecha_vencimiento
    const { activos, inactivos } = useMemo(() => {
        const conFecha = ultimaMembresiaPorCliente(SeguimientoMembresias).filter((m) => m.fecha_vencimiento)
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
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <h5 className="fw-bold mb-0 fs-4">Clientes activos ({activos.length})</h5>
                        {/* <ExportSeguimientoMembresia filas={visiblesActivos} tipo="activo"/> */}
                    </div>
                    <DataTableSeguimiento data={activos} tipo="activo" onFilasVisibles={setVisiblesActivos}/>
                </div>
            </Col>
            <Col md={6}>
                <div className="p-2 card-actual h-100">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <h5 className="fw-bold mb-0 fs-4">Clientes inactivos ({inactivos.length})</h5>
                        {/* <ExportSeguimientoMembresia filas={visiblesInactivos} tipo="inactivo"/> */}
                    </div>
                    <DataTableSeguimiento data={inactivos} tipo="inactivo" onFilasVisibles={setVisiblesInactivos}/>
                </div>
            </Col>
        </Row>
    </div>
  )
}
