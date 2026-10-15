import { useState } from 'react'
import classNames from 'classnames'
import IconCR from '@/components/Icons/IconCR'
import { NubeCR } from '@/components/NubeCR/NubeCR'
import { formatDate } from '@/helpers/FormatDate'
import { NOTIFICACIONES_FAKE } from '@/components/TopBar/notificacionesFake'

/**
 * Campanita del Topbar: al hacer click abre una nube con las notificaciones (por ahora datos de prueba,
 * ver notificacionesFake.ts). Las no leídas se marcan al hacerles click o con "Marcar todas como leídas".
 */
export const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState(NOTIFICACIONES_FAKE)
  const noLeidas = notificaciones.filter((n) => !n.leida).length

  const marcarLeida = (id?: number) =>
    setNotificaciones((lista) => lista.map((n) => (id === undefined || n.id === id ? { ...n, leida: true } : n)))

  return (
    <NubeCR
      abrirCon="click"
      titulo={
        <div className="d-flex justify-content-between align-items-center">
          <span>Notificaciones</span>
          {noLeidas > 0 && (
            <button type="button" className="btn btn-link btn-sm p-0 notificaciones__marcar" onClick={() => marcarLeida()}>
              Marcar todas como leídas
            </button>
          )}
        </div>
      }
      trigger={({ abierta, ariaProps, alternar }) => (
        <button
          type="button"
          className={classNames('topbar__icon me-2 notificaciones__campana', { 'notificaciones__campana--abierta': abierta })}
          title="Notificaciones"
          aria-label={noLeidas > 0 ? `Notificaciones (${noLeidas} sin leer)` : 'Notificaciones'}
          onClick={alternar}
          {...ariaProps}
        >
          <IconCR name='notificaciones' size={18} />
          {noLeidas > 0 && <span className="notificaciones__contador">{noLeidas}</span>}
        </button>
      )}
    >
      {notificaciones.length === 0 ? (
        <p className="small opacity-75 mb-0 text-center">No tienes notificaciones.</p>
      ) : (
        <ul className="notificaciones__lista">
          {notificaciones.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                className={classNames('notificaciones__item', { 'notificaciones__item--no-leida': !n.leida })}
                onClick={() => marcarLeida(n.id)}
              >
                <span className="notificaciones__icono">
                  <IconCR name={n.icono} size={16} />
                </span>
                <span className="notificaciones__texto">
                  <span className="notificaciones__titulo">{n.titulo}</span>
                  <span className="notificaciones__mensaje">{n.mensaje}</span>
                  <span className="notificaciones__fecha">{formatDate(n.fecha, 'dd/mm/yyyy hh:mm', 'dd/mm/yyyy hh:mm')}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </NubeCR>
  )
}
