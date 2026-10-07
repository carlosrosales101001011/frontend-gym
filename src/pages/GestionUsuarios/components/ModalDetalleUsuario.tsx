import { useEffect, type ReactNode } from 'react'
import { parseISO } from 'date-fns'
import ModalCR from '@/components/Modal/ModalCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { formatDate } from '@/helpers/FormatDate'
import { useAppSelector } from '@/stores/Store'
import { BadgeEstado } from '@/components/Badge/BadgeEstado'
import { useGestionUsuariosStore } from '../hook/useGestionUsuariosStore'
import { ID_ESTADO_ACTIVO, type UserProps } from '../store/usuariosSlice'

type ModalDetalleUsuarioProps = {
  usuario: UserProps
  onHide: () => void
}

const SIN_DATO = <span className="opacity-50">—</span>

/** Fila etiqueta / valor del detalle */
const Dato = ({ etiqueta, children }: { etiqueta: string, children: ReactNode }) => (
  <div className="d-flex justify-content-between gap-3 py-2 border-bottom">
    <span className="small opacity-75">{etiqueta}</span>
    <span className="fw-semibold text-end text-break">{children}</span>
  </div>
)

/**
 * Detalle de un usuario (solo lectura) desde Gestión de usuarios: usa los datos de la fila; el nombre del
 * colaborador sale de las opciones de empleados. Se monta al abrirse (ver DataTableUsuarios).
 */
export const ModalDetalleUsuario = ({ usuario, onHide }: ModalDetalleUsuarioProps) => {
  const { obtenerOpcionesEmpleados } = useGestionUsuariosStore()
  const { opcionesEmpleados } = useAppSelector((state) => state.USER)

  useEffect(() => {
    if (!opcionesEmpleados.length) obtenerOpcionesEmpleados()
  }, [])

  const colaborador = opcionesEmpleados.find((opcion) => opcion.value === usuario.id_empl)?.label
  const fechaCreacion = usuario.fecha_creacion ? formatDate(parseISO(usuario.fecha_creacion), 'yyyy-mm-dd', 'd MMMM yyyy, hh:mmam') : ''

  return (
    <ModalCR onHide={onHide} show size="md" position="center">
      <ModalCR.Header>
        <ModalCR.Title>Detalle del usuario</ModalCR.Title>
      </ModalCR.Header>
      <ModalCR.Body>
        <div className="mb-3">
          <div className="fs-5 fw-bold">{`${usuario.nombres} ${usuario.apellidos}`.trim()}</div>
          {usuario.usuario && <div className="small opacity-75">@{usuario.usuario}</div>}
        </div>
        <Dato etiqueta="Id">{usuario.id}</Dato>
        <Dato etiqueta="Usuario">{usuario.usuario || SIN_DATO}</Dato>
        <Dato etiqueta="Correo electrónico">{usuario.email || SIN_DATO}</Dato>
        <Dato etiqueta="Correo corporativo">{usuario.email_corporativo || SIN_DATO}</Dato>
        <Dato etiqueta="Teléfono">{usuario.telefono || SIN_DATO}</Dato>
        <Dato etiqueta="Rol">{usuario.label_rol || SIN_DATO}</Dato>
        <Dato etiqueta="Colaborador">{colaborador || (usuario.id_empl ? `#${usuario.id_empl}` : SIN_DATO)}</Dato>
        <Dato etiqueta="Super usuario">{usuario.is_super_user ? 'Sí' : 'No'}</Dato>
        <Dato etiqueta="Estado"><BadgeEstado activo={usuario.id_estado === ID_ESTADO_ACTIVO} /></Dato>
        <Dato etiqueta="Creado por">{usuario.label_nombres_apellidos_userParent || SIN_DATO}</Dato>
        <Dato etiqueta="Fecha de creación">{fechaCreacion || SIN_DATO}</Dato>
        <div className="d-flex mt-3">
          <ButtonCR label="Cerrar" variant="link" onClick={onHide} />
        </div>
      </ModalCR.Body>
    </ModalCR>
  )
}
