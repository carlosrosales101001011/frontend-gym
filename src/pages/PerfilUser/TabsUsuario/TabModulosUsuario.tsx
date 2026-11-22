import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import IconCR, { type IconName } from '@/components/Icons/IconCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import InputSwitchCR from '@/components/TextFields/InputSwitchCR'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { mensajeError } from '@/helpers/mensajeError'
import { ModalModulosUsuario } from '@/pages/GestionModuloxUsuario/components/ModalModulosUsuario'
import type { ModuloUsuarioProps } from '@/pages/GestionModuloxUsuario/store/modulosUsuarioSlice'
import { usePerfilUsuarioContexto } from '../hook/perfilUsuarioContexto'
import { usePerfilUsuario } from '../hook/usePerfilUsuario'


/**
 * Módulos del usuario: un CardSeccionCR por módulo y una fila por sección (ícono, nombre y switch).
 * Solo se listan las secciones que tiene (switch prendido). Quien puede editarlo (quien lo registró o un super usuario)
 * tiene "Agregar módulos" y al apagar el switch le quita la sección. Si no, el switch queda deshabilitado.
 * En el perfil toma el usuario del contexto; fuera de él (ej. Secciones para usuarios) se le pasa por props.
 */
export const TabModulosUsuario = ({ idUsuario: idUsuarioProp, puedeEditar: puedeEditarProp }: { idUsuario?: number, puedeEditar?: boolean } = {}) => {
  const { perfil } = usePerfilUsuarioContexto()
  const { obtenerModulos, obtenerSeccionesPermitidas, guardarSeccionesModulo } = usePerfilUsuario()
  // undefined = cargando; null = sin permiso o error
  const [modulos, setModulos] = useState<ModuloUsuarioProps[] | null | undefined>(undefined)
  /** Secciones que puede quitar quien administra, por módulo del usuario */
  const [permitidas, setPermitidas] = useState<Record<number, Set<number>>>({})
  const [guardando, setGuardando] = useState<number | null>(null)
  const [verModal, setVerModal] = useState(false)
  const idUsuario = idUsuarioProp ?? perfil!.usuario.id
  const puedeEditar = puedeEditarProp ?? perfil!.puedeEditar

  const cargarModulos = () => obtenerModulos(idUsuario).then(setModulos).catch(() => setModulos(null))

  useEffect(() => {
    cargarModulos()
  }, [idUsuario])

  // Quien puede editar: secciones que puede quitar en cada módulo (las que él puede dar)
  useEffect(() => {
    if (!puedeEditar || !modulos) return
    modulos.forEach((m) =>
      obtenerSeccionesPermitidas(m.id)
        .then(({ idsPermitidas }) => setPermitidas((actual) => ({ ...actual, [m.id]: new Set(idsPermitidas) })))
        .catch(() => undefined))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modulos?.length, puedeEditar])

  /** Quita la sección: se envían las que quedan entre las que puede dar (las demás no se tocan) */
  const quitar = async (m: ModuloUsuarioProps, idSeccion: number) => {
    const ids = m.secciones.map((s) => s.id).filter((id) => permitidas[m.id]?.has(id) && id !== idSeccion)
    setGuardando(m.id)
    try {
      const actualizado = await guardarSeccionesModulo(m.id, ids)
      setModulos((lista) => lista?.map((x) => (x.id === m.id ? { ...x, secciones: actualizado.secciones } : x)))
    } catch (e) {
      await Swal.fire({ icon: 'error', title: 'No se pudo guardar la sección', html: mensajeError(e) })
    } finally {
      setGuardando(null)
    }
  }

  if (modulos === undefined) {
    return <div className="position-relative" style={{ minHeight: 120 }}><LoadingOverlay show interno texto="Cargando módulos" /></div>
  }
  if (modulos === null) {
    return <p className="small opacity-75 m-3">Solo quien registró a este usuario o un super usuario puede ver sus módulos.</p>
  }

  return (
    <div className="m-3 d-flex flex-column gap-3">
      {verModal && <ModalModulosUsuario idUsuario={idUsuario} onHide={() => setVerModal(false)} onGuardado={cargarModulos} />}
      {puedeEditar && (
        <div>
          <ButtonCR label="Agregar módulos" onClick={() => setVerModal(true)} icon={<IconCR name="plus" size={14} />} />
        </div>
      )}
      {!modulos.length && <p className="small opacity-75 mb-0">Este usuario no tiene módulos.</p>}
      {modulos.map((m) => {
        const filas = [...m.secciones].sort((a, b) => a.label.localeCompare(b.label))
        return (
          <CardSeccionCR
            key={m.id}
            titulo={
              <div className="d-flex align-items-center gap-2">
                <IconCR name={(m.modulo.icono || 'no-icon') as IconName} size={16} className="" />
                <span>{m.modulo.label}</span>
                {m.is_fijado && <IconCR name="fijado" size={13} className="" />}
                {m.is_favorito && <IconCR name="estrella" size={13} className="" />}
                <span className="ms-auto small fw-normal">{m.secciones.length} secciones</span>
              </div>
            }
          >
            {!filas.length && <p className="small opacity-75 mb-0">No tiene secciones en este módulo</p>}
            {filas.map((seccion, i) => (
                <div key={seccion.id} className={`d-flex align-items-center py-1 gap-2 small ${i ? 'border-top' : ''}`}>
                  <IconCR name={(seccion.icon || 'no-icon') as IconName} size={14} className="" />
                  <span className="flex-grow-1">{seccion.label}</span>
                  {seccion.is_seccion_mantenimiento && <span className="modulos-usuario__mantenimiento">En mantenimiento</span>}
                  {/* Prendido = la tiene; al apagarlo se quita (si falla, vuelve a prenderse al cambiar la key) */}
                  <InputSwitchCR
                    key={`${seccion.id}-${guardando === m.id}`}
                    name={`seccion-${m.id}-${seccion.id}`}
                    aria-label={`Quitar ${seccion.label}`}
                    defaultValue
                    wrapperClassName="mb-0"
                    // Sin el margin-top de Bootstrap (.form-check-input), que lo bajaba respecto del nombre
                    inputClassName="mt-0"
                    disabled={!permitidas[m.id]?.has(seccion.id) || guardando === m.id}
                    onChange={() => quitar(m, seccion.id)}
                  />
                </div>
            ))}
          </CardSeccionCR>
        )
      })}
    </div>
  )
}
