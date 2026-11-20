import { useMemo } from "react"
import { ModalSearching, type ItemResultado } from "@/components/ModalSearching/ModalSearching"
import { personaAItem } from "@/components/BuscadorPersona/personaAItem"
import { useBuscarPersona } from "@/components/BuscadorPersona/useBuscarPersona"
import { useRegistrarAsistencia } from "@/hook/useRegistrarAsistencia"
import { ID_TIPO_COLABORADOR } from "../store/asistenciasSlice"

type BuscadorRegistrarAsistenciaProps = {
  isOpen: boolean
  onHide: () => void
  /** Colaborador elegido: se abre el modal para elegir el tipo (Entrada, Salida...) */
  onSelectColaborador: (colaborador: ItemResultado) => void
  /** Cliente registrado: para recargar la tabla */
  onRegistrado: () => void
}

/**
 * Buscador de "Registrar asistencia" (clientes y colaboradores).
 * Cliente: se registra al elegirlo (revisa su membresía y muestra la alerta, ver useRegistrarAsistencia).
 * Colaborador: se pasa a onSelectColaborador para completar el tipo en el modal.
 */
export const BuscadorRegistrarAsistencia = ({ isOpen, onHide, onSelectColaborador, onRegistrado }: BuscadorRegistrarAsistenciaProps) => {
  const { personas, cargando, buscarPersona } = useBuscarPersona()
  const { registrarAsistencia, registrandoId } = useRegistrarAsistencia()
  // Sin idTipo: busca en todas y muestra "(Cliente)" / "(Colaborador)" junto al nombre
  const items = useMemo(() => personas.map((persona) => personaAItem(persona)), [personas])

  const onSelect = async (id: number) => {
    // Evita registrar dos veces si se elige de nuevo mientras se guarda
    if (registrandoId !== null) return
    const persona = personas.find((p) => p.id === id)
    if (!persona) return
    if (persona.id_tipo === ID_TIPO_COLABORADOR) {
      // Con el tipo ya conocido el nombre va sin "(Colaborador)"
      onSelectColaborador(personaAItem(persona, ID_TIPO_COLABORADOR))
      return
    }
    const nombre = `${persona.nombres} ${persona.apellido_paterno} ${persona.apellido_materno}`.trim()
    const registrado = await registrarAsistencia(persona.id, nombre, true)
    if (registrado) onRegistrado()
  }

  return (
    <ModalSearching
      isOpen={isOpen}
      id={0}
      onHide={onHide}
      items={items}
      onSearch={buscarPersona}
      cargando={cargando}
      onSelect={onSelect}
      autoFocus
    />
  )
}
