import { useRef, useState, type PointerEvent, type WheelEvent } from 'react'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { AJUSTE_CENTRADO, calcularEncuadre, type AjusteFoto, type TamanoImagen } from '@/components/Avatar/encuadreFoto'

/** Lado del visor en pantalla */
const VISOR = 260
const ZOOM_MAXIMO = 3

type Punto = { x: number, y: number }

type AjustarFotoProps = {
  src: string
  /** Encuadre guardado con el que empieza */
  ajusteInicial?: AjusteFoto | null
  onCancelar: () => void
  /** Encuadre elegido (la foto no se modifica) */
  onGuardar: (ajuste: AjusteFoto) => void
  guardando?: boolean
}

/**
 * Encuadre de una foto sin editarla: se arrastra para mover la foto bajo el círculo y el zoom la agranda.
 * Solo devuelve { x, y, zoom }; la foto se muestra con ese encuadre en FotoEncuadrada.
 * La foto siempre cubre todo el círculo (no quedan bordes vacíos).
 */
export const AjustarFoto = ({ src, ajusteInicial, onCancelar, onGuardar, guardando = false }: AjustarFotoProps) => {
  const inicial = ajusteInicial ?? AJUSTE_CENTRADO
  const arrastre = useRef<{ inicio: Punto, desplazamiento: Punto } | null>(null)
  const [natural, setNatural] = useState<TamanoImagen | null>(null)
  const [zoom, setZoom] = useState(inicial.zoom)
  // En px del visor (se guarda como fracción del visor)
  const [desplazamiento, setDesplazamiento] = useState<Punto>({ x: inicial.x * VISOR, y: inicial.y * VISOR })

  const tamanoCon = (valorZoom: number) => (natural ? calcularEncuadre(natural, VISOR, { x: 0, y: 0, zoom: valorZoom }) : { ancho: 0, alto: 0 })
  const { ancho, alto } = tamanoCon(zoom)

  /** Límite del movimiento para que la foto no deje bordes vacíos */
  const limitar = (punto: Punto, anchoFoto = ancho, altoFoto = alto): Punto => {
    const maxX = Math.max(0, (anchoFoto - VISOR) / 2)
    const maxY = Math.max(0, (altoFoto - VISOR) / 2)
    return { x: Math.min(maxX, Math.max(-maxX, punto.x)), y: Math.min(maxY, Math.max(-maxY, punto.y)) }
  }

  const cambiarZoom = (nuevo: number) => {
    const valor = Math.min(ZOOM_MAXIMO, Math.max(1, nuevo))
    const tamano = tamanoCon(valor)
    setZoom(valor)
    setDesplazamiento((actual) => limitar(actual, tamano.ancho, tamano.alto))
  }

  const alPresionar = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    arrastre.current = { inicio: { x: e.clientX, y: e.clientY }, desplazamiento }
  }
  const alMover = (e: PointerEvent<HTMLDivElement>) => {
    if (!arrastre.current) return
    const { inicio, desplazamiento: base } = arrastre.current
    setDesplazamiento(limitar({ x: base.x + e.clientX - inicio.x, y: base.y + e.clientY - inicio.y }))
  }
  const alSoltar = () => {
    arrastre.current = null
  }
  const alRueda = (e: WheelEvent<HTMLDivElement>) => cambiarZoom(zoom - e.deltaY * 0.001)

  return (
    <div>
      <div
        className="ajustar-foto__visor"
        style={{ width: VISOR, height: VISOR }}
        onPointerDown={alPresionar}
        onPointerMove={alMover}
        onPointerUp={alSoltar}
        onPointerCancel={alSoltar}
        onWheel={alRueda}
      >
        <img
          src={src}
          alt="Foto a ajustar"
          draggable={false}
          onLoad={(e) => {
            const tamano = { ancho: e.currentTarget.naturalWidth, alto: e.currentTarget.naturalHeight }
            setNatural(tamano)
            // El encuadre guardado se ajusta a los límites de esta foto
            const conZoom = calcularEncuadre(tamano, VISOR, { x: 0, y: 0, zoom })
            setDesplazamiento((actual) => limitar(actual, conZoom.ancho, conZoom.alto))
          }}
          style={{
            width: ancho || undefined,
            height: alto || undefined,
            transform: `translate(calc(-50% + ${desplazamiento.x}px), calc(-50% + ${desplazamiento.y}px))`,
            visibility: natural ? 'visible' : 'hidden',
          }}
        />
        <span className="ajustar-foto__mascara" />
      </div>

      <div className="d-flex align-items-center gap-2 mt-3 mx-auto" style={{ maxWidth: VISOR }}>
        <span className="small">Zoom</span>
        <input
          type="range"
          className="form-range"
          min={1}
          max={ZOOM_MAXIMO}
          step={0.01}
          value={zoom}
          onChange={(e) => cambiarZoom(Number(e.target.value))}
          aria-label="Zoom de la foto"
        />
      </div>
      <p className="small text-center opacity-75 mb-0">Arrastra la foto para ubicar el círculo</p>

      <div className="d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: '1px solid var(--cr-card-border)' }}>
        <ButtonCR label="Volver" variant="link" onClick={onCancelar} disabled={guardando} />
        <ButtonCR
          label={guardando ? 'Guardando...' : 'Guardar ajuste'}
          onClick={() => onGuardar({ x: desplazamiento.x / VISOR, y: desplazamiento.y / VISOR, zoom })}
          disabled={guardando || !natural}
        />
      </div>
    </div>
  )
}
