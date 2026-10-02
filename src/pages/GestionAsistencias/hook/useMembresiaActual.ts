import { useEffect, useState } from "react"
import httpClient from "@/common/helpers/httpClient"

/** GET /membresia-seguimiento/id_cli/:id_cli/resumen-actual */
export type MembresiaActualProps = {
  id_venta: number
  label_venta?: string | null
  label_programa: string | null
  label_plan: string | null
  label_horario: string | null
  fecha_vencimiento: string
  montoTotal: number
  montoPagado: number
  /** La venta de la membresía ya está pagada por completo */
  pagado: boolean
}

/** Respuesta guardada junto al cliente consultado, para no mostrar la membresía de otro mientras carga */
type Resultado = { idCliente: number, membresia: MembresiaActualProps | null }

/**
 * Membresía actual de un cliente (programa, plan y si está pagada) para mostrarla al registrar su asistencia.
 * Con idCliente 0 / undefined no consulta. membresia null = el cliente no tiene membresías.
 */
export const useMembresiaActual = (idCliente?: number) => {
  const [resultado, setResultado] = useState<Resultado | null>(null)

  useEffect(() => {
    if (!idCliente) return
    const ctrl = new AbortController()
    httpClient.get(`/membresia-seguimiento/id_cli/${idCliente}/resumen-actual`, { signal: ctrl.signal })
      .then(({ data }) => setResultado({ idCliente, membresia: data || null }))
      .catch((error) => {
        if (ctrl.signal.aborted) return
        console.log(error)
        setResultado({ idCliente, membresia: null })
      })
    return () => ctrl.abort()
  }, [idCliente])

  const listo = !!idCliente && resultado?.idCliente === idCliente
  return {
    membresia: listo ? resultado.membresia : null,
    cargando: !!idCliente && !listo,
  }
}
