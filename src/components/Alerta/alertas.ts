import { codigoUltimoError } from '@/common/helpers/httpClient'

export type VarianteAlerta = 'warning' | 'success' | 'error'

export type PositionAlerta =
  | 'top-left' | 'top' | 'top-right'
  | 'left' | 'center' | 'right'
  | 'bottom-left' | 'bottom' | 'bottom-right'

export const POSITION_DEFAULT: PositionAlerta = 'center'

export type AlertaProps = {
  variante: VarianteAlerta
  /** Texto a la derecha del ícono */
  concepto: string
  /** Segundos que se ve la alerta */
  tiempoEnPantalla?: number
  /** Lugar de la pantalla (por defecto 'center') */
  position?: PositionAlerta
}

type AlertaEnPantalla = AlertaProps & { id: number }

let alertas: AlertaEnPantalla[] = []
let siguienteId = 1
const suscriptores = new Set<() => void>()

const actualizar = (nuevas: AlertaEnPantalla[]) => {
  alertas = nuevas
  suscriptores.forEach((avisar) => avisar())
}

/** Para ContenedorAlertasCR */
export const suscribirAlertas = (avisar: () => void) => {
  suscriptores.add(avisar)
  return () => { suscriptores.delete(avisar) }
}
export const obtenerAlertas = () => alertas
export const quitarAlerta = (id: number) => actualizar(alertas.filter((alerta) => alerta.id !== id))

/** Muestra una alerta desde cualquier parte (hooks incluidos); sigue visible aunque cambie la página */
export const mostrarAlerta = (alerta: AlertaProps) => actualizar([...alertas, { ...alerta, id: siguienteId++ }])

/** Alerta de error de la última petición: "Error al hacer la última acción [404]" */
export const alertaError = (opciones?: Pick<AlertaProps, 'tiempoEnPantalla' | 'position'>) => {
  const codigo = codigoUltimoError()
  mostrarAlerta({
    variante: 'error',
    concepto: `Error al hacer la última acción${codigo ? ` [${codigo}]` : ''}`,
    ...opciones,
  })
}
