import { useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { BtnAdd, BtnDelete } from '@/components/Button/buttonsCrud'
import { usePerfilNutricional } from '../../hook/usePerfilNutricional'
import type { PerfilNutricional } from '../../hook/usePerfilNutricionalStore'

type Cirugia = { id: number, cual: string, fecha: string }

let siguienteId = 1
const nuevaCirugia = (cual = '', fecha = ''): Cirugia => ({ id: siguienteId++, cual, fecha })

/** En la base van separadas por coma y en el mismo orden: "Apéndice, Rodilla" / "03/2020, 08/2022" */
const SEPARADOR = ', '
const partes = (texto: string | null) => (texto ? texto.split(',').map((p) => p.trim()) : [])
const sinComas = (texto: string) => texto.replace(/,/g, ' ').trim()

const cirugiasDe = (registro: PerfilNutricional | null) => {
  const cuales = partes(registro?.cirugia ?? null)
  const fechas = partes(registro?.cirugia_fecha ?? null)
  const filas = Array.from({ length: Math.max(cuales.length, fechas.length) }, (_, i) => nuevaCirugia(cuales[i], fechas[i]))
  return filas.length ? filas : [nuevaCirugia()]
}

/**
 * Cirugías previas de la fecha elegida: No / Sí. Con "Sí" se escribe cuál y la fecha aproximada (se pueden agregar varias).
 * No/Sí se guarda al elegir; las cirugías al salir de un campo o al quitar una.
 */
export const CardCirugiasPrevias = () => {
  const { registro } = usePerfilNutricional()
  // Al cambiar de fecha se vuelven a armar las filas con lo guardado
  return <Cirugias key={registro?.id ?? 0} registro={registro} />
}

const Cirugias = ({ registro }: { registro: PerfilNutricional | null }) => {
  const { guardar } = usePerfilNutricional()
  const [cirugias, setCirugias] = useState<Cirugia[]>(() => cirugiasDe(registro))
  // null = No; texto (aunque sea vacío) = Sí; sin fecha elegida no se marca ninguno
  const tuvo = registro ? registro.cirugia !== null : null

  /** Guarda las filas si cambiaron */
  const guardarCirugias = (lista: Cirugia[]) => {
    const cirugia = lista.map((c) => sinComas(c.cual)).join(SEPARADOR)
    const cirugia_fecha = lista.map((c) => sinComas(c.fecha)).join(SEPARADOR)
    if (cirugia !== registro?.cirugia || cirugia_fecha !== registro?.cirugia_fecha) guardar({ cirugia, cirugia_fecha })
  }

  const cambiar = (id: number, campo: 'cual' | 'fecha', valor: string) =>
    setCirugias((actual) => actual.map((c) => (c.id === id ? { ...c, [campo]: valor } : c)))
  const quitar = (id: number) => {
    const lista = cirugias.filter((c) => c.id !== id)
    setCirugias(lista)
    guardarCirugias(lista)
  }
  const elegirNo = () => {
    setCirugias([nuevaCirugia()])
    guardar({ cirugia: null, cirugia_fecha: null })
  }

  return (
    <CardSeccionCR titulo="Cirugías previas" className="mb-3">
      <div className="d-flex gap-4 mb-2">
        <Form.Check type="radio" id="cirugias-no" name="cirugias-previas" label="No" disabled={!registro} checked={tuvo === false} onChange={elegirNo} />
        <Form.Check type="radio" id="cirugias-si" name="cirugias-previas" label="Sí" disabled={!registro} checked={tuvo === true} onChange={() => guardar({ cirugia: '', cirugia_fecha: '' })} />
      </div>
      {/* Con "Sí": cuál y fecha aproximada de cada una */}
      {tuvo && (
        <>
          {cirugias.map((cirugia) => (
            <Row key={cirugia.id} className="align-items-center">
              <Col xs={6}>
                <InputCR label="¿Cuál?" value={cirugia.cual} onChange={(e) => cambiar(cirugia.id, 'cual', e.target.value)} onBlur={() => guardarCirugias(cirugias)} />
              </Col>
              <Col xs={4}>
                <InputCR label="Fecha aprox. (mes/año)" value={cirugia.fecha} onChange={(e) => cambiar(cirugia.id, 'fecha', e.target.value)} onBlur={() => guardarCirugias(cirugias)} />
              </Col>
              <Col xs={2}>
                {/* Siempre queda al menos una fila */}
                {cirugias.length > 1 && <BtnDelete label="" title="Quitar cirugía" aria-label="Quitar cirugía" onClick={() => quitar(cirugia.id)} />}
              </Col>
            </Row>
          ))}
          <BtnAdd label="Agregar cirugía" onClick={() => setCirugias((actual) => [...actual, nuevaCirugia()])} />
        </>
      )}
    </CardSeccionCR>
  )
}
