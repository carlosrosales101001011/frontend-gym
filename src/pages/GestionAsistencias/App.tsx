import { useEffect, useState } from "react"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ButtonCR } from "@/components/Button/ButtonCR"
import IconCR from "@/components/Icons/IconCR"
import type { ItemResultado } from "@/components/ModalSearching/ModalSearching"
import { useQueryParams } from "@/hook/useQueryParams"
import { querys } from "@/types/parametros"
import { useAsistenciasStore } from "./hook/useAsistenciasStore"
import { DataTableAsistencias } from "./components/DataTableAsistencias"
import { ModalCustomAsistencia } from "./components/ModalCustomAsistencia"
import { BuscadorRegistrarAsistencia } from "./components/BuscadorRegistrarAsistencia"
import { FiltroFechasAsistencias } from "./components/FiltroFechasAsistencias"
import { ResumenAsistencias } from "./components/ResumenAsistencias"

type ModalAsistencia = { isOpen: boolean, id: number, colaborador: ItemResultado | null }
const MODAL_CERRADO: ModalAsistencia = { isOpen: false, id: 0, colaborador: null }

/** Gestión de asistencias (persona_eventos_asistencia): marcaciones de clientes y colaboradores */
export const App = () => {
  const { searcher } = useAsistenciasStore()
  // "Registrar asistencia" abre primero el buscador; solo los colaboradores pasan al modal
  const [buscadorAbierto, setBuscadorAbierto] = useState(false)
  const [modal, setModal] = useState<ModalAsistencia>(MODAL_CERRADO)
  const onCloseModal = () => setModal(MODAL_CERRADO)

  const { get } = useQueryParams()
  const querySearch = (get(querys.search) || '')
  const queryColumnas = get(querys.columnas)
  const page = Number(get(querys.page))
  const show = Number(get(querys.show))
  const fechaInicio = get(querys.fechaInicio)
  const fechaFin = get(querys.fechaFin)
  useEffect(() => {
    // Sin fechas el filtro pone la de hoy en la URL: se espera a eso para no pedir todo y luego hoy
    if (!fechaInicio && !fechaFin) return
    const ctrl = new AbortController()
    searcher(ctrl.signal).catch(e => {
      if (e.name !== 'CanceledError') console.error(e)
    })
    return () => ctrl.abort()
  }, [querySearch, queryColumnas, page, show, fechaInicio, fechaFin])

  return (
    <div>
      <PageBreadCumb title={'Asistencias'}/>
      <BuscadorRegistrarAsistencia
        isOpen={buscadorAbierto}
        onHide={() => setBuscadorAbierto(false)}
        onSelectColaborador={(colaborador) => setModal({ isOpen: true, id: 0, colaborador })}
        // Cliente registrado: recarga la tabla (y con ella el resumen)
        onRegistrado={() => searcher().catch(console.error)}
      />
      {/* Se monta solo al abrir para que el form arranque limpio o con los datos a editar */}
      {modal.isOpen && (
        <ModalCustomAsistencia id={modal.id} colaborador={modal.colaborador} onHide={onCloseModal} show={modal.isOpen} />
      )}
      {/* Arriba del botón "Registrar asistencia": filtro por fecha de registro */}
      <FiltroFechasAsistencias />
      {/* Debajo del rango de fechas y arriba de la tabla */}
      <ResumenAsistencias />
      <DataTableAsistencias
        otrosBotones={<ButtonCR label={'Registrar asistencia'} onClick={() => setBuscadorAbierto(true)} icon={<IconCR name='plus' size={14}/>}/>}
      />
    </div>
  )
}
