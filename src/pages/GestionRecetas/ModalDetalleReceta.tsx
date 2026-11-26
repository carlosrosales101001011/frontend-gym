import { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { BadgeCR } from '@/components/Badge/BadgeCR'
import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import ModalCR from '@/components/Modal/ModalCR'
import { FAKE_IMAGEN } from '@/pages/GestionRecetas/fakeRecetas'
import type { RecetaProps } from '@/pages/GestionRecetas/store/recetaSlice'
import { useRecetaStore } from '@/pages/GestionRecetas/useRecetaStore'

const ALTO_IMAGEN = 240

/** Pasos de la preparación (uno por línea), sin su número: lo pone la lista */
const pasosDe = (preparacion = '') => preparacion.split('\n').map((paso) => paso.replace(/^\d+\.\s*/, '').trim()).filter(Boolean)

/** Badges de la receta (dificultad, porciones y tiempo): los mismos en la card y en el modal */
export const BadgesReceta = ({ receta: { dificultad, porciones, minutos_preparacion }, className = '' }: { receta: RecetaProps, className?: string }) => (
  <div className={`d-flex flex-wrap gap-2 ${className}`}>
    {dificultad && <BadgeCR className="p-2 fs-6" label={`Dificultad: ${dificultad}`} />}
    <BadgeCR className="p-2 fs-6" label={`${porciones} ${porciones === 1 ? 'porción' : 'porciones'}`} />
    {minutos_preparacion != null && <BadgeCR className="p-2 fs-6" label={`${minutos_preparacion}min`} />}
  </div>
)

type ModalDetalleRecetaProps = {
  /** Receta de la card */
  receta: RecetaProps
  onHide: () => void
}

/** Toda la información de la receta (solo lectura): foto y nutrición a la izquierda; ingredientes y pasos a la derecha. Se monta al abrirse */
export const ModalDetalleReceta = ({ receta, onHide }: ModalDetalleRecetaProps) => {
  const { obtenerReceta } = useRecetaStore()
  /** Detalle del back: es el único que trae los alérgenos */
  const [detalle, setDetalle] = useState<RecetaProps | null>(null)

  useEffect(() => {
    // Las de ejemplo (id negativo) no están en la base
    if (receta.id < 0) return
    const ctrl = new AbortController()
    obtenerReceta(receta.id, ctrl.signal).then((data) => {
      if (!ctrl.signal.aborted) setDetalle(data)
    })
    return () => ctrl.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receta.id])

  const { titulo, nutricion, ingredientes = [], alergenos = [], preparacion, imagen = FAKE_IMAGEN } = { ...receta, ...detalle }
  const porPorcion = nutricion?.por_porcion
  const total = nutricion?.total
  const datosNutricion = [
    { label: 'Kcal', porcion: porPorcion?.kcal ?? 0, total: total?.kcal ?? 0 },
    { label: 'Proteína', porcion: `${porPorcion?.proteinas_g ?? 0} g`, total: `${total?.proteinas_g ?? 0} g` },
    { label: 'Carbo', porcion: `${porPorcion?.carbohidratos_g ?? 0} g`, total: `${total?.carbohidratos_g ?? 0} g` },
    { label: 'Grasa', porcion: `${porPorcion?.grasas_g ?? 0} g`, total: `${total?.grasas_g ?? 0} g` },
  ]
  const pasos = pasosDe(preparacion)

  return (
    <ModalCR show onHide={onHide} size="xl" position="center">
      <ModalCR.Header>
        <ModalCR.Title>{titulo}</ModalCR.Title>
      </ModalCR.Header>
      <ModalCR.Body>
        <Row className="g-3">
          <Col lg={5}>
            <img src={imagen} alt={titulo} className="w-100 object-fit-cover rounded mb-3" style={{ height: ALTO_IMAGEN }} />
            <BadgesReceta receta={receta} className="mb-3" />
            <Row className="g-2 text-center">
              {datosNutricion.map(({ label, porcion, total: valorTotal }) => (
                <Col xs={6} key={label}>
                  <div className="border rounded p-2">
                    <div className="fs-4 fw-bold">{porcion}</div>
                    <div>{label}</div>
                    <div className="text-muted small">Total: {valorTotal}</div>
                  </div>
                </Col>
              ))}
            </Row>
            <div className="text-muted small text-center mt-2">Valores por porción; el total es de toda la receta</div>
            {alergenos.length > 0 && (
              <p className="text-danger mt-3 mb-0">Alérgenos: {alergenos.map((a) => a.label_alergeno).join(', ')}</p>
            )}
          </Col>
          <Col lg={7}>
            <CardSeccionCR titulo="Ingredientes" className="mb-3">
              <ul className="list-unstyled mb-0">
                {ingredientes.map(({ id_ingrediente, label_ingrediente, cantidad, label_unidad, gramos }, i) => (
                  <li key={id_ingrediente} className={`d-flex justify-content-between gap-2 py-2 ${i > 0 ? 'border-top' : ''}`}>
                    <span>{label_ingrediente}</span>
                    <span className="fw-bold text-nowrap">
                      {Number(cantidad)} {label_unidad}{gramos != null && ` (${Number(gramos)} g)`}
                    </span>
                  </li>
                ))}
              </ul>
            </CardSeccionCR>
            <CardSeccionCR titulo="Preparación">
              {pasos.length === 0 && <p className="text-muted mb-0">Sin preparación registrada.</p>}
              <ol className="list-unstyled d-flex flex-column gap-3 mb-0">
                {pasos.map((paso, i) => (
                  <li key={i} className="d-flex align-items-start gap-2">
                    <BadgeCR className="fs-6 flex-shrink-0" label={String(i + 1)} />
                    <span>{paso}</span>
                  </li>
                ))}
              </ol>
            </CardSeccionCR>
          </Col>
        </Row>
      </ModalCR.Body>
    </ModalCR>
  )
}
