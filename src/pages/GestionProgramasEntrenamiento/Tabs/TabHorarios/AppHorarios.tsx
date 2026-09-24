import { Card, Col, Row } from 'react-bootstrap'
import { BsPlusLg, BsTrash } from 'react-icons/bs'
import { InputCR } from '@/components/TextFields/InputCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { useAppDispatch, useAppSelector } from '@/stores/Store'
import { onAddHorario, onRemoveHorario, onUpdateHorario, type HorarioProps } from '@/pages/GestionProgramasEntrenamiento/store/programaSlice'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useEffect } from 'react'
import { useProgramaEntrenamientoStore } from '../../useProgramaEntrenamientoStore'

const DIAS: { name: keyof HorarioProps, label: string }[] = [
  { name: 'is_lunes', label: 'Lunes' },
  { name: 'is_martes', label: 'Martes' },
  { name: 'is_miercoles', label: 'Miércoles' },
  { name: 'is_jueves', label: 'Jueves' },
  { name: 'is_viernes', label: 'Viernes' },
  { name: 'is_sabado', label: 'Sábado' },
  { name: 'is_domingo', label: 'Domingo' },
]

export const AppHorarios = () => {
  const dispatch = useAppDispatch()
  const { obtenerEntrenadores } = useProgramaEntrenamientoStore()
  const {horarios} = useAppSelector((state) => state.PROGRAMA.programa)
  const {opcionesEmpleados} = useAppSelector((state) => state.PROGRAMA)

  const handleChange = (index: number, name: keyof HorarioProps, value: string | number | boolean) => {
    dispatch(onUpdateHorario({ index, name, value }))
  }
  useEffect(() => {
    obtenerEntrenadores()
  }, [])
  
  return (
    <div>
      {horarios.map((horario, index) => (
        <Card key={index} className="item-form-card mb-4 card-mode-actual">
          <Card.Body>
            <div className="d-flex justify-content-end mb-2">
              <BsTrash
                role="button"
                size={18}
                className="text-danger"
                onClick={() => dispatch(onRemoveHorario(index))}
              />
            </div>
            <Row className="align-items-center">
              <Col lg={2}>
                <InputCR
                  label='Hora inicio'
                  name='horarioInicio'
                  type='normal'
                  value={horario.horarioInicio}
                  onChange={(e) => handleChange(index, 'horarioInicio', e.target.value)}
                />
              </Col>
              <Col lg={2}>
                <InputCR
                  label='Hora fin'
                  name='horarioFin'
                  type='normal'
                  value={horario.horarioFin}
                  readOnly
                  disabled
                />
              </Col>
              <Col lg={4}>
                <InputSelectCR
                  label='Entrenador'
                  name='id_empl'
                  options={opcionesEmpleados}
                  value={horario.id_empl}
                  defaultValue={String(horario.id_empl)}
                  onChange={(e) => handleChange(index, 'id_empl', Number(e.target.value))}
                />
              </Col>
              {/* <Col lg={4}>
                <InputCR
                  label='Id Sala'
                  name='id_sala'
                  type='normal'
                  value={horario.id_sala}
                  onChange={(e) => handleChange(index, 'id_sala', Number(e.target.value))}
                />
              </Col> */}
              <Col lg={2}>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id={`horario-estado-${index}`}
                    checked={horario.estado}
                    onChange={(e) => handleChange(index, 'estado', e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor={`horario-estado-${index}`}>Activo</label>
                </div>
              </Col>
              <Col lg={12}>
                <div className="d-flex flex-wrap gap-2 my-2">
                  {DIAS.map((dia) => {
                    const activo = Boolean(horario[dia.name])
                    return (
                      <ButtonCR
                        key={dia.name}
                        label={dia.label}
                        variant={activo ? 'primary' : 'outline-secondary'}
                        onClick={() => handleChange(index, dia.name, !activo)}
                      />
                    )
                  })}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
      <Card
        role="button"
        tabIndex={0}
        className="add-item-card"
        onClick={() => dispatch(onAddHorario())}
      >
        <div className="d-flex flex-column align-items-center gap-2">
          <BsPlusLg size={22} />
          <span>Agregar horario</span>
        </div>
      </Card>
    </div>
  )
}
