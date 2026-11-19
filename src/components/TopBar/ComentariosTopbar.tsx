import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import IconCR from '@/components/Icons/IconCR'
import { NubeCR } from '@/components/NubeCR/NubeCR'
import { formatDate } from '@/helpers/FormatDate'
import { useMisComentarios, type MiComentarioProps } from '@/components/TopBar/useMisComentarios'
import { useBuscadorGlobal } from '@/components/BuscadorGlobal/useBuscadorGlobal'

/** Por tipo de persona: sección de gestión que da acceso a su perfil y la ruta del perfil (como en routes/index.tsx) */
const PERFIL_POR_TIPO: Record<number, { seccion: string, perfil: string }> = {
  1: { seccion: 'gestion-empleados', perfil: 'perfil-colaborador' },
  2: { seccion: 'gestion-clientes', perfil: 'perfil-cliente' },
  4: { seccion: 'gestion-pacientes', perfil: 'perfil-paciente' },
}

/**
 * Ícono de comentarios del Topbar: al hacer click abre una nube (como la de notificaciones) con los últimos
 * comentarios que escribió el usuario, a quién se los hizo y cuándo. Se recargan cada vez que se abre.
 * Click en un comentario: abre el perfil de esa persona (si el usuario tiene la sección de gestión de su tipo).
 * Usa los estilos de la nube de notificaciones (_Notificaciones).
 */
export const ComentariosTopbar = () => {
  const navigate = useNavigate()
  const { comentarios, cargando, error, obtenerMisComentarios } = useMisComentarios()
  const { pantallas } = useBuscadorGlobal()

  /** Ruta al perfil de la persona comentada (en el módulo donde el usuario tiene esa gestión); null si no puede abrirlo */
  const rutaPerfil = ({ persona }: MiComentarioProps) => {
    const config = PERFIL_POR_TIPO[persona?.id_tipo ?? 0]
    if (!config || !persona?.uid) return null
    const pantalla = pantallas.find((p) => p.urlSeccion === config.seccion)
    if (!pantalla) return null
    return `${pantalla.ruta.replace(`/${config.seccion}`, '')}/${config.perfil}/${persona.uid}`
  }

  return (
    <NubeCR
      abrirCon="click"
      titulo="Mis comentarios"
      onAbrir={obtenerMisComentarios}
      cargando={cargando}
      textoCargando="Cargando comentarios"
      trigger={({ abierta, ariaProps, alternar }) => (
        <button
          type="button"
          className={classNames('topbar__icon me-2 notificaciones__campana', { 'notificaciones__campana--abierta': abierta })}
          title="Mis comentarios"
          aria-label="Mis comentarios"
          onClick={alternar}
          {...ariaProps}
        >
          <IconCR name="comentarios" size={18} />
        </button>
      )}
    >
      {(cerrar: () => void) => error ? (
        <p className="small text-danger mb-0 text-center">No se pudieron cargar tus comentarios.</p>
      ) : comentarios.length === 0 ? (
        <p className="small opacity-75 mb-0 text-center">{cargando ? '' : 'Todavía no has hecho comentarios.'}</p>
      ) : (
        <ul className="notificaciones__lista">
          {comentarios.map((c) => {
            const ruta = rutaPerfil(c)
            const contenido = (
              <>
                <span className="notificaciones__icono">
                  <IconCR name="comentarios" size={16} />
                </span>
                <span className="notificaciones__texto">
                  <span className="notificaciones__titulo">{c.persona?.nombre || 'Persona no encontrada'}</span>
                  <span className="notificaciones__mensaje">{c.comentario}</span>
                  <span className="notificaciones__fecha">{formatDate(new Date(c.createdAt), 'dd/mm/yyyy hh:mm', 'dd/mm/yyyy hh:mm')}</span>
                </span>
              </>
            )
            return (
              <li key={c.id}>
                {ruta ? (
                  <button
                    type="button"
                    className="notificaciones__item"
                    title="Ver perfil"
                    onClick={() => {
                      cerrar()
                      navigate(ruta)
                    }}
                  >
                    {contenido}
                  </button>
                ) : (
                  <div className="notificaciones__item">{contenido}</div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </NubeCR>
  )
}
