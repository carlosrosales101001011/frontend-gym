import { useState, type ReactNode } from 'react'
import { Col, Row } from 'react-bootstrap'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { Card1 } from '@/components/Cards/Card1/Card1'
import Paginacion from '@/components/DataTableTest/Paginacion'
import { SearchedCR } from '@/components/DataTableTest/SearchedCR'
import IconCR from '@/components/Icons/IconCR'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { ContadorCoincidencias } from '@/components/SinResultados/ContadorCoincidencias'
import { useQueryParams } from '@/hook/useQueryParams'
import { useAppSelector } from '@/stores/Store'
import { querys } from '@/types/parametros'
import { FAKE_IMAGEN, FAKE_RECETAS } from '@/pages/GestionRecetas/fakeRecetas'
import { BadgesReceta, ModalDetalleReceta } from '@/pages/GestionRecetas/ModalDetalleReceta'
import type { RecetaProps } from '@/pages/GestionRecetas/store/recetaSlice'
import { useRecetaStore } from '@/pages/GestionRecetas/useRecetaStore'

const ALTO_IMAGEN = 160
/** Palabras de la preparación (sin la numeración de los pasos) que se ven en la card; el resto va en el modal */
const PALABRAS_PREPARACION = 10

const resumen = (texto = '') => texto.replace(/^\d+\.\s*/gm, '').split(/\s+/).filter(Boolean).slice(0, PALABRAS_PREPARACION).join(' ')

type CardsRecetasProps = {
  onOpenModalCustom: (id: number) => void
  otrosBotones: ReactNode
  /** Ya respondió la primera búsqueda: recién entonces se sabe si no hay recetas */
  cargado: boolean
}

/** Recetas en cards, con buscador y paginación. Sin recetas registradas muestra las de ejemplo (sin acciones) */
export const CardsRecetas = ({ onOpenModalCustom, otrosBotones, cargado }: CardsRecetasProps) => {
  const { recetas, eliminarReceta } = useRecetaStore()
  /** Receta abierta en el modal de detalle; null = cerrado */
  const [detalle, setDetalle] = useState<RecetaProps | null>(null)
  const { get } = useQueryParams()
  const buscado = get(querys.search).trim()
  const { totalShow, cargandoTabla } = useAppSelector((state) => state.UI)
  const cargando = cargandoTabla > 0

  const esEjemplo = cargado && !cargando && !buscado && totalShow === 0
  const lista = esEjemplo ? FAKE_RECETAS : recetas

  return (
    <div>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
        {otrosBotones}
        <div className="d-flex flex-wrap align-items-center gap-2">
          {buscado && <ContadorCoincidencias total={totalShow} cargando={cargando} />}
          <SearchedCR />
        </div>
      </div>
      {esEjemplo && <p className="text-muted mx-1 mb-2">Todavía no hay recetas registradas: estas son de ejemplo.</p>}
      <div className="position-relative" style={{ minHeight: 200 }}>
        <LoadingOverlay show={cargando} interno texto="Cargando recetas" />
        {cargado && !cargando && lista.length === 0 && <p className="text-center text-muted mt-4">No se encontraron recetas.</p>}
        <Row className="g-3 mx-0">
          {lista.map((receta) => {
            const { id, titulo, porciones, ingredientes = [], nutricion, imagen = FAKE_IMAGEN, preparacion } = receta
            const porPorcion = nutricion?.por_porcion
            return (
              <Col key={id} xs={12} md={6} xl={3}>
                <Card1 className="h-100">
                  <img src={imagen} alt={titulo} loading="lazy" className="w-100 object-fit-cover flex-shrink-0" style={{ height: ALTO_IMAGEN }} />
                  <Card1.Header>
                      {titulo}
                  </Card1.Header>
                  <Card1.Body>
                    <BadgesReceta receta={receta} className="mb-3" />
                    <Row className="text-center g-0 mb-1">
                      <Col><div className="fw-bold">{porPorcion?.kcal ?? 0}</div>Kcal</Col>
                      <Col><div className="fw-bold">{porPorcion?.proteinas_g ?? 0} g</div>Proteína</Col>
                      <Col><div className="fw-bold">{porPorcion?.carbohidratos_g ?? 0} g</div>Carbo</Col>
                      <Col><div className="fw-bold">{porPorcion?.grasas_g ?? 0} g</div>Grasa</Col>
                    </Row>
                    <div className="text-muted small text-center mb-3">Por porción</div>
                    <div className="fw-bold mb-1">Ingredientes ({porciones} {porciones === 1 ? 'porción' : 'porciones'})</div>
                    <ul className="list-unstyled mb-0">
                      {ingredientes.map(({ id_ingrediente, label_ingrediente, cantidad, label_unidad }) => (
                        <li key={id_ingrediente} className="d-flex justify-content-between gap-2">
                          <span>{label_ingrediente}</span>
                          <span className="text-muted text-nowrap">{Number(cantidad)} {label_unidad}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="fw-bold mt-3 mb-1">Preparación</div>
                    <p className="mb-0">
                      {resumen(preparacion)}{' '}
                      <ButtonCR label="ver más..." variant="link" className="align-baseline" style={{ padding: 0 }} onClick={() => setDetalle(receta)} />
                    </p>
                  </Card1.Body>
                  <Card1.Footer>
                    <div className="d-flex justify-content-end">
                      <ButtonCR title="Editar" variant="primary" disabled={esEjemplo} icon={<IconCR name="edit" size={14} />} onClick={() => onOpenModalCustom(id)} />
                      <ButtonCR title="Eliminar" variant="danger" disabled={esEjemplo} icon={<IconCR name="trash" size={14} />} onClick={() => eliminarReceta(id)} />
                    </div>
                  </Card1.Footer>
                </Card1>
              </Col>
            )
          })}
        </Row>
      </div>
      {detalle && <ModalDetalleReceta receta={detalle} onHide={() => setDetalle(null)} />}
      {!esEjemplo && <Paginacion classNameTablePagination="mt-3" />}
    </div>
  )
}
