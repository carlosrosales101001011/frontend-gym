import { useState } from 'react'
import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { DropzoneBox } from '@/components/ImagesDropZone/DropzoneBox/DropzoneBox'
import siluetaPerfil from '@/assets/img/silueta_masculina_perfil.png'
import siluetaFrente from '@/assets/img/silueta_masculina_defrente.png'
import { Col, Row } from 'react-bootstrap'

/**
 * Fotos del paciente: un card para la de perfil y otro para la de frente (cada cuadro vacío muestra la silueta como guía).
 * Por ahora solo en pantalla: todavía no se suben ni se guardan.
 */
export const CardFotosPaciente = () => {
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null)
  const [fotoFrente, setFotoFrente] = useState<File | null>(null)

  const foto = (titulo: string, imagen: File | null, cambiar: (archivo: File | null) => void, silueta: string) => (
    <CardSeccionCR titulo={titulo} className="mb-3">
      <div className="d-flex justify-content-center">
        <DropzoneBox imagen={imagen} onCargar={cambiar} onQuitar={() => cambiar(null)} ancho={160} alto={200} texto="Arrastra, pega o haz click" imageReferencia={silueta} />
      </div>
    </CardSeccionCR>
  )

  return (
    <div className="" style={{ height: '100%' }}>
    <Row>
      <Col>
        {foto('Foto de perfil', fotoPerfil, setFotoPerfil, siluetaPerfil)}
      </Col>
      <Col>
        {foto('Foto de frente', fotoFrente, setFotoFrente, siluetaFrente)}
      </Col>
    </Row>
    </div>
  )
}
