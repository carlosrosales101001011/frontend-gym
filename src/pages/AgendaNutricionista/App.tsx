import { useEffect, useState } from "react"
import { addDays, addMonths, addWeeks } from "date-fns"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { useAgendaNutricionistaStore } from "./hook/useAgendaNutricionistaStore"
import { initialStateAgendaNutricionista, type EventoAgendaProps } from "./store/agendaNutricionistaSlice"
import { aFechaISO, esEventoBloqueado, sumarMinutos, type VistaCalendario } from "./helpers/agendaHelpers"
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
  dia: addDays,
}

export const App = () => {
  const { eventos, minutosxcli, obtenerEventos } = useAgendaNutricionistaStore()
  const [vista, setVista] = useState<VistaCalendario>('mes')
  const [fecha, setFecha] = useState(new Date())
  const [modalEvento, setModalEvento] = useState<{ show: boolean, evento: EventoAgendaProps }>({
    show: false,
    evento: initialStateAgendaNutricionista.evento,
  })

  useEffect(() => {
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
      },
    })
  }
  const onAbrirEvento = (evento: EventoAgendaProps) => {
    // Los eventos importantes (bloqueados) no se pueden editar desde la agenda
    if (esEventoBloqueado(evento)) return
    setModalEvento({ show: true, evento })
  }
  const onCerrarModal = () => {
    setModalEvento((prev) => ({ ...prev, show: false }))
  }
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
          onHoy={() => setFecha(new Date())}
          centro={<LeyendaEstados />}
        />
        <div className="flex-grow-1 scroll-mode-actual overflow-x-hidden" style={{ minHeight: 0 }}>
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
