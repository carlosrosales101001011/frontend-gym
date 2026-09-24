import { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { InputCR } from '@/components/TextFields/InputCR'
import { useAppDispatch, useAppSelector } from '@/stores/Store'
import { onChangeInformacion, onToggleCategoria, onToggleSucursal, type programaProps } from '@/pages/GestionProgramasEntrenamiento/store/programaSlice'
import { useProgramaEntrenamientoStore } from '@/pages/GestionProgramasEntrenamiento/useProgramaEntrenamientoStore'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'

export const AppInformacion = () => {
  const dispatch = useAppDispatch()
  const { obtenerSucursales } = useProgramaEntrenamientoStore()
  const producto = useAppSelector((state) => state.PROGRAMA.programa)
  const { opcionesSucursales } = useAppSelector((state) => state.PROGRAMA)
  const { cargar:cargarCategoriaPrograma, data:dataCategoriaPrograma } = useTerminologiaPersona('categoriaPrograma')
  useEffect(() => {
    obtenerSucursales()
    cargarCategoriaPrograma()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    dispatch(onChangeInformacion({ [name]: value } as Partial<programaProps>))
  }

  const handleChangeEstado = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(onChangeInformacion({ estado: e.target.checked }))
  }

  return (
    <div>
      <Row>
        <Col lg={12}>
          <InputCR label='Nombre' name='nombre' type='normal' value={producto.nombre} onChange={handleChange} />
        </Col>
        <Col lg={6}>
          <InputCR label='Sigla' name='sigla' type='normal' value={producto.sigla} onChange={handleChange} />
        </Col>
        <Col lg={6}>
          <InputCR label='Minutos' name='minutos' type='normal' value={producto.minutos} onChange={handleChange} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <InputCR label='Descripción' name='descripcion' type='text-area' value={producto.descripcion} onChange={handleChange} />
        </Col>
      </Row>

      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="estadoPrograma"
          checked={producto.estado}
          onChange={handleChangeEstado}
        />
        <label className="form-check-label" htmlFor="estadoPrograma">Activo</label>
      </div>

      <p className="mb-1 fw-bold">Categorías</p>
      <div className="d-flex flex-wrap gap-3 mb-3">
        {dataCategoriaPrograma.map((categoria) => (
          <div className="form-check" key={categoria.value}>
            <input
              className="form-check-input"
              type="checkbox"
              id={`categoria-${categoria.value}`}
              checked={producto.categorias.some((c) => c.id_categoria === categoria.value)}
              onChange={() => dispatch(onToggleCategoria(categoria.value))}
            />
            <label className="form-check-label" htmlFor={`categoria-${categoria.value}`}>{categoria.label}</label>
          </div>
        ))}
      </div>

      <p className="mb-1 fw-bold">Sucursales</p>
      <div className="d-flex flex-wrap gap-3 mb-3">
        {opcionesSucursales.map((sucursal) => (
          <div className="form-check" key={sucursal.value}>
            <input
              className="form-check-input"
              type="checkbox"
              id={`sucursal-${sucursal.value}`}
              checked={producto.sucursales.some((s) => s.id_sucursal === sucursal.value)}
              onChange={() => dispatch(onToggleSucursal(sucursal.value))}
            />
            <label className="form-check-label" htmlFor={`sucursal-${sucursal.value}`}>{sucursal.label}</label>
          </div>
        ))}
      </div>
    </div>
  )
}
