import { useState } from 'react'
import IconCR from '@/components/Icons/IconCR'
import { useThemeStore } from '@/components/TopBar/useThemeStore'
import { IndicadorConexion } from '@/components/TopBar/IndicadorConexion'
import { Notificaciones } from '@/components/TopBar/Notificaciones'
import { ComentariosTopbar } from '@/components/TopBar/ComentariosTopbar'
import { ModalMisActividades } from '@/components/TopBar/ModalMisActividades'

/** Íconos de la barra superior (notificaciones, auditoría, conexión y modo claro/nocturno): se usan en el Topbar y en el Home */
export const IconosTopbar = () => {
  const { theme, toggleTheme } = useThemeStore()
  const textoTema = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo nocturno'
  const [verActividades, setVerActividades] = useState(false)
  return (
    <div className="d-flex align-items-center">
      <Notificaciones />
      {/* Auditoría: abre "Mis actividades" (se monta al abrirse, así recarga cada vez) */}
      <button type="button" className="topbar__icon me-2" title="Mis actividades" aria-label="Mis actividades" onClick={() => setVerActividades(true)}>
        <IconCR name="auditoria" size={18} />
      </button>
      {verActividades && <ModalMisActividades show onHide={() => setVerActividades(false)} />}
      <ComentariosTopbar />
      <IndicadorConexion />
      <button type="button" className="topbar__icon me-2" onClick={toggleTheme} title={textoTema} aria-label={textoTema}>
        <IconCR name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
      </button>
    </div>
  )
}
