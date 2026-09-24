import { addDays, format, parseISO } from "date-fns"
import { sesionesDisponibles } from "@/pages/SeguimientoMembresia/DataTableSeguimiento"
import type { SeguimientoMembresiaProps } from "@/pages/SeguimientoMembresia/store/seguimientoMembresiaSlice"

type MembresiaActivaClienteProps = {
  /** Membresía activa del cliente seleccionado; sin cliente la columna queda desactivada */
  membresia?: SeguimientoMembresiaProps
  /** Días a regalar: se muestra cómo quedaría el vencimiento (solo al crear) */
  diasRegalo?: number
}

const formatFecha = (fecha: string) => format(parseISO(fecha), 'dd/MM/yyyy')

/** Dato de la membresía: etiqueta arriba, valor abajo */
const Dato = ({ label, valor }: { label: string, valor: React.ReactNode }) => (
  <div className="mb-2">
    <div className="small opacity-75">{label}</div>
    <div className="fw-bold">{valor}</div>
  </div>
)

/** Columna del modal con la membresía activa (seguimiento) del cliente seleccionado */
export const MembresiaActivaCliente = ({ membresia, diasRegalo = 0 }: MembresiaActivaClienteProps) => {
  if (!membresia) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center text-center p-3 rounded border opacity-50" style={{ borderStyle: 'dashed', minHeight: 160 }}>
        Selecciona un cliente para ver su membresía activa
      </div>
    )
  }

  // Igual que el backend: el regalo empieza en el vencimiento actual y suma días corridos
  const nuevoVencimiento = diasRegalo > 0
    ? format(addDays(parseISO(membresia.fecha_vencimiento), diasRegalo), 'dd/MM/yyyy')
    : null

  return (
    <div className="card-mode-actual h-100 p-3 rounded">
      <div className="fw-bold mb-3">Membresía activa</div>
      <Dato label="Cliente" valor={membresia.label_nombres_apellidos_cli} />
      <Dato label="Comprobante" valor={membresia.label_venta || '-'} />
      <Dato label="Vence" valor={formatFecha(membresia.fecha_vencimiento)} />
      <Dato label="Sesiones disponibles" valor={sesionesDisponibles(membresia.fecha_vencimiento)} />
      {membresia.label_extension_actual && <Dato label="Extensión actual" valor={membresia.label_extension_actual} />}
      {nuevoVencimiento && (
        <div className="mt-3 p-2 rounded bg-success bg-opacity-10 border border-success">
          <div className="small">Con el regalo de {diasRegalo} {diasRegalo === 1 ? 'día' : 'días'} vencerá el</div>
          <div className="fw-bold text-success">{nuevoVencimiento}</div>
        </div>
      )}
    </div>
  )
}
