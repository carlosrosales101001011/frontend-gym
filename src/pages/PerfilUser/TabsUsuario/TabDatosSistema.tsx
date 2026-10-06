import { useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { usePerfilUsuarioContexto } from '../hook/perfilUsuarioContexto'
import { usePerfilUsuario, type CambiosSistema, type OpcionColaborador } from '../hook/usePerfilUsuario'

/** Opción "sin colaborador" del select Empleado */
const SIN_EMPLEADO: OpcionColaborador = { value: 0, label: '— Sin colaborador —' }

/**
 * Datos de sistema del usuario: super usuario, rol y empleado (colaborador vinculado).
 * Edita quien lo registró o un super usuario; "super usuario" solo lo cambia un super usuario.
 */
export const TabDatosSistema = () => {
  const { perfil, recargar } = usePerfilUsuarioContexto()
  const { actualizarSistema, obtenerColaboradores } = usePerfilUsuario()
  const { data: dataRoles, cargar: cargarRoles } = useTerminologiaPersona('userRoles')
  const [colaboradores, setColaboradores] = useState<OpcionColaborador[]>([])
  const [guardando, setGuardando] = useState(false)

  const usuario = perfil!.usuario
  const { puedeEditar, puedeMarcarSuper } = perfil!
  const [superUsuario, setSuperUsuario] = useState(usuario.is_super_user)
  const [idRol, setIdRol] = useState(usuario.id_rol ?? 0)
  const [idEmpl, setIdEmpl] = useState(usuario.id_empl ?? 0)

  useEffect(() => {
    cargarRoles()
    obtenerColaboradores().then(setColaboradores).catch((error) => console.log(error))
  }, [])

  // Solo se envía lo que cambió
  const cambios: CambiosSistema = {
    ...(superUsuario !== usuario.is_super_user ? { is_super_user: superUsuario } : {}),
    ...(idRol && idRol !== usuario.id_rol ? { id_rol: idRol } : {}),
    ...(idEmpl !== (usuario.id_empl ?? 0) ? { id_empl: idEmpl } : {}),
  }
  const hayCambios = Object.keys(cambios).length > 0

  const onGuardar = async () => {
    setGuardando(true)
    if (await actualizarSistema(usuario.id, cambios)) await recargar()
    setGuardando(false)
  }

  return (
    <div className="m-3">
      {!puedeEditar && (
        <p className="small opacity-75">Solo quien registró a este usuario o un super usuario puede modificar estos datos.</p>
      )}
      <fieldset disabled={!puedeEditar} style={puedeEditar ? undefined : { pointerEvents: 'none' }}>
        <Row className="g-3">
          <Col xs={12}>
            <Form.Check
              type="switch"
              id="perfil-usuario-super"
              label="Super usuario"
              checked={superUsuario}
              disabled={!puedeMarcarSuper}
              onChange={(e) => setSuperUsuario(e.target.checked)}
            />
            {puedeEditar && !puedeMarcarSuper && (
              <div className="small opacity-75 mt-1">Solo un super usuario puede cambiar esto (y no sobre sí mismo).</div>
            )}
          </Col>
          <Col lg={6}>
            <InputSelectCR
              label="Rol"
              options={dataRoles}
              defaultValue={idRol ? String(idRol) : ''}
              onChange={(e) => setIdRol(Number(e.target.value))}
            />
          </Col>
          <Col lg={6}>
            {/* key: se monta cuando llegan los colaboradores, para que muestre el elegido */}
            <InputSelectCR
              key={colaboradores.length}
              label="Empleado"
              options={[SIN_EMPLEADO, ...colaboradores]}
              defaultValue={String(idEmpl)}
              onChange={(e) => setIdEmpl(Number(e.target.value))}
            />
          </Col>
        </Row>
      </fieldset>
      {puedeEditar && (
        <ButtonCR className="mt-3" label={guardando ? 'Guardando...' : 'Guardar'} onClick={onGuardar} disabled={!hayCambios || guardando} />
      )}
    </div>
  )
}
