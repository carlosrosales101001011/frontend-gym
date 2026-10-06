import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import ModalCR from '@/components/Modal/ModalCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { BotonIcono, CandadoAsignacion, ColumnaAsignacion, TarjetaAsignable } from '@/components/AsignacionColumnas/AsignacionColumnas'
import { useArrastreColumnas } from '@/components/AsignacionColumnas/useArrastreColumnas'
import { nombreUsuario } from '../helpers/nombreUsuario'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { mensajeError } from '@/helpers/mensajeError'
import { useModulosUsuario, type ModuloAsignado, type OpcionUsuario } from '../hook/useModulosUsuario'
import type { ModuloProps, ModuloUsuarioProps, SeccionProps } from '../store/modulosUsuarioSlice'
import { ListaSecciones } from './ListaSecciones'
import { ChecklistSecciones } from './ChecklistSecciones'

type Columna = 'mios' | 'usuario'

type ModalModulosUsuarioProps = {
  /** Usuario a editar; 0 = Agregar (se elige en el select) */
  idUsuario: number
  onHide: () => void
}

/** Para comparar si hubo cambios: mismo orden siempre (módulos y secciones) */
const firma = (modulos: ModuloAsignado[]) =>
  JSON.stringify([...modulos]
    .sort((a, b) => a.id_modulo - b.id_modulo)
    .map((m) => ({ ...m, ids_seccion: [...m.ids_seccion].sort((a, b) => a - b) })))

/**
 * Asigna módulos a un usuario: a la izquierda "Mis módulos" (los que puede dar quien administra) y a la
 * derecha los del usuario. Se pasan arrastrando o con las flechas; en los del usuario se marca fijado y
 * favorito. Nada se guarda hasta "Guardar". Se monta al abrirse (ver App): arranca limpio cada vez.
 */
export const ModalModulosUsuario = ({ idUsuario, onHide }: ModalModulosUsuarioProps) => {
  const { obtenerOpcionesUsuarios, obtenerModulosDisponibles, obtenerModulosDeUsuario, guardarModulos } = useModulosUsuario()
  const esEdicion = idUsuario > 0
  const [usuarioId, setUsuarioId] = useState(idUsuario)
  const [opciones, setOpciones] = useState<OpcionUsuario[]>([])
  const [disponibles, setDisponibles] = useState<ModuloProps[] | null>(null)
  const [asignados, setAsignados] = useState<ModuloAsignado[]>([])
  const [inicial, setInicial] = useState<ModuloAsignado[]>([])
  // Módulos del usuario que quien administra no tiene: no los puede quitar, se muestran bloqueados
  const [ajenos, setAjenos] = useState<ModuloUsuarioProps[]>([])
  // En edición el usuario ya viene elegido: arranca cargando sus módulos
  const [cargandoUsuario, setCargandoUsuario] = useState(esEdicion)
  const [guardando, setGuardando] = useState(false)
  // Secciones que el usuario tiene en cada módulo (de lo guardado), por id_modulo
  const [seccionesUsuario, setSeccionesUsuario] = useState<Map<number, SeccionProps[]>>(new Map())
  // Módulo cuyas secciones se ven en el panel de abajo, y de qué columna
  const [verSecciones, setVerSecciones] = useState<{ id_modulo: number, columna: Columna } | null>(null)

  // Usuarios del select y "Mis módulos"
  useEffect(() => {
    Promise.all([obtenerOpcionesUsuarios(), obtenerModulosDisponibles()])
      .then(([usuarios, modulos]) => {
        setOpciones(usuarios)
        setDisponibles(modulos)
      })
      .catch((e) => {
        Swal.fire({ icon: 'error', title: 'No se pudieron cargar los módulos', html: mensajeError(e) })
        onHide()
      })
  }, [])

  // Módulos actuales del usuario elegido (necesita "Mis módulos" para separar los que no se pueden tocar)
  useEffect(() => {
    if (!usuarioId || !disponibles) return
    let vigente = true
    obtenerModulosDeUsuario(usuarioId)
      .then((modulos) => {
        if (!vigente) return
        const idsMios = new Set(disponibles.map((m) => m.id))
        const seccionesMias = new Map(disponibles.map((m) => [m.id, new Set((m.secciones ?? []).map((sec) => sec.id))]))
        const propios = modulos
          .filter((m) => idsMios.has(m.id_modulo))
          .map(({ id_modulo, is_fijado, is_favorito, secciones }) => ({
            id_modulo,
            is_fijado: !!is_fijado,
            is_favorito: !!is_favorito,
            // Solo las que puede tocar quien administra; las demás se muestran bloqueadas
            ids_seccion: (secciones ?? []).filter((sec) => seccionesMias.get(id_modulo)?.has(sec.id)).map((sec) => sec.id),
          }))
        setAsignados(propios)
        setInicial(propios)
        setAjenos(modulos.filter((m) => !idsMios.has(m.id_modulo)))
        setSeccionesUsuario(new Map(modulos.map((m) => [m.id_modulo, m.secciones ?? []])))
      })
      .catch((e) => Swal.fire({ icon: 'error', title: 'No se pudieron cargar los módulos del usuario', html: mensajeError(e) }))
      .finally(() => vigente && setCargandoUsuario(false))
    return () => { vigente = false }
  }, [usuarioId, disponibles])

  const moduloPorId = useMemo(() => new Map((disponibles ?? []).map((m) => [m.id, m])), [disponibles])
  const idsAsignados = new Set(asignados.map((m) => m.id_modulo))
  const mios = (disponibles ?? []).filter((m) => !idsAsignados.has(m.id))
  const hayCambios = firma(asignados) !== firma(inicial)
  const usuarioEditado = opciones.find((u) => u.id === usuarioId)

  /** Cambia el usuario del select: lo armado para el anterior se descarta y se cargan los módulos del nuevo */
  const elegirUsuario = (id: number) => {
    if (id === usuarioId) return
    setUsuarioId(id)
    setAsignados([])
    setInicial([])
    setAjenos([])
    setSeccionesUsuario(new Map())
    setVerSecciones(null)
    setCargandoUsuario(id > 0)
  }

  const asignar = (id_modulo: number) =>
    setAsignados((lista) => lista.some((m) => m.id_modulo === id_modulo) ? lista : [...lista, { id_modulo, is_fijado: false, is_favorito: false, ids_seccion: [] }])
  const quitar = (id_modulo: number) => setAsignados((lista) => lista.filter((m) => m.id_modulo !== id_modulo))
  const alternar = (id_modulo: number, campo: 'is_fijado' | 'is_favorito') =>
    setAsignados((lista) => lista.map((m) => m.id_modulo === id_modulo ? { ...m, [campo]: !m[campo] } : m))
  const alternarSeccion = (id_modulo: number, id_seccion: number) =>
    setAsignados((lista) => lista.map((m) => m.id_modulo !== id_modulo ? m : {
      ...m,
      ids_seccion: m.ids_seccion.includes(id_seccion) ? m.ids_seccion.filter((id) => id !== id_seccion) : [...m.ids_seccion, id_seccion],
    }))

  // Arrastrar: solo se suelta en la columna contraria
  const { zona, arrastre } = useArrastreColumnas<Columna>(!!usuarioId, (id_modulo, destino) =>
    destino === 'usuario' ? asignar(id_modulo) : quitar(id_modulo))

  /** Botón de secciones de una tarjeta: abre o cierra el panel de abajo */
  const botonSecciones = (id_modulo: number, columna: Columna) => {
    const activo = verSecciones?.id_modulo === id_modulo && verSecciones.columna === columna
    return (
      <BotonIcono icono="secciones" titulo={activo ? 'Ocultar secciones' : 'Ver secciones'} activo={activo}
        onClick={() => setVerSecciones(activo ? null : { id_modulo, columna })} />
    )
  }

  // Panel de secciones: solo si el módulo sigue en esa columna (si se pasó a la otra, se cierra)
  const panel = (() => {
    if (!verSecciones) return null
    const { id_modulo, columna } = verSecciones
    if (columna === 'mios') {
      const modulo = mios.find((m) => m.id === id_modulo)
      return modulo ? { titulo: `Tus secciones en ${modulo.label}`, secciones: modulo.secciones ?? [], vacio: 'No tienes secciones en este módulo' } : null
    }
    const asignado = asignados.find((m) => m.id_modulo === id_modulo)
    const modulo = asignado ? moduloPorId.get(id_modulo) : ajenos.find((m) => m.id_modulo === id_modulo)?.modulo
    if (!modulo) return null
    const titulo = `Secciones del usuario en ${modulo.label}`
    const delUsuario = seccionesUsuario.get(id_modulo) ?? []
    // Módulo que quien administra no tiene: solo se ven
    if (!asignado) return { titulo, secciones: delUsuario, vacio: 'El usuario no tiene secciones en este módulo' }
    const permitidas = modulo.secciones ?? []
    const idsPermitidas = new Set(permitidas.map((sec) => sec.id))
    return {
      titulo,
      checklist: (
        <ChecklistSecciones permitidas={permitidas} marcadas={asignado.ids_seccion}
          ajenas={delUsuario.filter((sec) => !idsPermitidas.has(sec.id))}
          onAlternar={(id_seccion) => alternarSeccion(id_modulo, id_seccion)} />
      ),
    }
  })()

  const onGuardar = async () => {
    if (!usuarioId) return
    setGuardando(true)
    const guardado = await guardarModulos(usuarioId, asignados)
    setGuardando(false)
    if (guardado) onHide()
  }

  const cargando = disponibles === null

  return (
    <ModalCR onHide={onHide} show size="lg" position="center">
      <ModalCR.Header>
        <ModalCR.Title>{esEdicion ? 'Editar módulos del usuario' : 'Asignar módulos a un usuario'}</ModalCR.Title>
      </ModalCR.Header>
      <ModalCR.Body>
        <div className="position-relative" style={{ minHeight: 160 }}>
          <LoadingOverlay show={cargando} interno texto="Cargando módulos" />
          {!cargando && (
            <>
              {esEdicion ? (
                <p className="small mb-3" style={{ opacity: 0.75 }}>
                  Usuario: <strong>{usuarioEditado ? nombreUsuario(usuarioEditado) : `#${usuarioId}`}</strong>
                </p>
              ) : (
                <div className="mb-3">
                  <InputSelectCR
                    label="Usuario"
                    required
                    options={opciones.map((u) => ({ value: u.id, label: nombreUsuario(u) }))}
                    defaultValue={usuarioId ? String(usuarioId) : ''}
                    onChange={(e) => elegirUsuario(Number(e.target.value))}
                  />
                  {opciones.length === 0 && <p className="small opacity-75 mt-1 mb-0">No tienes usuarios para administrar.</p>}
                </div>
              )}

              <div className={`modulos-usuario__columnas ${!usuarioId ? 'modulos-usuario__columnas--inactivas' : ''}`}>
                <ColumnaAsignacion titulo="Mis módulos" total={mios.length} {...zona('mios')}
                  vacio={!usuarioId ? 'Elige un usuario para asignarle módulos' : 'Ya le pasaste todos tus módulos'}>
                  {mios.map((modulo) => (
                    <TarjetaAsignable key={modulo.id} icono={modulo.icono} label={modulo.label} descripcion={modulo.descripcion}
                      {...arrastre(modulo.id, 'mios')}
                      accion={
                        <>
                          {botonSecciones(modulo.id, 'mios')}
                          <BotonIcono icono="arrowRight" titulo="Pasar al usuario" disabled={!usuarioId} onClick={() => asignar(modulo.id)} />
                        </>
                      }
                    />
                  ))}
                </ColumnaAsignacion>

                <ColumnaAsignacion titulo="Módulos del usuario" total={asignados.length + ajenos.length}
                  cargando={cargandoUsuario} {...zona('usuario')} vacio="Arrastra aquí los módulos que tendrá el usuario">
                  {asignados.map(({ id_modulo, is_fijado, is_favorito }) => {
                    const modulo = moduloPorId.get(id_modulo)
                    if (!modulo) return null
                    return (
                      <TarjetaAsignable key={id_modulo} icono={modulo.icono} label={modulo.label} descripcion={modulo.descripcion}
                        {...arrastre(id_modulo, 'usuario')}
                        accionInicio={<BotonIcono icono="arrowLeft" titulo="Quitar al usuario" onClick={() => quitar(id_modulo)} />}
                        accion={
                          <>
                            {botonSecciones(id_modulo, 'usuario')}
                            <BotonIcono icono={is_fijado ? 'fijado' : 'fijadoVacio'} titulo={is_fijado ? 'Fijado' : 'Fijar'}
                              activo={is_fijado} onClick={() => alternar(id_modulo, 'is_fijado')} />
                            <BotonIcono icono={is_favorito ? 'estrella' : 'estrellaVacia'} titulo={is_favorito ? 'Favorito' : 'Marcar como favorito'}
                              activo={is_favorito} onClick={() => alternar(id_modulo, 'is_favorito')} />
                          </>
                        }
                      />
                    )
                  })}
                  {ajenos.map((m) => (
                    <TarjetaAsignable key={`ajeno-${m.id}`} icono={m.modulo.icono} label={m.modulo.label} descripcion={m.modulo.descripcion} bloqueado
                      accion={
                        <>
                          {botonSecciones(m.id_modulo, 'usuario')}
                          <CandadoAsignacion titulo="No tienes este módulo: no puedes quitarlo" />
                        </>
                      }
                    />
                  ))}
                </ColumnaAsignacion>
              </div>

              {panel && (
                <div className="modulos-usuario__panel">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="modulos-usuario__panel-titulo">{panel.titulo}</div>
                    <BotonIcono icono="times" titulo="Cerrar secciones" onClick={() => setVerSecciones(null)} />
                  </div>
                  {'checklist' in panel
                    ? panel.checklist
                    : <ListaSecciones secciones={panel.secciones} vacio={panel.vacio} />}
                </div>
              )}
            </>
          )}
        </div>
        <div className="d-flex align-items-center mt-3">
          <ButtonCR label={guardando ? 'Guardando...' : 'Guardar'} onClick={onGuardar}
            disabled={!usuarioId || cargandoUsuario || guardando || !hayCambios} />
          <ButtonCR label="Cancelar" variant="link" onClick={onHide} disabled={guardando} />
        </div>
      </ModalCR.Body>
    </ModalCR>
  )
}
