import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import ModalCR from '@/components/Modal/ModalCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { BotonIcono, CandadoAsignacion, ColumnaAsignacion, TarjetaAsignable } from '@/components/AsignacionColumnas/AsignacionColumnas'
import { useArrastreColumnas } from '@/components/AsignacionColumnas/useArrastreColumnas'
import { mensajeError } from '@/helpers/mensajeError'
import { normalizeText } from '@/helpers/strings'
import { useSeccionesModuloUsuario } from '../hook/useSeccionesModuloUsuario'
import type { DetalleSeccionesProps } from '../store/seccionxmodulouserSlice'

type Columna = 'catalogo' | 'usuario'

type ModalSeccionesModuloUsuarioProps = {
  /** Módulo del usuario (id de modulo_x_user) */
  idModuloUser: number
  onHide: () => void
}

/** Para comparar si hubo cambios */
const firma = (ids: number[]) => [...ids].sort((a, b) => a - b).join(',')

/**
 * Secciones de un módulo del usuario: a la izquierda todas las secciones del sistema y a la derecha las del
 * usuario. Se pasan arrastrando o con las flechas. Solo se pueden mover las que puede dar quien administra
 * (super usuario: todas; los demás: las suyas en ese módulo); el resto se ve con candado.
 * Nada se guarda hasta "Guardar". Se monta al abrirse (ver App).
 */
export const ModalSeccionesModuloUsuario = ({ idModuloUser, onHide }: ModalSeccionesModuloUsuarioProps) => {
  const { obtenerDetalle, guardarSecciones } = useSeccionesModuloUsuario()
  const [detalle, setDetalle] = useState<DetalleSeccionesProps | null>(null)
  // Secciones del usuario que se pueden mover (las demás del usuario quedan fijas)
  const [asignadas, setAsignadas] = useState<number[]>([])
  const [inicial, setInicial] = useState<number[]>([])
  const [filtro, setFiltro] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    obtenerDetalle(idModuloUser)
      .then((datos) => {
        const permitidas = new Set(datos.idsPermitidas)
        const movibles = datos.moduloUsuario.secciones.filter((sec) => permitidas.has(sec.id)).map((sec) => sec.id)
        setDetalle(datos)
        setAsignadas(movibles)
        setInicial(movibles)
      })
      .catch((e) => {
        Swal.fire({ icon: 'error', title: 'No se pudieron cargar las secciones', html: mensajeError(e) })
        onHide()
      })
  }, [])

  const asignar = (id: number) => setAsignadas((lista) => lista.includes(id) ? lista : [...lista, id])
  const quitar = (id: number) => setAsignadas((lista) => lista.filter((x) => x !== id))
  const { zona, arrastre } = useArrastreColumnas<Columna>(true, (id, destino) =>
    destino === 'usuario' ? asignar(id) : quitar(id))

  const onGuardar = async () => {
    setGuardando(true)
    const guardado = await guardarSecciones(idModuloUser, asignadas)
    setGuardando(false)
    if (guardado) onHide()
  }

  const permitidas = new Set(detalle?.idsPermitidas ?? [])
  const catalogo = detalle?.catalogo ?? []
  const seccionPorId = new Map(catalogo.map((sec) => [sec.id, sec]))
  // Del usuario y que no se pueden quitar
  const fijas = (detalle?.moduloUsuario.secciones ?? []).filter((sec) => !permitidas.has(sec.id))
  const idsDelUsuario = new Set([...asignadas, ...fijas.map((sec) => sec.id)])
  const texto = normalizeText(filtro.trim())
  const libres = catalogo
    .filter((sec) => !idsDelUsuario.has(sec.id))
    .filter((sec) => !texto || normalizeText(sec.label).includes(texto))
    // Primero las que se pueden pasar
    .sort((a, b) => Number(permitidas.has(b.id)) - Number(permitidas.has(a.id)))
  const hayCambios = firma(asignadas) !== firma(inicial)
  const usuario = detalle?.moduloUsuario.usuario

  return (
    <ModalCR onHide={onHide} show size="lg" position="center">
      <ModalCR.Header>
        <ModalCR.Title>Secciones del módulo</ModalCR.Title>
      </ModalCR.Header>
      <ModalCR.Body>
        <div className="position-relative" style={{ minHeight: 160 }}>
          <LoadingOverlay show={!detalle} interno texto="Cargando secciones" />
          {detalle && (
            <>
              <p className="small mb-2" style={{ opacity: 0.75 }}>
                Usuario: <strong>{usuario ? `${usuario.nombres} ${usuario.apellidos}`.trim() : `#${detalle.moduloUsuario.id_user}`}</strong>
                {' · '}Módulo: <strong>{detalle.moduloUsuario.modulo.label}</strong>
              </p>
              <input type="search" className="form-control form-control-sm mb-2 modulos-usuario__filtro" placeholder="Buscar sección…"
                value={filtro} onChange={(e) => setFiltro(e.target.value)} aria-label="Buscar sección" />

              <div className="modulos-usuario__columnas">
                <ColumnaAsignacion titulo="Todas las secciones" total={libres.length} {...zona('catalogo')}
                  vacio={texto ? 'Ninguna sección coincide' : 'El usuario ya tiene todas las secciones'}>
                  {libres.map((sec) => permitidas.has(sec.id) ? (
                    <TarjetaAsignable key={sec.id} icono={sec.icon} label={sec.label} {...arrastre(sec.id, 'catalogo')}
                      accion={<BotonIcono icono="arrowRight" titulo="Pasar al usuario" onClick={() => asignar(sec.id)} />}
                    />
                  ) : (
                    <TarjetaAsignable key={sec.id} icono={sec.icon} label={sec.label} bloqueado
                      accion={<CandadoAsignacion titulo="No tienes esta sección: no puedes darla" />}
                    />
                  ))}
                </ColumnaAsignacion>

                <ColumnaAsignacion titulo="Secciones del usuario" total={asignadas.length + fijas.length} {...zona('usuario')}
                  vacio="Arrastra aquí las secciones que tendrá el usuario">
                  {asignadas.map((id) => {
                    const sec = seccionPorId.get(id)
                    if (!sec) return null
                    return (
                      <TarjetaAsignable key={id} icono={sec.icon} label={sec.label} {...arrastre(id, 'usuario')}
                        accionInicio={<BotonIcono icono="arrowLeft" titulo="Quitar al usuario" onClick={() => quitar(id)} />}
                      />
                    )
                  })}
                  {fijas.map((sec) => (
                    <TarjetaAsignable key={`fija-${sec.id}`} icono={sec.icon} label={sec.label} bloqueado
                      accion={<CandadoAsignacion titulo="No tienes esta sección: no puedes quitarla" />}
                    />
                  ))}
                </ColumnaAsignacion>
              </div>
            </>
          )}
        </div>
        <div className="d-flex align-items-center mt-3">
          <ButtonCR label={guardando ? 'Guardando...' : 'Guardar'} onClick={onGuardar} disabled={!detalle || guardando || !hayCambios} />
          <ButtonCR label="Cancelar" variant="link" onClick={onHide} disabled={guardando} />
        </div>
      </ModalCR.Body>
    </ModalCR>
  )
}
