import { useEffect, useMemo, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { normalizeText } from '@/helpers/strings'
import { idsDeTexto, textoDeIds, usePerfilNutricional } from '../../hook/usePerfilNutricional'

/** "Otro/Otros" pide cuál (se reconoce por el texto de la terminología) */
const esOtro = (label: string) => normalizeText(label).startsWith('otr')

/**
 * Objetivos específicos del paciente en la fecha elegida: opciones desde la terminología (perfil-paciente /
 * tipos-objetivos / objetivos_principales); se pueden marcar varios; "Otro" pide cuál.
 * Las casillas se guardan al marcar; "¿Cuál?" al salir del campo.
 */
export const CardObjetivoPrincipal = () => {
  const { data, cargar } = useTerminologiaPersona('objetivosPrincipales')
  const [cargando, setCargando] = useState(true)
  const { registro, valor, guardar, propsTexto } = usePerfilNutricional()
  const especificos = idsDeTexto(valor('objetivo_principal'))

  useEffect(() => {
    cargar().finally(() => setCargando(false))
  }, [cargar])

  // El back las devuelve de la más nueva a la más antigua: se muestran en el orden en que se registraron
  const opciones = useMemo(() => [...data].sort((a, b) => a.value - b.value), [data])
  const idOtro = opciones.find((o) => esOtro(o.label))?.value

  const alternar = (id: number) => {
    const marcados = especificos.includes(id) ? especificos.filter((o) => o !== id) : [...especificos, id]
    // Sin "Otro" ya no aplica lo escrito en "¿Cuál?"
    const quitaOtro = id === idOtro && !marcados.includes(id) && !!valor('objetivo_principal_cuales')
    guardar({ objetivo_principal: textoDeIds(marcados), ...(quitaOtro && { objetivo_principal_cuales: null }) })
  }

  return (
    <CardSeccionCR titulo="Objetivo principal" className="mb-3">
      <div className="fw-semibold mt-2 mb-1">Objetivos específicos</div>
      {cargando && <p className="small opacity-75 mb-2">Cargando opciones...</p>}
      {!cargando && opciones.length === 0 && <p className="small opacity-75 mb-2">No hay opciones registradas.</p>}
      <Row>
        {opciones.map(({ value, label }) => (
          <Col key={value} lg={6}>
            <Form.Check
              type="checkbox"
              id={`objetivo-${value}`}
              label={label}
              disabled={!registro}
              checked={especificos.includes(value)}
              onChange={() => alternar(value)}
            />
          </Col>
        ))}
      </Row>
      {/* "Otro": se escribe cuál */}
      {idOtro !== undefined && especificos.includes(idOtro) && (
        <InputCR label="¿Cuál?" {...propsTexto('objetivo_principal_cuales')} />
      )}
    </CardSeccionCR>
  )
}
