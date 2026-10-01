import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { useMembresiasCliente } from './useMembresiasCliente'
import { ItemMembresia } from './ItemMembresia'

type TabMembresiaProps = {
  /** Si el tab está a la vista: cada vez que se activa se vuelven a pedir las membresías */
  activo: boolean
}

/** Membresías del cliente del perfil (sale del seguimiento de membresías) */
export const TabMembresia = ({ activo }: TabMembresiaProps) => {
  const { uid_person } = useParams<{ uid_person: string }>()
  const { membresias, cargando, obtenerMembresias } = useMembresiasCliente()

  useEffect(() => {
    if (activo && uid_person) obtenerMembresias(uid_person)
  }, [activo, uid_person])

  return (
    <div className="position-relative p-2" style={{ minHeight: '160px' }}>
      <LoadingOverlay show={cargando} interno texto="Cargando membresías" />
      {!cargando && membresias.length === 0 ? (
        <p className="small opacity-75 mb-0">El cliente no tiene membresías.</p>
      ) : (
        <Row className="g-3">
          {membresias.map((membresia) => (
            <Col key={membresia.id} xs={12}>
              <ItemMembresia membresia={membresia} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}
