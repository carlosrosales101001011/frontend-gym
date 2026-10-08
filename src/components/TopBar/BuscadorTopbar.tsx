import { useEffect, useState } from 'react'
import IconCR from '@/components/Icons/IconCR'
import ModalCR from '@/components/Modal/ModalCR'
import { BuscadorGlobal } from '@/components/BuscadorGlobal/BuscadorGlobal'

/**
 * Buscador global en el Topbar como una lupa (al lado del nombre del usuario): al pulsarla, o con Ctrl+K,
 * se abre un modal grande (ModalCR) con el buscador ya enfocado. Se cierra con Esc, la X o al elegir un resultado.
 * (En el Home el buscador va completo, sin lupa.) Estilos de la lupa en _TopBar.scss (.buscador-topbar).
 */
export const BuscadorTopbar = () => {
  const [abierto, setAbierto] = useState(false)

  // Ctrl+K / Cmd+K abre el modal desde cualquier pantalla con Topbar
  useEffect(() => {
    const alAtajo = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setAbierto(true)
      }
    }
    document.addEventListener('keydown', alAtajo)
    return () => document.removeEventListener('keydown', alAtajo)
  }, [])

  const cerrar = () => setAbierto(false)

  return (
    <>
      <button
        type="button"
        className={`topbar__icon buscador-topbar__lupa ${abierto ? 'buscador-topbar__lupa--abierta' : ''}`}
        onClick={() => setAbierto(true)}
        title="Buscar (Ctrl + K)"
        aria-label="Buscar pantallas, clientes o colaboradores"
      >
        <IconCR name="search" size={18} className="" />
      </button>
      {/* Se monta al abrir: arranca vacío y con el campo enfocado */}
      {abierto && (
        <ModalCR show onHide={cerrar} size="lg" position="top">
          <ModalCR.Header>
            <ModalCR.Title>Buscar</ModalCR.Title>
          </ModalCR.Header>
          <ModalCR.Body>
            <BuscadorGlobal enModal autoFocus onCerrar={cerrar} />
            <p className="small opacity-75 mt-3 mb-0">
              Pantallas de tus módulos, clientes y colaboradores · ↑ ↓ para moverte, Enter para abrir, Esc para cerrar
            </p>
          </ModalCR.Body>
        </ModalCR>
      )}
    </>
  )
}
