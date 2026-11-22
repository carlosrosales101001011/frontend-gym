import { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'
import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { TabModulosUsuario } from '@/pages/PerfilUser/TabsUsuario/TabModulosUsuario'
import { useUsuariosActivos, type UsuarioActivoProps } from './hook/useUsuariosActivos'

/**
 * Secciones para usuarios: a la izquierda los usuarios activos que administra quien está logueado; a la derecha,
 * los módulos del elegido con sus secciones, igual que en su perfil (switch prendido; al apagarlo se le quita).
 */
export const App = () => {
  const { obtenerUsuariosActivos } = useUsuariosActivos()
  // undefined = cargando; null = error
  const [usuarios, setUsuarios] = useState<UsuarioActivoProps[] | null | undefined>(undefined)
  const [elegido, setElegido] = useState<UsuarioActivoProps | null>(null)

  useEffect(() => {
    obtenerUsuariosActivos().then(setUsuarios).catch(() => setUsuarios(null))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <PageBreadCumb title="Secciones para usuarios" />
      <Row className="g-3">
        <Col lg={4}>
          <CardSeccionCR titulo={`Usuarios activos${usuarios ? ` (${usuarios.length})` : ''}`}>
            {usuarios === undefined && <p className="small opacity-75 mb-0">Cargando usuarios...</p>}
            {usuarios === null && <p className="small text-danger mb-0">No se pudieron cargar los usuarios.</p>}
            {usuarios?.length === 0 && <p className="small opacity-75 mb-0">No hay usuarios activos.</p>}
            {usuarios?.map((u, i) => (
              <button
                key={u.id}
                type="button"
                className={`d-flex flex-column w-100 text-start border-0 rounded px-2 py-1 ${i ? 'mt-1' : ''} ${elegido?.id === u.id ? 'bg-black text-white' : 'bg-transparent text-reset'}`}
                onClick={() => setElegido(u)}
              >
                <span className="fw-bold">{`${u.nombres} ${u.apellidos}`.trim()}</span>
                <span className="small opacity-75">{[u.usuario && `@${u.usuario}`, u.label_rol].filter(Boolean).join(' · ')}</span>
              </button>
            ))}
          </CardSeccionCR>
        </Col>
        <Col lg={8}>
          {elegido ? (
            // key: al cambiar de usuario se vuelve a montar con sus módulos
            <TabModulosUsuario key={elegido.id} idUsuario={elegido.id} puedeEditar />
          ) : (
            <p className="small opacity-75 m-3">Elige un usuario para ver sus secciones.</p>
          )}
        </Col>
      </Row>
    </div>
  )
}
