import { useEffect, useRef, useState } from "react"
import { addDays, addMonths, addWeeks } from "date-fns"
import Swal from "sweetalert2"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { useAgendaNutricionistaStore } from "./hook/useAgendaNutricionistaStore"
import { useAgendaTiempoReal } from "./hook/useAgendaTiempoReal"
import { initialStateAgendaNutricionista, type EventoAgendaProps } from "./store/agendaNutricionistaSlice"
import { aFechaISO, aHora, aMinutos, ALTO_SLOT, esEventoBloqueado, HORA_FIN_AGENDA, HORA_INICIO_AGENDA, idEstadoInicial, saltarDomingo, sumarMinutos, type VistaCalendario } from "./helpers/agendaHelpers"
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

export const App = () => {
  const { eventos, minutosxcli, estados, obtenerEventos, obtenerEstados } = useAgendaNutricionistaStore()
  const [vista, setVista] = useState<VistaCalendario>('semana')
  const [fecha, setFecha] = useState(new Date())
  // Vista semana: "Ir a la hora" solo desplaza la grilla hasta esa hora (no filtra nada)
  const contenedorScroll = useRef<HTMLDivElement>(null)
  const [horaBuscada, setHoraBuscada] = useState('')
  const irAHora = (valor: string) => {
    setHoraBuscada(valor)
    if (!/^\d{2}:\d{2}$/.test(valor)) return
    const minutos = Math.min(Math.max(aMinutos(valor), HORA_INICIO_AGENDA * 60), HORA_FIN_AGENDA * 60)
    // La cabecera de días es sticky: con este top el slot de esa hora queda justo debajo de ella
    contenedorScroll.current?.scrollTo({ top: (minutos - HORA_INICIO_AGENDA * 60) * (ALTO_SLOT / minutosxcli), behavior: 'smooth' })
  }
  // Rango de horas que se ve en la grilla (se actualiza al hacer scroll o cambiar el tamaño)
  const [rangoVisible, setRangoVisible] = useState<{ desde: string, hasta: string } | null>(null)
  const actualizarRangoVisible = () => {
    const contenedor = contenedorScroll.current
    if (!contenedor || vista !== 'semana') return
    const pxPorMinuto = ALTO_SLOT / minutosxcli
    // La cabecera de días es sticky y tapa la parte de arriba
    const altoCabecera = contenedor.querySelector<HTMLElement>('.agenda__semana-cabecera')?.offsetHeight ?? 0
    const inicio = HORA_INICIO_AGENDA * 60
    const desde = Math.min(inicio + contenedor.scrollTop / pxPorMinuto, HORA_FIN_AGENDA * 60)
    const hasta = Math.min(desde + (contenedor.clientHeight - altoCabecera) / pxPorMinuto, HORA_FIN_AGENDA * 60)
    setRangoVisible({ desde: aHora(Math.round(desde)), hasta: aHora(Math.round(hasta)) })
  }
  useEffect(() => {
    if (vista !== 'semana') return
    const contenedor = contenedorScroll.current
    // Después de pintar la grilla
    const primera = requestAnimationFrame(actualizarRangoVisible)
    const observador = new ResizeObserver(() => actualizarRangoVisible())
    if (contenedor) observador.observe(contenedor)
    return () => {
      cancelAnimationFrame(primera)
      observador.disconnect()
    }
  }, [vista, minutosxcli])
  const [modalEvento, setModalEvento] = useState<{ show: boolean, evento: EventoAgendaProps }>({
    show: false,
    evento: initialStateAgendaNutricionista.evento,
  })

  useEffect(() => {
    obtenerEstados()
    obtenerEventos()
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

  // Si la cita abierta en el modal fue editada o eliminada (por cualquier usuario), se cierra y se avisa
  useAgendaTiempoReal((cambio) => {
    if (cambio.accion === 'crear') return
    if (!modalEvento.show || modalEvento.evento.id !== cambio.id) return
    onCerrarModal()
    Swal.fire({
      icon: 'info',
      title: cambio.accion === 'eliminar' ? 'La cita fue eliminada' : 'La cita fue modificada',
      text: cambio.accion === 'eliminar'
        ? 'Otro usuario eliminó esta cita.'
        : 'Otro usuario modificó esta cita. Vuelve a abrirla para ver los cambios.',
    })
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
          rango_visible={vista === 'semana' && rangoVisible && (
            <span className="small text-nowrap opacity-75 ms-2" title="Horas que se ven en el calendario">
              Viendo <strong>{rangoVisible.desde}</strong> – <strong>{rangoVisible.hasta}</strong>
            </span>
          )}
        />
        <div ref={contenedorScroll} onScroll={actualizarRangoVisible} className="flex-grow-1 scroll-mode-actual overflow-x-hidden" style={{ minHeight: 0 }}>
        {vista === 'mes' && (
          <VistaMes
            fecha={fecha}
            eventos={eventos}
            onSeleccionarDia={onVerSemana}
            onSeleccionarEvento={onAbrirEvento}
            onVerDia={onVerDia}
          />
        )}
        {vista === 'semana' && (
          <VistaSemana
            fecha={fecha}
            eventos={eventos}
            minutosxcli={minutosxcli}
            onSeleccionarSlot={onAgendarSlot}
            onSeleccionarEvento={onAbrirEvento}
            onVerDia={onVerDia}
          />
        )}
        {vista === 'dia' && (
          <VistaDia fecha={fecha} eventos={eventos} onSeleccionarEvento={onAbrirEvento} />
        )}
        </div>
      </div>
    </div>
  )
}
