import { Card, Col, Row } from 'react-bootstrap'
import { BsPlusLg, BsTrash } from 'react-icons/bs'
import { InputCR } from '@/components/TextFields/InputCR'
import { useAppDispatch, useAppSelector } from '@/stores/Store'
import { onAddPlan, onRemovePlan, onUpdatePlan, type PlanesProps } from '@/pages/GestionProgramasEntrenamiento/store/programaSlice'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { useEffect } from 'react'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'

export const AppPlanes = () => {
  const dispatch = useAppDispatch()
  const { cargar:cargarTarifaPgm, data:dataTarifasPgm } = useTerminologiaPersona('tipoTarifaPrograma')
  const planes = useAppSelector((state) => state.PROGRAMA.programa.planes)
  useEffect(() => {
    cargarTarifaPgm()
  }, [])
  
  const handleChange = (index: number, name: keyof PlanesProps, value: string | number | boolean) => {
    dispatch(onUpdatePlan({ index, name, value }))
  }

  return (
    <div>
      {planes.map((plan, index) => (
        <Card key={index} className="card-mode-actual item-form-card mb-4">
          <Card.Body>
            <div className="d-flex justify-content-end mb-2">
              <BsTrash
                role="button"
                size={18}
                className="text-danger"
                onClick={() => dispatch(onRemovePlan(index))}
              />
            </div>
            <Row className="align-items-center">
              <Col lg={2}>
                <InputCR
                  label='N° Meses'
                  name='nMeses'
                  type='normal'
                  value={plan.nMeses}
                  onChange={(e) => handleChange(index, 'nMeses', Number(e.target.value))}
                />
              </Col>
              <Col lg={3}>
                <InputCR
                  label='Precio Total'
                  name='precioTotal'
                  type='normal'
                  value={plan.precioTotal}
                  onChange={(e) => handleChange(index, 'precioTotal', Number(e.target.value))}
                />
              </Col>
              <Col lg={5}>
                <InputSelectCR
                    label='Nombre de la tarifa'
                    options={dataTarifasPgm}
                    defaultValue={String(plan.id_tipo_tarifa)}
                    onChange={(e) => handleChange(index, 'id_tipo_tarifa', Number(e.target.value))}
                />
              </Col>
              <Col lg={2}>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id={`plan-estado-${index}`}
                    checked={plan.estado}
                    onChange={(e) => handleChange(index, 'estado', e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor={`plan-estado-${index}`}>Activo</label>
                </div>
              </Col>
            </Row>
            <div className='mb-4 fs-4'>Regalos</div>
            <Row>
              <Col lg={6}>
                <InputCR
                  label='Citas de nutricion'
                  name='citas_nutricion_regalo'
                  type='normal'
                  value={plan.citas_nutricion_regalo}
                  onChange={(e) => handleChange(index, 'citas_nutricion_regalo', Number(e.target.value))}
                />
              </Col>
              <Col lg={6}>
                <InputCR
                  label='Dias de congelamiento'
                  name='dias_congelamiento_regalo'
                  type='normal'
                  value={plan.dias_congelamiento_regalo}
                  onChange={(e) => handleChange(index, 'dias_congelamiento_regalo', Number(e.target.value))}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
      <Card
        role="button"
        tabIndex={0}
        className="add-item-card"
        onClick={() => dispatch(onAddPlan())}
      >
        <div className="d-flex flex-column align-items-center gap-2">
          <BsPlusLg size={22} />
          <span>Agregar plan</span>
        </div>
      </Card>
    </div>
  )
}
