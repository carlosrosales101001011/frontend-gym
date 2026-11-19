import { useEffect, useMemo, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { useTerminologiaPersona, type TerminologiaKey } from '@/hook/usePropiedadesStore'
import { normalizeText } from '@/helpers/strings'
import { idsDeTexto, textoDeIds, usePerfilNutricional } from '../../hook/usePerfilNutricional'

type CardAntecedentesProps = {
  titulo: string
  /** Terminología con las opciones (perfil-paciente / tipos-antecedentes / ...) */
  terminologia: TerminologiaKey
  /** Columnas de perfil_nutricional: [campo] (ids), [campo]_cuales y [campo]_observacion */
  campo: 'antecedentes_personales' | 'antecedentes_familiares' | 'lesiones' | 'alergias'
}

/** "Ninguno/Ninguna" no se combina con los demás; "Otros/Otras" pide cuáles (se reconocen por el texto de la terminología) */
const esNinguno = (label: string) => normalizeText(label).startsWith('ningun')
const esOtros = (label: string) => normalizeText(label).startsWith('otr')

/**
 * Antecedentes (personales, familiares, lesiones, alergias...) de la fecha elegida: opciones desde la terminología;
 * se pueden marcar varias; "Ninguno" desmarca el resto y viceversa; "Otros" pide cuáles. Abajo una observación.
 * Las casillas se guardan al marcar; lo escrito al salir del campo.
 */
export const CardAntecedentes = ({ titulo, terminologia, campo }: CardAntecedentesProps) => {
  const { data, cargar } = useTerminologiaPersona(terminologia)
  const [cargando, setCargando] = useState(true)
  const { registro, valor, guardar, propsTexto } = usePerfilNutricional()
  const campoCuales = `${campo}_cuales` as const
  const marcados = idsDeTexto(valor(campo))

  useEffect(() => {
    cargar().finally(() => setCargando(false))
  }, [cargar])

  // El back las devuelve de la más nueva a la más antigua: se muestran en el orden en que se registraron
  const opciones = useMemo(() => [...data].sort((a, b) => a.value - b.value), [data])
  const idNinguno = opciones.find((o) => esNinguno(o.label))?.value
  const idOtros = opciones.find((o) => esOtros(o.label))?.value

  const alternar = (id: number) => {
    const nuevos = marcados.includes(id)
      ? marcados.filter((a) => a !== id)
      : id === idNinguno ? [id] : [...marcados.filter((a) => a !== idNinguno), id]
    // Sin "Otros" ya no aplica lo escrito en "¿Cuáles?"
    const quitaOtros = idOtros !== undefined && !nuevos.includes(idOtros) && !!valor(campoCuales)
    guardar({ [campo]: textoDeIds(nuevos), ...(quitaOtros && { [campoCuales]: null }) })
  }

  return (
    <CardSeccionCR titulo={titulo} className="mb-3">
      {cargando && <p className="small opacity-75 mb-2">Cargando opciones...</p>}
      {!cargando && opciones.length === 0 && <p className="small opacity-75 mb-2">No hay opciones registradas.</p>}
      <Row>
        {opciones.map(({ value, label }) => (
          <Col key={value} xs={4}>
            <Form.Check
              type="checkbox"
              id={`${campo}-${value}`}
              label={label}
              disabled={!registro}
              checked={marcados.includes(value)}
              onChange={() => alternar(value)}
            />
          </Col>
        ))}
      </Row>
      {/* "Otros": se escribe cuáles */}
      {idOtros !== undefined && marcados.includes(idOtros) && (
        <InputCR label="¿Cuáles?" {...propsTexto(campoCuales)} />
      )}
      <InputCR type="text-area" label="Observación" {...propsTexto(`${campo}_observacion`)} />
    </CardSeccionCR>
  )
}
