import { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import ModalCR from '@/components/Modal/ModalCR'
import IconCR, { type IconName } from '@/components/Icons/IconCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { formatDate } from '@/helpers/FormatDate'
import { useMisActividades, type ActividadProps } from '@/components/TopBar/useMisActividades'
import { ACCION_AUDITORIA, COLORES_AUDITORIA, type AccionAuditoria } from '@/types/coloresAuditoriables'

/** Texto e ícono de cada acción (los colores están en types/coloresAuditoriables) */
const ACCIONES: Record<AccionAuditoria, { label: string, verbo: string, icono: IconName }> = {
  [ACCION_AUDITORIA.CREATE]: { label: 'Create', verbo: 'Creaste', icono: 'plus' },
  [ACCION_AUDITORIA.READ]: { label: 'Read', verbo: 'Consultaste', icono: 'eye' },
  [ACCION_AUDITORIA.UPDATE]: { label: 'Update', verbo: 'Actualizaste', icono: 'edit' },
  [ACCION_AUDITORIA.DELETE]: { label: 'Delete', verbo: 'Eliminaste', icono: 'trash' },
  [ACCION_AUDITORIA.LOGIN]: { label: 'Login', verbo: 'Te logeaste', icono: 'power' },
}

/** Columna de la línea (px): ancho del círculo del ícono */
const ANCHO_ICONO = 30
/** Columna de la hora, a la izquierda de la línea (cabe "10:50pm") */
const ANCHO_HORA = 64
/** Punto de la fecha en la línea (px) */
const ANCHO_PUNTO = 12
/** Altura (px) del centro del punto/ícono en su fila: ahí empieza o termina la línea */
const CENTRO_ICONO = 8 + ANCHO_ICONO / 2 // mt-2 + medio círculo
const CENTRO_PUNTO = 6 + ANCHO_PUNTO / 2 // paddingTop 6 + medio punto

/** Filas del timeline: la fecha del día (21 octubre 2026) y debajo sus acciones, en el orden en que vienen (la más reciente primero) */
type FilaTimeline = { tipo: 'dia', dia: string } | { tipo: 'accion', actividad: ActividadProps, ultimaDelDia: boolean }

const filasTimeline = (actividades: ActividadProps[]) =>
  actividades.reduce<FilaTimeline[]>((filas, a, i) => {
    const dia = formatDate(new Date(a.fecha), 'd MMMM yyyy', 'd MMMM yyyy')
    const siguiente = actividades[i + 1]
    const anterior = actividades[i - 1]
    if (!anterior || formatDate(new Date(anterior.fecha), 'd MMMM yyyy', 'd MMMM yyyy') !== dia) filas.push({ tipo: 'dia', dia })
    const ultimaDelDia = !siguiente || formatDate(new Date(siguiente.fecha), 'd MMMM yyyy', 'd MMMM yyyy') !== dia
    filas.push({ tipo: 'accion', actividad: a, ultimaDelDia })
    return filas
  }, [])

/** Tramo de la línea en una fila: arranca en el centro de la primera y termina en el centro de la última */
const Linea = ({ esPrimera, esUltima, centro }: { esPrimera: boolean, esUltima: boolean, centro: number }) => (
  <span
    className="position-absolute"
    style={{
      width: 2,
      left: '50%',
      transform: 'translateX(-50%)',
      top: esPrimera ? centro : 0,
      ...(esUltima ? { height: centro } : { bottom: 0 }),
      background: 'var(--bs-border-color)',
    }}
  />
)

/** Filtro por acción (0 = todas); el read no se registra */
const OPCIONES_ACCION = [
  { value: 0, label: 'Todas' },
  ...[ACCION_AUDITORIA.CREATE, ACCION_AUDITORIA.UPDATE, ACCION_AUDITORIA.DELETE, ACCION_AUDITORIA.LOGIN]
    .map((id) => ({ value: id, label: ACCIONES[id].label })),
]

/** '[{"peso":70},{"talla":1.7}]' → { peso: 70, talla: 1.7 } */
const aObjeto = (json: string | null): Record<string, unknown> => {
  try {
    return Object.assign({}, ...(JSON.parse(json ?? '[]') as Record<string, unknown>[]))
  } catch {
    return {}
  }
}

const mostrar = (valor: unknown) => (valor === null || valor === undefined || valor === '' ? '—' : String(valor))

/** Update: una línea por propiedad que cambió (antes → nuevo) */
const Cambios = ({ actividad }: { actividad: ActividadProps }) => {
  const antes = aObjeto(actividad.datos_anteriores)
  const nuevos = aObjeto(actividad.datos_nuevos)
  return (
    // Sombreado con el color suave del actualizado (types/coloresAuditoriables)
    <ul className={`list-unstyled small mb-0 mt-2 p-2 rounded ${COLORES_AUDITORIA[ACCION_AUDITORIA.UPDATE].fondo}`}>
      {Object.keys(nuevos).map((propiedad) => (
        <li key={propiedad} className="text-break">
          <span className="fw-bold">{propiedad}:</span> {mostrar(antes[propiedad])} → {mostrar(nuevos[propiedad])}
        </li>
      ))}
    </ul>
  )
}

type ModalMisActividadesProps = {
  show: boolean
  onHide: () => void
}

/**
 * "Mis actividades": lo último que hizo el usuario de la sesión (user_auditoria por su id_user), como timeline.
 * Se monta al abrirse (ver IconosTopbar): carga al montar y cada vez que cambia el filtro.
 */
export const ModalMisActividades = ({ show, onHide }: ModalMisActividadesProps) => {
  const { actividades, cargando, error, obtenerMisActividades } = useMisActividades()
  const [idAccion, setIdAccion] = useState(0)

  useEffect(() => {
    obtenerMisActividades(idAccion)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idAccion])

  return (
    <ModalCR onHide={onHide} show={show} size="md" position="center">
      <ModalCR.Header>
        <ModalCR.Title>Mis actividades</ModalCR.Title>
      </ModalCR.Header>
      <ModalCR.Body>
        <InputSelectCR
          label="Acción"
          options={OPCIONES_ACCION}
          defaultValue={String(idAccion)}
          onChange={(e) => setIdAccion(Number(e.target.value))}
        />
        <div className="position-relative" style={{ minHeight: 120 }}>
          <LoadingOverlay show={cargando} interno texto="Cargando actividades" />
          {error && <p className="small text-danger mb-0 text-center">No se pudieron cargar tus actividades.</p>}
          {!error && !cargando && !actividades.length && <p className="small opacity-75 mb-0 text-center">No hay actividades.</p>}
          {/* Una sola línea que pasa por cada fecha (punto) y por sus acciones (ícono de color) */}
          {filasTimeline(actividades).map((fila, i, filas) => {
            const esPrimera = i === 0
            const esUltima = i === filas.length - 1
            const conLinea = filas.length > 1
            if (fila.tipo === 'dia') {
              return (
                <div key={`dia-${fila.dia}`} className="d-flex gap-2">
                  {/* Mismo ancho que la columna de la hora: la línea queda recta */}
                  <span className="flex-shrink-0" style={{ width: ANCHO_HORA }} />
                  <div className="position-relative flex-shrink-0 d-flex justify-content-center" style={{ width: ANCHO_ICONO, paddingTop: 6 }}>
                    {conLinea && <Linea esPrimera={esPrimera} esUltima={esUltima} centro={CENTRO_PUNTO} />}
                    <span className="position-relative rounded-circle bg-secondary" style={{ width: ANCHO_PUNTO, height: ANCHO_PUNTO }} />
                  </div>
                  <h6 className="fw-bold mb-2" style={{ paddingTop: 2 }}>{fila.dia}</h6>
                </div>
              )
            }
            const a = fila.actividad
            const accion = ACCIONES[a.id_accion_realizada as AccionAuditoria]
            const colores = COLORES_AUDITORIA[a.id_accion_realizada as AccionAuditoria]
            return (
              <div key={a.id} className="d-flex gap-2">
                {/* Hora (10:50pm) fuera del card, al lado del ícono y a su altura */}
                <span
                  className="fw-bold text-nowrap text-end flex-shrink-0 mt-2 d-flex align-items-center justify-content-end"
                  style={{ width: ANCHO_HORA, height: ANCHO_ICONO }}
                >
                  {formatDate(new Date(a.fecha), 'hh:mmam', 'hh:mmam')}
                </span>
                <div className="position-relative flex-shrink-0 d-flex justify-content-center" style={{ width: ANCHO_ICONO }}>
                  {conLinea && <Linea esPrimera={esPrimera} esUltima={esUltima} centro={CENTRO_ICONO} />}
                  {/* Ícono sobre un círculo con el color de la acción */}
                  <span
                    className={`position-relative d-flex align-items-center justify-content-center rounded-circle mt-2 ${colores?.fondoIcono ?? 'bg-light'} ${colores?.colorIcono ?? ''}`}
                    style={{ width: ANCHO_ICONO, height: ANCHO_ICONO }}
                  >
                    <IconCR name={accion?.icono ?? 'no-icon'} size={15} />
                  </span>
                </div>
                {/* El espacio entre filas es margen del card: así la columna de la línea llega hasta la siguiente; más aire antes de otra fecha */}
                <Card className={`border-rounded-4 flex-grow-1 ${esUltima ? 'mb-0' : fila.ultimaDelDia ? 'mb-3' : 'mb-2'}`} style={{ minWidth: 0 }}>
                  <Card.Body className="p-2">
                    <div className="small">
                      <span className="fw-bold">{accion?.verbo ?? `Acción ${a.id_accion_realizada}`}</span>
                      {a.id_accion_realizada !== ACCION_AUDITORIA.LOGIN && a.tabla && (
                        <> en <span className="fw-bold">{a.tabla}</span></>
                      )}
                    </div>
                    <div className="small opacity-75">
                      {a.id_registro ? `Id: #${a.id_registro}` : ''}
                      {a.ip && ` desde ip: ${a.ip}`}
                    </div>
                    {a.id_accion_realizada === ACCION_AUDITORIA.UPDATE && <Cambios actividad={a} />}
                  </Card.Body>
                </Card>
              </div>
            )
          })}
        </div>
      </ModalCR.Body>
    </ModalCR>
  )
}
