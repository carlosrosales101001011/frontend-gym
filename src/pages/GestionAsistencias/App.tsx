import { useEffect, useRef, useState } from "react"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ButtonCR } from "@/components/Button/ButtonCR"
import IconCR from "@/components/Icons/IconCR"
import type { isOpenModalCustom } from "@/types/props"
import { useQueryParams } from "@/hook/useQueryParams"
import { querys } from "@/types/parametros"
import { useAsistenciasStore } from "./hook/useAsistenciasStore"
import { DataTableAsistencias } from "./components/DataTableAsistencias"
import { ModalCustomAsistencia } from "./components/ModalCustomAsistencia"
import { FiltroFechasAsistencias } from "./components/FiltroFechasAsistencias"
import { ResumenAsistencias } from "./components/ResumenAsistencias"

/** Gestión de asistencias (persona_eventos_asistencia): marcaciones de clientes y colaboradores */
export const App = () => {
  const { searcher } = useAsistenciasStore()
  const [isOpenModalCustom, setisOpenModalCustom] = useState<isOpenModalCustom>({ id: 0, isCopy: false, isOpen: false })
  const onCloseModalCustom = () => setisOpenModalCustom({ id: 0, isCopy: false, isOpen: false })
  const onOpenModalCustom = (id: number) => setisOpenModalCustom({ id, isCopy: false, isOpen: true })

  const { get } = useQueryParams()
  const querySearch = (get(querys.search) || '')
  const queryColumnas = get(querys.columnas)
  const page = Number(get(querys.page))
  const show = Number(get(querys.show))
  const fechaInicio = get(querys.fechaInicio)
  const fechaFin = get(querys.fechaFin)
  // Al entrar sin fechas el filtro pone la de hoy en la URL: se espera a eso para no pedir todo y luego hoy
  const esperandoFechaInicial = useRef(!fechaInicio && !fechaFin)
  useEffect(() => {
    if (esperandoFechaInicial.current) {
      if (!fechaInicio && !fechaFin) return
      esperandoFechaInicial.current = false
    }
    const ctrl = new AbortController()
    searcher(ctrl.signal).catch(e => {
      if (e.name !== 'CanceledError') console.error(e)
    })
    return () => ctrl.abort()
  }, [querySearch, queryColumnas, page, show, fechaInicio, fechaFin])

  return (
    <div>
      <PageBreadCumb title={'Asistencias'}/>
      {/* Se monta solo al abrir para que el form arranque limpio o con los datos a editar */}
      {isOpenModalCustom.isOpen && (
        <ModalCustomAsistencia id={isOpenModalCustom.id} onHide={onCloseModalCustom} show={isOpenModalCustom.isOpen} />
      )}
      {/* Arriba del botón "Registrar asistencia": filtro por fecha de registro */}
      <FiltroFechasAsistencias />
      {/* Debajo del rango de fechas y arriba de la tabla */}
      <ResumenAsistencias />
      <DataTableAsistencias
        otrosBotones={<ButtonCR label={'Registrar asistencia'} onClick={() => onOpenModalCustom(0)} icon={<IconCR name='plus' size={14}/>}/>}
        // onOpenModalCustom={onOpenModalCustom}
      />
    </div>
  )
}
