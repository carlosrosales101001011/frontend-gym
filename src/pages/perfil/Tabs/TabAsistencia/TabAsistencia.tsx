import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { DataTableSimple2, type ColumnaSimple2 } from '@/components/DataTableSimple/DataTableSimple2'
import { CardResumen } from '@/components/CardResumen/CardResumen'
import { PersonaConAvatar } from '@/components/Avatar/PersonaConAvatar'
import { ButtonCR } from '@/components/Button/ButtonCR'
import IconCR from '@/components/Icons/IconCR'
import { formatDate } from '@/helpers/FormatDate'
import { useRegistrarAsistencia } from '@/hook/useRegistrarAsistencia'
import { useAsistenciasCliente, type AsistenciaClienteProps } from './useAsistenciasCliente'

type TabAsistenciaProps = {
  /** Si el tab está a la vista: cada vez que se activa se vuelven a pedir las asistencias */
  activo: boolean
}

/**
 * Asistencias del cliente del perfil: resumen (total y última), botón para registrar una ahora (revisa su membresía,
 * igual que el buscador) y la tabla con fecha y quién la registró.
 */
export const TabAsistencia = ({ activo }: TabAsistenciaProps) => {
  const { uid_person } = useParams<{ uid_person: string }>()
  const { asistencias, persona, cargando, obtenerAsistencias } = useAsistenciasCliente()
  const { registrarAsistencia, registrandoId } = useRegistrarAsistencia()

  useEffect(() => {
    if (activo && uid_person) obtenerAsistencias(uid_person)
  }, [activo, uid_person])

  const onRegistrar = async () => {
    if (!persona || !uid_person) return
    const nombre = [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' ')
    if (await registrarAsistencia(persona.id, nombre, true)) obtenerAsistencias(uid_person)
  }

  // El backend las manda de la más reciente a la más antigua
  const ultima = asistencias[0]

  const columnas: ColumnaSimple2<AsistenciaClienteProps>[] = [
    {
      id: 'fecha',
      header: 'Fecha y hora',
      render: (asistencia) => formatDate(new Date(asistencia.fecha_registro), 'yyyy-mm-dd', 'dd/mm/yyyy hh:mm'),
      sortValue: (asistencia) => asistencia.fecha_registro,
    },
    {
      id: 'registrado-por',
      header: 'Registrado por',
      // Las registradas antes de guardar quién las crea no lo tienen
      render: (asistencia) => asistencia.label_nombres_apellidos_usercreated
        ? <PersonaConAvatar nombre={asistencia.label_nombres_apellidos_usercreated} avatar={asistencia.avatar_usercreated} />
        : <span className="opacity-50">—</span>,
      searchValue: (asistencia) => asistencia.label_nombres_apellidos_usercreated ?? '',
    },
  ]

  return (
    <div className="position-relative p-2" style={{ minHeight: '160px' }}>
      <LoadingOverlay show={cargando} interno texto="Cargando asistencias" />
      <Row className="g-3 mb-3">
        <Col md={6} sm={12}>
          <CardResumen icono="check" titulo="Total de asistencias" valor={asistencias.length} cargando={cargando} />
        </Col>
        <Col md={6} sm={12}>
          <CardResumen
            icono="calendar"
            titulo="Última asistencia"
            valor={ultima ? <span className="text-capitalize">{formatDate(new Date(ultima.fecha_registro), 'yyyy-mm-dd', 'd MMMM yyyy, hh:mmam')}</span> : '—'}
            cargando={cargando}
          />
        </Col>
      </Row>
      <div className="d-flex justify-content-end mb-2">
        <ButtonCR
          label="Registrar asistencia"
          icon={<IconCR name="plus" size={14} />}
          onClick={onRegistrar}
          disabled={!persona || registrandoId !== null}
        />
      </div>
      {!cargando && asistencias.length === 0 ? (
        <p className="small opacity-75 mb-0">El cliente no tiene asistencias.</p>
      ) : (
        <DataTableSimple2 columns={columnas} data={asistencias} />
      )}
    </div>
  )
}
