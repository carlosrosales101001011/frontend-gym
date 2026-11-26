import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import type { RootState } from '@/stores/Store'
import { calcularImc, calcularPgc, clasificarEnEscala, ESCALA_IMC, ESCALA_PGC, type EscalaMedida } from './medidasAntropometricas'
import { usePerfilNutricional } from '../../hook/usePerfilNutricional'

const ALTO_BARRA = 14

type BarraRangosProps = {
  /** Ej. "IMC (índice de masa corporal)" */
  titulo: string
  /** Valor calculado ('' si falta un dato) */
  valor: string
  unidad?: string
  escala: EscalaMedida
  /** Texto cuando no se puede calcular */
  sinValor: string
}

/** Barra de lo más bajo a lo más alto, dividida en sus rangos, con una marca donde cae el valor */
const BarraRangos = ({ titulo, valor, unidad = '', escala, sinValor }: BarraRangosProps) => {
  const { desde, rangos } = escala
  const hasta = rangos[rangos.length - 1].hasta
  const rango = clasificarEnEscala(valor, escala)
  /** Posición en % de la barra (si se sale, queda en el borde) */
  const posicion = (n: number) => Math.min(100, Math.max(0, ((n - desde) / (hasta - desde)) * 100))

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-baseline mb-3">
        <span className="fw-bold">{titulo}</span>
        {rango
          ? <span className={`fw-bold text-${rango.color}`}>{valor}{unidad} {rango.texto}</span>
          : <span className="small opacity-50">{sinValor}</span>}
      </div>
      <div className="position-relative">
        {rango && (
          // Marca: triángulo encima de la barra
          <div
            className="position-absolute"
            style={{
              left: `${posicion(Number(valor))}%`,
              bottom: '100%',
              transform: 'translateX(-50%)',
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderTop: '9px solid currentColor',
            }}
          />
        )}
        <div className="d-flex rounded overflow-hidden" style={{ height: ALTO_BARRA }}>
          {rangos.map((r, i) => {
            const inicio = i === 0 ? desde : rangos[i - 1].hasta
            return (
              <div
                key={r.texto}
                className={`bg-${r.color} ${r === rango ? '' : 'opacity-25'}`}
                style={{ width: `${posicion(r.hasta) - posicion(inicio)}%` }}
                title={`${r.texto}: ${inicio} a ${r.hasta}${unidad}`}
              />
            )
          })}
        </div>
        {/* Nombre de cada tramo debajo y los límites entre tramos */}
        <div className="d-flex small mt-1">
          {rangos.map((r, i) => {
            const inicio = i === 0 ? desde : rangos[i - 1].hasta
            return (
              <div key={r.texto} className="text-center lh-sm" style={{ width: `${posicion(r.hasta) - posicion(inicio)}%` }}>
                {r.texto}
              </div>
            )
          })}
        </div>
        <div className="position-relative small opacity-50" style={{ height: 18 }}>
          {rangos.slice(0, -1).map((r) => (
            <span key={r.hasta} className="position-absolute" style={{ left: `${posicion(r.hasta)}%`, transform: 'translateX(-50%)' }}>{r.hasta}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Análisis de obesidad de la fecha elegida: IMC y PGC con su barra (se calculan solos, no se editan) */
export const CardAnalisisObesidad = () => {
  const { valor } = usePerfilNutricional()
  const { colaborador: paciente } = useSelector((state: RootState) => state.PERFIL_COLABORADOR)
  const { data: generos, cargar: cargarGeneros } = useTerminologiaPersona('GeneroPersona')

  useEffect(() => {
    cargarGeneros()
  }, [cargarGeneros])

  // El rango normal del PGC depende del sexo (Masculino / Femenino en terminología)
  const sexo = generos.find((g) => g.value === Number(paciente.id_genero))?.label.toLowerCase()
  const escalaPgc = sexo?.startsWith('fem') ? ESCALA_PGC.femenino : sexo?.startsWith('mas') ? ESCALA_PGC.masculino : null
  const pgc = calcularPgc(valor('masa_grasa_corporal'), valor('peso'))

  return (
    <CardSeccionCR titulo="Análisis de obesidad" className="mb-3">
      <BarraRangos
        titulo="IMC (índice de masa corporal)"
        valor={calcularImc(valor('peso'), valor('talla'))}
        escala={ESCALA_IMC}
        sinValor="Falta peso o talla"
      />
      {escalaPgc ? (
        <BarraRangos
          titulo="PGC (porcentaje de grasa corporal)"
          valor={pgc}
          unidad="%"
          escala={escalaPgc}
          sinValor="Falta masa grasa corporal o peso"
        />
      ) : (
        <div className="d-flex justify-content-between">
          <span className="fw-bold">PGC (porcentaje de grasa corporal)</span>
          <span className="small opacity-50">{pgc ? `${pgc}% (registra el sexo para ver el rango)` : 'Falta masa grasa corporal o peso'}</span>
        </div>
      )}
    </CardSeccionCR>
  )
}
