
import { Col, Row } from 'react-bootstrap'
import { useEffect } from 'react'
import { usePerfilColaboradorStore } from '../../hook/usePerfilColaboradorStore'
import { useSelector } from 'react-redux'
import type { RootState } from '@/stores/Store';
import { useParams } from 'react-router-dom';
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { formatDate } from '@/helpers/FormatDate'
import { differenceInYears } from 'date-fns'
import { FieldInfo } from '@/components/FieldText/FieldInfo'
import { localDateStringToDate } from '@/helpers/getDate'
import { CardObjetivoPrincipal } from './CardObjetivoPrincipal'
import { CardHabitosEstiloVida } from './CardHabitosEstiloVida'
import { CardFotosPaciente } from './CardFotosPaciente'
/** Datos más juntos (la mitad del espacio normal): vertical m-1 p-1 → p-1, horizontal 1.5rem → 0.75rem */
const JUNTOS = 'p-1'
const FILA_JUNTA = { '--bs-gutter-x': '0.75rem' } as React.CSSProperties
type TabDatosNutricionalesProps = {
  /** Si el tab está a la vista: cada vez que se activa se vuelven a pedir los datos (por defecto siempre) */
  activo?: boolean
}
/** Datos nutricionales: datos del paciente (solo lectura) y objetivo principal */
export const TabDatosNutricionales = ({ activo = true }: TabDatosNutricionalesProps) => {
  // El perfil de cliente usa :uid_person; se mantiene :uid_cliente por la pantalla anterior de PerfilCliente
  const { uid_person, uid_cliente } = useParams<{ uid_person: string, uid_cliente: string }>();
  const uid = uid_person ?? uid_cliente ?? '';
  const { obtenerDataColaboradorxUID, loading } = usePerfilColaboradorStore()
  const {colaborador} = useSelector((state: RootState)=>state.PERFIL_COLABORADOR)
  const { data:dataGeneroPersona, cargar:cargarGeneroPersona } = useTerminologiaPersona('GeneroPersona');
  // Fecha de la base (yyyy-mm-dd o ISO) como día local, sin corrimiento por zona horaria
  const nacimiento = colaborador.fecha_nacimiento ? localDateStringToDate(String(colaborador.fecha_nacimiento).slice(0, 10)) : null
  useEffect(() => {
    if (!activo || !uid) return
    obtenerDataColaboradorxUID(uid)
    cargarGeneroPersona()
  }, [activo, uid])
  if (loading)return( <>LOADING</>)
    return (
    <div>
          {/* 3 columnas: en la 1ra van los cards; en la 2da el objetivo principal; en la 3ra hábitos y estilo de vida */}
          <Row>
            <Col lg={4}>
              {/* Solo lectura: se editan desde la gestión de pacientes */}
              <CardSeccionCR titulo="Datos personales" className="mb-3">
                <Row style={FILA_JUNTA}>
                  <Col xs={6}><FieldInfo className={JUNTOS} label="Nombres" value={colaborador.nombres || '—'}/></Col>
                  <Col xs={6}><FieldInfo className={JUNTOS} label="Apellidos" value={[colaborador.apellido_paterno, colaborador.apellido_materno].filter(Boolean).join(' ') || '—'}/></Col>
                  <Col xs={6}><FieldInfo className={JUNTOS} label="Sexo" value={dataGeneroPersona.find((g) => g.value === Number(colaborador.id_genero))?.label ?? '—'}/></Col>
                  <Col xs={6}><FieldInfo className={JUNTOS} label="Fecha de nacimiento" value={nacimiento ? formatDate(nacimiento, 'yyyy-mm-dd', 'dd/mm/yyyy') : '—'}/></Col>
                  <Col xs={6}><FieldInfo className={JUNTOS} label="Edad" value={nacimiento ? `${differenceInYears(new Date(), nacimiento)} años` : '—'}/></Col>
                </Row>
              </CardSeccionCR>
              <CardSeccionCR titulo="Contacto" className="mb-3">
                {/* Solo lectura, igual que "Datos personales" */}
                <Row style={FILA_JUNTA}>
                  <Col xs={6}><FieldInfo className={JUNTOS} label="Teléfono" value={colaborador.telefono?.trim() || '—'}/></Col>
                  <Col xs={6}><FieldInfo className={JUNTOS} label="Email personal" value={<span className="text-break">{colaborador.email_personal?.trim() || '—'}</span>}/></Col>
                </Row>
              </CardSeccionCR>
            </Col>
            <Col lg={4} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
              <CardFotosPaciente />
            </Col>
            <Col lg={4}>
              <CardHabitosEstiloVida />
              <CardObjetivoPrincipal />
            </Col>
          </Row>
    </div>
  )
}
