import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { DropzoneBox } from '@/components/ImagesDropZone/DropzoneBox/DropzoneBox'
import siluetaPerfil from '@/assets/img/silueta_masculina_perfil.png'
import siluetaFrente from '@/assets/img/silueta_masculina_defrente.png'
import { Col, Row } from 'react-bootstrap'
import { useFotosPerfilNutricional, type FotoPaciente } from '../../hook/useFotosPerfilNutricional'

/**
 * Fotos del paciente en la fecha elegida: un card para la de perfil y otro para la de frente (cada cuadro vacío
 * muestra la silueta como guía). Se suben a Azure Blob Storage al elegirlas.
 */
export const CardFotosPaciente = () => {
  const { imagen, subir, quitar, deshabilitada } = useFotosPerfilNutricional()

  const foto = (titulo: string, cual: FotoPaciente, silueta: string) => (
    <CardSeccionCR titulo={titulo} className="mb-3">
      <div className="d-flex justify-content-center">
        <DropzoneBox
          imagen={imagen(cual)}
          onCargar={(archivo) => subir(cual, archivo)}
          onQuitar={() => quitar(cual)}
          disabled={deshabilitada(cual)}
          ancho={160}
          alto={200}
          texto="Arrastra, pega o haz click"
          imageReferencia={silueta}
        />
      </div>
    </CardSeccionCR>
  )

  return (
    <div className="" style={{ height: '100%' }}>
    <Row>
      <Col>
        {foto('Foto de perfil', 'fotoPerfil', siluetaPerfil)}
      </Col>
      <Col>
        {foto('Foto de frente', 'fotoFrente', siluetaFrente)}
      </Col>
    </Row>
    </div>
  )
}
