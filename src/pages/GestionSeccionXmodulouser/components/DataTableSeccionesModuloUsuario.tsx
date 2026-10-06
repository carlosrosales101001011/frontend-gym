import IconCR, { type IconName } from '@/components/Icons/IconCR'
import { DataTableTest } from '@/components/DataTableTest/DataTableTest'
import { useAppSelector } from '@/stores/Store'
import type { UsuarioModulosProps } from '@/pages/GestionModuloxUsuario/store/modulosUsuarioSlice'

type DataTableSeccionesModuloUsuarioProps = {
  /** Abre el modal de secciones del módulo del usuario (id de modulo_x_user) */
  onAbrirModulo: (idModuloUser: number) => void
}

/** Usuarios que administra quien está logueado; el ícono de cada módulo abre sus secciones */
export const DataTableSeccionesModuloUsuario = ({ onAbrirModulo }: DataTableSeccionesModuloUsuarioProps) => {
  const { usuarios } = useAppSelector((state) => state.SECCIONXMODULOUSER)

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
      header: 'Módulos', id: 2,
      render: (row: UsuarioModulosProps) => row.modulos.length === 0
        ? <span className="small opacity-50">Sin módulos</span>
        : (
          <div className="modulos-usuario__chips">
            {row.modulos.map((m) => (
              <span key={m.id} className="modulos-usuario__chip" title={m.modulo.descripcion}>
                <button type="button" className="modulos-usuario__chip-boton m-0" onClick={() => onAbrirModulo(m.id)}
                  title="Ver y editar sus secciones" aria-label={`Secciones de ${m.modulo.label}`}>
                  <IconCR name={(m.modulo.icono || 'no-icon') as IconName} size={13} className="" />
                </button>
                {m.modulo.label}
                <span className="modulos-usuario__contador">{m.secciones.length}</span>
              </span>
            ))}
          </div>
        ),
    },
    {
      header: 'Creado por', id: 3, campoBusqueda: 'label_nombres_apellidos_userParent',
      render: (row: UsuarioModulosProps) => row.label_nombres_apellidos_userParent || <span className="opacity-50">—</span>,
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
      data={usuarios}
      columns={columns}
    />
  )
}
