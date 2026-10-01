import IconCR from '@/components/Icons/IconCR'
import { useThemeStore } from '@/components/TopBar/useThemeStore'
import { IndicadorConexion } from '@/components/TopBar/IndicadorConexion'

/** Íconos de la barra superior (notificaciones, conexión y modo claro/nocturno): se usan en el Topbar y en el Home */
export const IconosTopbar = () => {
  const { theme, toggleTheme } = useThemeStore()
  const textoTema = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo nocturno'
  return (
    <div className="d-flex align-items-center">
      <button
        type="button"
        className="topbar__icon me-2"
        title="Notificaciones"
        aria-label="Notificaciones"
      >
        <IconCR name='notificaciones' size={18} />
      </button>
      <IndicadorConexion />
      <button type="button" className="topbar__icon me-2" onClick={toggleTheme} title={textoTema} aria-label={textoTema}>
        <IconCR name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
      </button>
    </div>
  )
}
