import { useEffect, useRef, useState } from "react"
import { addDays, addMonths, addWeeks, parseISO } from "date-fns"
import { Spinner } from "react-bootstrap"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ContadorCoincidencias } from "@/components/SinResultados/ContadorCoincidencias"
import { InputCR } from "@/components/TextFields/InputCR"
import { ButtonCR } from "@/components/Button/ButtonCR"
import IconCR from "@/components/Icons/IconCR"
import { normalizeText } from "@/helpers/strings"
import { useAgendaNutricionistaStore } from "./hook/useAgendaNutricionistaStore"
import { useAgendaTiempoReal } from "./hook/useAgendaTiempoReal"
import { initialStateAgendaNutricionista, type EventoAgendaProps } from "./store/agendaNutricionistaSlice"
import { aFechaISO, aMinutos, ALTO_SLOT, esEventoBloqueado, HORA_FIN_AGENDA, HORA_INICIO_AGENDA, idEstadoInicial, rangoDeVista, saltarDomingo, sumarMinutos, type VistaCalendario } from "./helpers/agendaHelpers"
import { CalendarioToolbar } from "./components/CalendarioToolbar"
import { LeyendaEstados } from "./components/LeyendaEstados"
import { VistaMes } from "./components/VistaMes"
import { VistaSemana } from "./components/VistaSemana"
import { VistaDia } from "./components/VistaDia"
import { ModalCustomEvento } from "./modal/ModalCustomEvento"

/** Cuánto avanza/retrocede cada vista con las flechas */
const MOVER_FECHA: Record<VistaCalendario, (fecha: Date, cantidad: number) => Date> = {
  mes: addMonths,
  semana: addWeeks,
  // Sin domingos: de sábado se pasa a lunes y de lunes a sábado
  dia: (fecha, cantidad) => saltarDomingo(addDays(fecha, cantidad), cantidad > 0 ? 1 : -1),
}

/** Cuánto después de dejar de escribir se aplica la búsqueda de clientes */
const MS_APLICAR_BUSQUEDA = 400

export const App = () => {
  const { eventos, eventosBuscados, cargandoEventos, minutosxcli, estados, obtenerEventos, buscarCitasCliente, obtenerEstados } = useAgendaNutricionistaStore()
  const [vista, setVista] = useState<VistaCalendario>('semana')
  const [fecha, setFecha] = useState(new Date())
  // Solo se piden las citas de lo que se ve (mes, semana o día); se vuelve a pedir al cambiar de vista o de fecha
  const rango = rangoDeVista(vista, fecha)
  useEffect(() => {
    const ctrl = new AbortController()
    obtenerEventos(rango, ctrl.signal)
    return () => ctrl.abort()
  }, [rango.fecha_inicio, rango.fecha_fin])
  // Vista semana: "Ir a la hora" solo desplaza la grilla hasta esa hora (no filtra nada)
  const contenedorScroll = useRef<HTMLDivElement>(null)
  const [horaBuscada, setHoraBuscada] = useState('')
  /** Desplaza la grilla de la vista semana hasta esa hora (HH:mm) */
  const desplazarAHora = (hora: string) => {
    const minutos = Math.min(Math.max(aMinutos(hora), HORA_INICIO_AGENDA * 60), HORA_FIN_AGENDA * 60)
    // La cabecera de días es sticky: con este top el slot de esa hora queda justo debajo de ella
    contenedorScroll.current?.scrollTo({ top: (minutos - HORA_INICIO_AGENDA * 60) * (ALTO_SLOT / minutosxcli), behavior: 'smooth' })
  }
  const irAHora = (valor: string) => {
    setHoraBuscada(valor)
    if (/^\d{2}:\d{2}$/.test(valor)) desplazarAHora(valor)
  }

  // Buscador de clientes: solo se ven sus citas y el calendario va a la más reciente
  const [busquedaCliente, setBusquedaCliente] = useState('')
  // Lo que filtra: se aplica a los ms de dejar de escribir; mientras tanto se muestra el loading
  const [textoBuscado, setTextoBuscado] = useState('')
  const [buscandoCliente, setBuscandoCliente] = useState(false)
  const temporizadorBusqueda = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(temporizadorBusqueda.current), [])
  /** Citas del cliente buscado (de cualquier fecha, las trae el backend), la de fecha más reciente primero */
  const ordenarMasRecientePrimero = (citas: EventoAgendaProps[]) =>
    [...citas].sort((a, b) => `${b.fecha} ${b.hora_inicio}`.localeCompare(`${a.fecha} ${a.hora_inicio}`))
  // Buscando: solo las citas del cliente; sin texto: las del rango que se ve
  const eventosVisibles = textoBuscado ? ordenarMasRecientePrimero(eventosBuscados) : eventos
  // Coincidencia en la que está el calendario (las flechas la mueven); se ajusta si el socket quitó citas
  const [indiceCoincidencia, setIndiceCoincidencia] = useState(0)
  const indiceActual = Math.min(indiceCoincidencia, Math.max(eventosVisibles.length - 1, 0))
  // Cita en la que está el buscador: se pinta con borde brillante
  const idResaltado = textoBuscado ? eventosVisibles[indiceActual]?.id : undefined
  /** Lleva el calendario a la fecha (y en la vista semana, a la hora) de la cita */
  const irACita = (cita: EventoAgendaProps) => {
    setFecha(saltarDomingo(parseISO(cita.fecha)))
    // Después de pintar la semana de esa fecha
    if (vista === 'semana') requestAnimationFrame(() => desplazarAHora(cita.hora_inicio))
  }
  /** Flechas: -1 = coincidencia anterior (más reciente), 1 = siguiente; al llegar al final vuelve al inicio */
  const moverCoincidencia = (paso: 1 | -1) => {
    const total = eventosVisibles.length
    if (!total) return
    const nuevo = (indiceActual + paso + total) % total
    setIndiceCoincidencia(nuevo)
    irACita(eventosVisibles[nuevo])
  }
  const onBuscarCliente = (valor: string) => {
    setBusquedaCliente(valor)
    setBuscandoCliente(true)
    clearTimeout(temporizadorBusqueda.current)
    temporizadorBusqueda.current = setTimeout(async () => {
      const texto = normalizeText(valor)
      // Las citas del cliente se piden al backend (todas sus fechas); sin texto se vuelve a las del rango
      const citas = texto ? await buscarCitasCliente(valor.trim()) : []
      setTextoBuscado(texto)
      setBuscandoCliente(false)
      setIndiceCoincidencia(0)
      // Solo al buscar (no cuando el socket recarga las citas): el calendario va a la cita de fecha más reciente
      const masReciente = ordenarMasRecientePrimero(citas)[0]
      if (masReciente) irACita(masReciente)
    }, MS_APLICAR_BUSQUEDA)
  }
  const [modalEvento, setModalEvento] = useState<{ show: boolean, evento: EventoAgendaProps }>({
    show: false,
    evento: initialStateAgendaNutricionista.evento,
  })

  useEffect(() => {
    obtenerEstados()
  }, [])

  /** Las citas solo se agendan desde un slot de la vista semana: el slot define fecha y horario */
  const onAgendarSlot = (dia: Date, hora: string) => {
    setModalEvento({
      show: true,
      evento: {
        ...initialStateAgendaNutricionista.evento,
        fecha: aFechaISO(dia),
        hora_inicio: hora,
        hora_fin: sumarMinutos(hora, minutosxcli),
        id_estado: idEstadoInicial(estados),
      },
    })
  }
  const onAbrirEvento = (evento: EventoAgendaProps) => {
    // Los eventos importantes (bloqueados) no se pueden editar desde la agenda
    if (esEventoBloqueado(estados, evento)) return
    setModalEvento({ show: true, evento })
  }
  const onCerrarModal = () => {
    setModalEvento((prev) => ({ ...prev, show: false }))
  }

  // Si la cita abierta en el modal fue editada o eliminada (por cualquier usuario), el modal se cierra sin avisar
  // Al cambiar cualquier cita se recarga lo que se ve: el rango y, si se está buscando, las citas del cliente
  // Sin skeleton: es una recarga en segundo plano y no debe parpadear
  const recargarAgenda = () => {
    obtenerEventos(rango, undefined, false)
    if (textoBuscado) buscarCitasCliente(busquedaCliente.trim(), false)
  }
  useAgendaTiempoReal(recargarAgenda, (cambio) => {
    if (cambio.accion === 'crear') return
    if (!modalEvento.show || modalEvento.evento.id !== cambio.id) return
    onCerrarModal()
  })
  const onVerDia = (dia: Date) => {
    setFecha(dia)
    setVista('dia')
  }
  const onVerSemana = (dia: Date) => {
    setFecha(dia)
    setVista('semana')
  }

  return (
    // view-h-100: la agenda ocupa el alto de la pantalla y solo el calendario hace scroll en Y
    <div className="view-h-100 p-2">
      <PageBreadCumb title={'Agenda de nutrición'}/>
      {/* Se monta solo al abrir para que el form arranque con los datos del evento */}
      {modalEvento.show && (
        <ModalCustomEvento show={modalEvento.show} onHide={onCerrarModal} evento={modalEvento.evento} />
      )}
      <div className="card-mode-actual p-3 rounded h-100 d-flex flex-column" style={{ minHeight: 0 }}>
        <CalendarioToolbar
          vista={vista}
          fecha={fecha}
          onCambiarVista={setVista}
          onAnterior={() => setFecha(MOVER_FECHA[vista](fecha, -1))}
          onSiguiente={() => setFecha(MOVER_FECHA[vista](fecha, 1))}
          onHoy={() => setFecha(saltarDomingo(new Date()))}
          centro={<LeyendaEstados />}
          junto_titulo={vista === 'semana' && (
            <input
              type="time"
              className="textfield-input input-mode-actual ms-2"
              style={{ width: 120, height: 34 }}
              value={horaBuscada}
              min={`${String(HORA_INICIO_AGENDA).padStart(2, '0')}:00`}
              max={`${String(HORA_FIN_AGENDA).padStart(2, '0')}:00`}
              onChange={(e) => irAHora(e.target.value)}
              title="Ir a una hora del calendario (solo desplaza)"
              aria-label="Ir a la hora"
            />
          )}
          buscador={(
            <div className="d-flex align-items-center gap-2 ms-2">
              <div style={{ width: 220 }}>
                <InputCR
                  label="Buscar cliente"
                  value={busquedaCliente}
                  onChange={(e) => onBuscarCliente(e.target.value)}
                  aria-label="Buscar citas de un cliente"
                />
              </div>
              {buscandoCliente && <Spinner animation="border" size="sm" role="status" aria-label="Buscando" />}
              {!buscandoCliente && textoBuscado && eventosVisibles.length === 0 && <ContadorCoincidencias total={0} />}
              {!buscandoCliente && textoBuscado && eventosVisibles.length > 0 && (
                <div className="d-flex align-items-center gap-1">
                  <ButtonCR variant="outline-secondary" className="btn-sm" onClick={() => moverCoincidencia(-1)} icon={<IconCR name="arrowUp" size={14} />} title="Coincidencia anterior (más reciente)" />
                  <ButtonCR variant="outline-secondary" className="btn-sm" onClick={() => moverCoincidencia(1)} icon={<IconCR name="arrowDown" size={14} />} title="Coincidencia siguiente" />
                  <span className="small text-nowrap" role="status" aria-live="polite">
                    <strong>{indiceActual + 1}</strong>/{eventosVisibles.length}
                  </span>
                </div>
              )}
            </div>
          )}
        />
        <div ref={contenedorScroll} className="flex-grow-1 scroll-mode-actual overflow-x-hidden" style={{ minHeight: 0 }}>
        {vista === 'mes' && (
          <VistaMes
            fecha={fecha}
            eventos={eventosVisibles}
            cargando={cargandoEventos}
            onSeleccionarDia={onVerSemana}
            onSeleccionarEvento={onAbrirEvento}
            onVerDia={onVerDia}
            idResaltado={idResaltado}
          />
        )}
        {vista === 'semana' && (
          <VistaSemana
            fecha={fecha}
            eventos={eventosVisibles}
            cargando={cargandoEventos}
            minutosxcli={minutosxcli}
            onSeleccionarSlot={onAgendarSlot}
            onSeleccionarEvento={onAbrirEvento}
            onVerDia={onVerDia}
            idResaltado={idResaltado}
          />
        )}
        {vista === 'dia' && (
          <VistaDia fecha={fecha} eventos={eventosVisibles} cargando={cargandoEventos} onSeleccionarEvento={onAbrirEvento} idResaltado={idResaltado} />
        )}
        </div>
      </div>
    </div>
  )
}
