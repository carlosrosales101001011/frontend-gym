import { useState, type ReactNode } from 'react'
import IconCR, { type IconName } from '@/components/Icons/IconCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { DataTableTest } from '@/components/DataTableTest/DataTableTest'
import { useAppSelector } from '@/stores/Store'
import type { ModuloUsuarioProps, UsuarioModulosProps } from '../store/modulosUsuarioSlice'
import { ListaSecciones } from './ListaSecciones'

type DataTableModulosUsuarioProps = {
  otrosBotones: ReactNode
  /** Abre el modal con el usuario de la fila */
  onEditar: (idUsuario: number) => void
}

/** Usuarios que administra quien está logueado: una fila por usuario con sus módulos */
export const DataTableModulosUsuario = ({ otrosBotones, onEditar }: DataTableModulosUsuarioProps) => {
  const { usuarios } = useAppSelector((state) => state.MODULOS_USUARIO)

  const columns = [
    { header: 'Id', id: 0, sortable: false, render: (row: UsuarioModulosProps) => row.id },
    {
      header: 'Usuario', id: 1, campoBusqueda: ['nombres', 'apellidos', 'usuario'],
      render: (row: UsuarioModulosProps) => (
        <div className="lh-sm">
          <div className="fw-semibold">{`${row.nombres} ${row.apellidos}`.trim()}</div>
          {row.usuario && <div className="small opacity-75">@{row.usuario}</div>}
        </div>
      ),
    },
    {
      header: 'Rol', id: 2, campoBusqueda: 'label_rol',
      render: (row: UsuarioModulosProps) => row.label_rol || <span className="opacity-50">—</span>,
    },
    {
      header: 'Módulos', id: 3,
      render: (row: UsuarioModulosProps) => <CeldaModulos modulos={row.modulos} />,
    },
    {
      header: 'Creado por', id: 4, campoBusqueda: 'label_nombres_apellidos_userParent',
      render: (row: UsuarioModulosProps) => row.label_nombres_apellidos_userParent || <span className="opacity-50">—</span>,
    },
    {
      header: '', id: 5, sortable: false,
      render: (row: UsuarioModulosProps) => (
        <ButtonCR label="Editar" icon={<IconCR name="edit" size={12} className="" />} variant="outline-primary"
          className="btn-sm text-nowrap" onClick={() => onEditar(row.id)} />
      ),
    },
  ]

  return (
    <DataTableTest
      congelarColumnas
      permitirOcultarColumnas
      permitirReordenarColumnas
      mostrarFlechas
      classNameTablePagination="sticky-bottom-1"
      classNameToolBar="sticky-top-1"
      otrosBotones={otrosBotones}
      data={usuarios}
      columns={columns}
    />
  )
}

/** Módulos del usuario como chips; el botón de cada chip muestra debajo sus secciones */
const CeldaModulos = ({ modulos }: { modulos: ModuloUsuarioProps[] }) => {
  const [idAbierto, setIdAbierto] = useState<number | null>(null)
  if (modulos.length === 0) return <span className="small opacity-50">Sin módulos</span>
  const abierto = modulos.find((m) => m.id === idAbierto)

  return (
    <div>
      <div className="modulos-usuario__chips">
        {modulos.map((m) => (
          <span key={m.id} className={`modulos-usuario__chip ${m.id === idAbierto ? 'modulos-usuario__chip--abierto' : ''}`} title={m.modulo.descripcion}>
            <IconCR name={(m.modulo.icono || 'no-icon') as IconName} size={13} className="" />
            {m.modulo.label}
            {m.is_fijado && <IconCR name="fijado" size={11} className="" />}
            {m.is_favorito && <IconCR name="estrella" size={11} className="" />}
            <button type="button" className="modulos-usuario__chip-boton" aria-pressed={m.id === idAbierto}
              title={m.id === idAbierto ? 'Ocultar secciones' : 'Ver secciones'} aria-label={`Secciones de ${m.modulo.label}`}
              onClick={() => setIdAbierto(m.id === idAbierto ? null : m.id)}>
              <IconCR name="secciones" size={13} className="" />
            </button>
          </span>
        ))}
      </div>
      {abierto && (
        <div className="modulos-usuario__panel modulos-usuario__panel--tabla">
          <div className="modulos-usuario__panel-titulo">Secciones de {abierto.modulo.label}</div>
          <ListaSecciones secciones={abierto.secciones} vacio="No tiene secciones en este módulo" />
        </div>
      )}
    </div>
  )
}
