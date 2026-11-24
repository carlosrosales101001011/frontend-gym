import { Col, Row } from 'react-bootstrap'
import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { usePerfilNutricional } from '../../hook/usePerfilNutricional'

type Opcion = { value: number, label: string }

const CONSUMO_ALCOHOL: Opcion[] = [
  { value: 1, label: 'Nunca' },
  { value: 2, label: 'Ocasional' },
  { value: 3, label: 'Semanal' },
  { value: 4, label: 'Diario' },
]
const FUMA: Opcion[] = [
  { value: 1, label: 'Sí' },
  { value: 2, label: 'No' },
]
/** Estrés diario: del 1 (nada) al 10 (máximo) */
const ESTRES: Opcion[] = Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: String(i + 1) }))
const ACTIVIDAD_DIARIA: Opcion[] = [
  { value: 1, label: 'Sedentario' },
  { value: 2, label: 'Ligero' },
  { value: 3, label: 'Moderado' },
  { value: 4, label: 'Intenso' },
]

/** Opción de la lista con ese texto (0 = sin elegir); en la base se guarda el texto */
const valorDeTexto = (opciones: Opcion[], texto?: string | null) => opciones.find((o) => o.label === texto)?.value ?? 0
const textoDeValor = (opciones: Opcion[], valor: number) => opciones.find((o) => o.value === valor)?.label ?? null

/** Hábitos y estilo de vida del paciente en la fecha elegida: lo escrito se guarda al salir del campo y las listas al elegir */
export const CardHabitosEstiloVida = () => {
  const { registro, valor, guardar, propsDecimal, propsTexto } = usePerfilNutricional()
  const fuma = valor('fuma_evida')

  return (
    <CardSeccionCR titulo="Hábitos y estilo de vida" className="mb-3">
      <Row>
        <Col xs={6}>
          <InputCR label="Horas de sueño promedio" {...propsDecimal('horas_suenio_evida')} />
        </Col>
        <Col xs={6}>
          <InputCR label="Consumo de agua (L/día)" {...propsDecimal('consumo_agua_evida')} />
        </Col>
        <Col xs={6}>
          <InputSelectCR
            label="Consumo de alcohol"
            options={CONSUMO_ALCOHOL}
            disabled={!registro}
            defaultValue={String(valorDeTexto(CONSUMO_ALCOHOL, valor('consumo_alcohol_evida')))}
            onChange={(e) => guardar({ consumo_alcohol_evida: textoDeValor(CONSUMO_ALCOHOL, Number(e.target.value)) })}
          />
        </Col>
        <Col xs={6}>
          <InputSelectCR
            label="Fuma"
            options={FUMA}
            disabled={!registro}
            defaultValue={String(fuma === true ? 1 : fuma === false ? 2 : 0)}
            onChange={(e) => guardar({ fuma_evida: e.target.value === '1' ? true : e.target.value === '2' ? false : null })}
          />
        </Col>
        <Col xs={6}>
          <InputSelectCR
            label="Estrés diario (1-10)"
            options={ESTRES}
            disabled={!registro}
            defaultValue={String(valor('estres_evida') ?? 0)}
            onChange={(e) => guardar({ estres_evida: Number(e.target.value) || null })}
          />
        </Col>
        <Col xs={6}>
          <InputSelectCR
            label="Nivel de actividad diaria"
            options={ACTIVIDAD_DIARIA}
            disabled={!registro}
            defaultValue={String(valorDeTexto(ACTIVIDAD_DIARIA, valor('actividadDiaria_evida')))}
            onChange={(e) => guardar({ actividadDiaria_evida: textoDeValor(ACTIVIDAD_DIARIA, Number(e.target.value)) })}
          />
        </Col>
        <Col xs={6}>
          <InputCR label="Frecuencia de evacuación" maxLength={100} {...propsTexto('frecuencia_evacuacion')} />
        </Col>
        <Col xs={6}>
          <InputCR label="Porciones de alimentos por día" maxLength={100} {...propsTexto('porciones_alimentos_x_dia')} />
        </Col>
      </Row>
    </CardSeccionCR>
  )
}
