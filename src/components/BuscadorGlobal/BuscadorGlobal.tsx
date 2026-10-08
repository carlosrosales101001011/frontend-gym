import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IconCR, { type IconName } from '@/components/Icons/IconCR'
import { AvatarCirculo } from '@/components/Avatar/AvatarCirculo'
import { ajusteAvatarUltimo } from '@/components/Avatar/encuadreFoto'
import { useBuscarPersona, type PersonaBuscada } from '@/components/BuscadorPersona/useBuscarPersona'
import { getBlobUrl } from '@/helpers/blobUrl'
import { normalizeText } from '@/helpers/strings'
import { useRegistrarAsistencia } from '@/pages/GestionAsistencias/hook/useRegistrarAsistencia'
import { useBuscadorGlobal, type PantallaBuscable } from './useBuscadorGlobal'

const MAX_PANTALLAS = 8
const MAX_PERSONAS = 6
/** Letras mínimas para buscar personas (las pantallas se filtran desde la primera) */
const MIN_LETRAS_PERSONAS = 2
const ESPERA_MS = 300
const ID_TIPO_CLIENTE = 2
/** Sección que permite registrar asistencias (url de nav_seccion) */
const SECCION_ASISTENCIA = 'asistencia'

/**
 * Por tipo de persona: nombre y, si se puede abrir su perfil desde aquí, la sección que da acceso y la ruta.
 * Los colaboradores no abren perfil desde el buscador (solo se les registra asistencia).
 */
const PERFIL_POR_TIPO: Record<number, { nombre: string, seccion?: string, perfil?: string }> = {
  1: { nombre: 'Colaborador' },
  2: { nombre: 'Cliente', seccion: 'gestion-clientes', perfil: 'perfil-cliente' },
}

type Resultado =
  | { tipo: 'pantalla', pantalla: PantallaBuscable }
  | { tipo: 'persona', persona: PersonaBuscada, ruta: string | null }

type BuscadorGlobalProps = {
  /** Versión angosta para el Topbar (al lado del breadcrumb) */
  compacto?: boolean
  /** Enfoca el campo al montarse (ej. al abrirlo desde la lupa del Topbar) */
  autoFocus?: boolean
  /** Se llama con Esc o al elegir un resultado (ej. para cerrar el modal del Topbar) */
  onCerrar?: () => void
  /** Dentro de un modal: los resultados van debajo del campo (no flotando) y no se cierran al perder el foco */
  enModal?: boolean
}

/**
 * Buscador del Home (grande) y del Topbar (compacto): pantallas (secciones de los módulos del usuario) y personas.
 * Clientes: Enter/click abre su perfil. Colaboradores: no abren perfil. A todos se les puede registrar asistencia
 * (botón, si el usuario tiene la sección de asistencia). Ctrl+K lo enfoca; ↑ ↓ y Enter eligen; Esc cierra.
 * Estilos en _BuscadorGlobal.scss.
 */
export const BuscadorGlobal = ({ compacto = false, autoFocus = false, onCerrar, enModal = false }: BuscadorGlobalProps) => {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const { pantallas, cargandoPantallas } = useBuscadorGlobal()
  const { personas, cargando: cargandoPersonas, buscarPersona } = useBuscarPersona()
  const [texto, setTexto] = useState('')
  const [abierto, setAbierto] = useState(false)
  const [activo, setActivo] = useState(0)
  const { registrarAsistencia, registrandoId } = useRegistrarAsistencia()

  // autoFocus: se enfoca después de montarse (un modal que se abre toma el foco primero; así queda en el campo)
  useEffect(() => {
    if (!autoFocus) return
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [autoFocus])

  // Ctrl+K / Cmd+K enfoca el buscador desde cualquier parte del Home
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setAbierto(true)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Personas: se buscan en el backend un rato después de dejar de escribir
  const consulta = texto.trim()
  const buscaPersonas = consulta.length >= MIN_LETRAS_PERSONAS
  useEffect(() => {
    if (!buscaPersonas) return
    const ctrl = new AbortController()
    const espera = setTimeout(() => buscarPersona(consulta, ctrl.signal), ESPERA_MS)
    return () => {
      clearTimeout(espera)
      ctrl.abort()
    }
  }, [consulta])

  // Pantallas: todas las palabras deben estar en "sección módulo" (sin tildes ni mayúsculas)
  const pantallasFiltradas = useMemo(() => {
    const palabras = normalizeText(consulta).split(/\s+/).filter(Boolean)
    if (!palabras.length) return []
    return pantallas
      .filter((p) => {
        const haystack = normalizeText(`${p.label} ${p.modulo}`)
        return palabras.every((palabra) => haystack.includes(palabra))
      })
      .slice(0, MAX_PANTALLAS)
  }, [pantallas, consulta])

  // Perfil de una persona: solo si su tipo abre perfil y el usuario tiene la sección de gestión de ese tipo
  const rutaPerfil = (persona: PersonaBuscada) => {
    const config = PERFIL_POR_TIPO[persona.id_tipo ?? 0]
    if (!config?.seccion || !config.perfil || !persona.uid) return null
    const pantalla = pantallas.find((p) => p.urlSeccion === config.seccion)
    if (!pantalla) return null
    return `${pantalla.ruta.replace(`/${config.seccion}`, '')}/${config.perfil}/${persona.uid}`
  }
  const puedeRegistrarAsistencia = pantallas.some((p) => p.urlSeccion === SECCION_ASISTENCIA)

  const personasVisibles = buscaPersonas ? personas.slice(0, MAX_PERSONAS) : []
  const resultados: Resultado[] = [
    ...pantallasFiltradas.map((pantalla) => ({ tipo: 'pantalla' as const, pantalla })),
    ...personasVisibles.map((persona) => ({ tipo: 'persona' as const, persona, ruta: rutaPerfil(persona) })),
  ]
  const indiceActivo = Math.min(activo, Math.max(0, resultados.length - 1))

  const elegir = (resultado: Resultado) => {
    const ruta = resultado.tipo === 'pantalla' ? resultado.pantalla.ruta : resultado.ruta
    if (!ruta) return
    setAbierto(false)
    navigate(ruta)
    onCerrar?.()
  }

  const onTeclado = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setAbierto(false)
      inputRef.current?.blur()
      onCerrar?.()
    } else if (e.key === 'ArrowDown' && resultados.length) {
      e.preventDefault()
      setAbierto(true)
      setActivo((indiceActivo + 1) % resultados.length)
    } else if (e.key === 'ArrowUp' && resultados.length) {
      e.preventDefault()
      setActivo((indiceActivo - 1 + resultados.length) % resultados.length)
    } else if (e.key === 'Enter' && resultados[indiceActivo]) {
      e.preventDefault()
      elegir(resultados[indiceActivo])
    }
  }

  const mostrarPanel = (enModal || abierto) && consulta.length > 0
  const cargandoLista = buscaPersonas && cargandoPersonas
  const sinResultados = !resultados.length && !cargandoLista && !cargandoPantallas

  return (
    <div className={`buscador-global ${compacto ? 'buscador-global--compacto' : ''} ${enModal ? 'buscador-global--modal' : ''}`}>
      <div className={`buscador-global__campo ${mostrarPanel ? 'buscador-global__campo--abierto' : ''}`}>
        <IconCR name="search" size={16} className="buscador-global__lupa" />
        <input
          ref={inputRef}
          type="search"
          className="buscador-global__input"
          placeholder="Buscar pantallas, clientes o colaboradores…"
          value={texto}
          onChange={(e) => { setTexto(e.target.value); setActivo(0); setAbierto(true) }}
          onFocus={() => setAbierto(true)}
          // El retraso deja que el click en un resultado llegue antes de cerrar
          onBlur={() => { if (!enModal) setTimeout(() => setAbierto(false), 150) }}
          onKeyDown={onTeclado}
          role="combobox"
          aria-expanded={mostrarPanel}
          aria-controls="buscador-global-resultados"
          aria-label="Buscar en el sistema"
          autoComplete="off"
        />
        <kbd className="buscador-global__atajo">Ctrl K</kbd>
      </div>

      {mostrarPanel && (
        <div id="buscador-global-resultados" className="buscador-global__panel" role="listbox">
          
          {buscaPersonas && (personasVisibles.length > 0 || cargandoLista) && <div className="buscador-global__grupo">Personas</div>}
          {cargandoLista
            ? Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="buscador-global__item" aria-hidden="true">
                <span className="skeleton-cr skeleton-cr--circulo" style={{ width: 32, height: 32 }} />
                <span className="buscador-global__texto">
                  <span className="skeleton-cr" style={{ width: '45%', height: 12 }} />
                  <span className="skeleton-cr mt-1" style={{ width: '30%', height: 10 }} />
                </span>
              </div>
            ))
            : personasVisibles.map((persona, j) => {
              const i = pantallasFiltradas.length + j
              const ruta = rutaPerfil(persona)
              const config = PERFIL_POR_TIPO[persona.id_tipo ?? 0]
              const nombre = `${persona.nombres} ${persona.apellido_paterno} ${persona.apellido_materno}`.trim()
              // Solo los tipos que abren perfil avisan cuando el usuario no tiene acceso
              const sinAccesoPerfil = !ruta && !!config?.perfil
              const registrando = registrandoId === persona.id
              return (
                // div (no button): adentro va el botón de asistencia
                <div key={persona.id} role="option" aria-selected={indiceActivo === i} aria-disabled={!ruta}
                  className={`buscador-global__item ${indiceActivo === i ? 'buscador-global__item--activo' : ''} ${!ruta ? 'buscador-global__item--sin-perfil' : ''}`}
                  onMouseDown={(e) => e.preventDefault()} onMouseEnter={() => setActivo(i)}
                  onClick={() => elegir({ tipo: 'persona', persona, ruta })}>
                  <AvatarCirculo src={getBlobUrl(persona.url_avatar_ultimo)} ajuste={ajusteAvatarUltimo(persona)} tamano={32} ampliable={false} />
                  <span className="buscador-global__texto">
                    <span className="buscador-global__titulo">{nombre}</span>
                    <span className="buscador-global__detalle">
                      {[config?.nombre, persona.numero_documento, persona.telefono].filter(Boolean).join(' · ')}
                      {sinAccesoPerfil && ' · Sin acceso a su perfil'}
                    </span>
                  {puedeRegistrarAsistencia && (
                    <button type="button" className="buscador-global__asistencia" disabled={registrando}
                      onClick={(e) => { e.stopPropagation(); registrarAsistencia(persona.id, nombre, persona.id_tipo === ID_TIPO_CLIENTE) }}
                      title={`Registrar asistencia de ${nombre}`}>
                      <IconCR name="check" size={10} className="" />
                      {registrando ? 'Registrando…' : 'Registrar asistencia'}
                    </button>
                  )}
                  </span>
                  {ruta && <IconCR name="arrowRight" size={16} className="buscador-global__ir" />}
                </div>
              )
            })}
          {pantallasFiltradas.length > 0 && <div className="buscador-global__grupo">Pantallas</div>}
          {pantallasFiltradas.map((pantalla, i) => (
            <button key={pantalla.ruta} type="button" role="option" aria-selected={indiceActivo === i}
              className={`buscador-global__item ${indiceActivo === i ? 'buscador-global__item--activo' : ''}`}
              onMouseDown={(e) => e.preventDefault()} onMouseEnter={() => setActivo(i)}
              onClick={() => elegir({ tipo: 'pantalla', pantalla })}>
              <span className="buscador-global__icono icono-modulo">
                <IconCR name={(pantalla.icono || 'no-icon') as IconName} size={16} className="" />
              </span>
              <span className="buscador-global__texto">
                <span className="buscador-global__titulo">{pantalla.label}</span>
                <span className="buscador-global__detalle">
                  {pantalla.modulo}{pantalla.enMantenimiento && ' · En mantenimiento'}
                </span>
              </span>
              <IconCR name="arrowRight" size={16} className="buscador-global__ir" />
            </button>
          ))}
          {sinResultados && <p className="buscador-global__vacio">Sin resultados para "{consulta}"</p>}
          {!buscaPersonas && pantallasFiltradas.length > 0 && (
            <p className="buscador-global__ayuda">Escribe al menos {MIN_LETRAS_PERSONAS} letras para buscar personas</p>
          )}
        </div>
      )}
    </div>
  )
}
