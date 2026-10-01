import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import ModalCR from "@/components/Modal/ModalCR";
import { useForm } from "@/hook/useForm";
import { useTerminologiaPersona } from "@/hook/usePropiedadesStore";
import { InputCR } from "@/components/TextFields/InputCR";
import { InputMontoCR } from "@/components/TextFields/InputMontoCR";
import { InputSelectCR } from "@/components/TextFields/InputSelectCR";
import { ButtonCR } from "@/components/Button/ButtonCR";
import { initialStatePlanEntrenamiento, type FormPlanEntrenamientoProps } from "@/pages/GestionPlanesEntrenamiento/store/planEntrenamientoSlice";
import { usePlanEntrenamientoStore } from "@/pages/GestionPlanesEntrenamiento/usePlanEntrenamientoStore";

/** Reglas de los campos numéricos: el backend los guarda como enteros */
const entero = (requerido: boolean) => ({
    ...(requerido && { required: 'Este campo es obligatorio' }),
    pattern: { value: /^\d+$/, message: 'Ingresa un número entero' },
})

/**
 * Formulario de un plan de entrenamiento.
 * Al crear se pueden elegir varios programas (se registra un plan por programa);
 * al editar, el plan ya pertenece a un programa y solo se puede cambiar por otro.
 * Se monta al abrirse (ver App), así el form arranca con los valores correctos.
 */
export const ModalCustomPlan = ({id, onHide, show}: {id: number, onHide: ()=>void, show: boolean}) => {
    const { planes, opcionesProgramas, obtenerOpProgramas, guardarPlan } = usePlanEntrenamientoStore()
    const { data: dataTarifas, cargar: cargarTarifas } = useTerminologiaPersona('tipoTarifaPrograma')
    const esEdicion = id !== 0
    // La fila del listado ya trae todos los campos del plan
    const planEditar = planes.find((p) => p.id === id)
    const { formState: { errors }, register, handleSubmit, watch, setValue, setError, clearErrors } = useForm<FormPlanEntrenamientoProps>({
        defaultValues: planEditar
            ? { ...planEditar, max_descuento: Number(planEditar.max_descuento) || 0, id_programas: [] }
            : initialStatePlanEntrenamiento.plan,
        mode: 'onChange',
    })

    useEffect(() => {
        obtenerOpProgramas()
        cargarTarifas()
    }, [])

    const idProgramas = watch('id_programas') ?? []
    const estado = Boolean(watch('estado'))
    const maxDescuento = Number(watch('max_descuento')) || 0

    const onTogglePrograma = (idPrograma: number) => {
        setValue('id_programas', idProgramas.includes(idPrograma)
            ? idProgramas.filter((idSel) => idSel !== idPrograma)
            : [...idProgramas, idPrograma])
        clearErrors('id_programas')
    }

    const onSubmit = async (data: FormPlanEntrenamientoProps) => {
        if (!esEdicion && idProgramas.length === 0) {
            setError('id_programas', { type: 'validate', message: 'Selecciona al menos un programa' })
            return
        }
        const guardado = await guardarPlan({
            ...data,
            id,
            id_programa: Number(data.id_programa),
            id_programas: idProgramas,
            nMeses: Number(data.nMeses),
            precioTotal: Number(data.precioTotal),
            id_tipo_tarifa: Number(data.id_tipo_tarifa),
            citas_nutricion_regalo: Number(data.citas_nutricion_regalo) || 0,
            dias_congelamiento_regalo: Number(data.dias_congelamiento_regalo) || 0,
            max_descuento: maxDescuento,
            estado,
        })
        if (guardado) onHide()
    }
  return (
    <ModalCR onHide={onHide} show={show} size='md' position='center'>
        <ModalCR.Header>
            <ModalCR.Title>{esEdicion ? 'Editar plan' : 'Nuevo plan'}</ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row className="g-2">
                
                <Col lg={12}>
                  <InputSelectCR {...register('id_tipo_tarifa', {
                      min: { value: 1, message: 'Selecciona una tarifa' },
                    })} label='Nombre de la tarifa' name='id_tipo_tarifa' options={dataTarifas} messageErrors={errors.id_tipo_tarifa?.message} />
                </Col>
                <Col lg={3}>
                  <InputCR {...register('nMeses', {
                      ...entero(true),
                      min: { value: 1, message: 'Debe ser al menos 1 mes' },
                    })} label='N° Meses' name='nMeses' inputMode='numeric' messageErrors={errors.nMeses?.message} />
                </Col>
                <Col lg={4}>
                  <InputCR {...register('precioTotal', {
                      ...entero(true),
                      min: { value: 1, message: 'El precio debe ser mayor a 0' },
                    })} label='Precio total' name='precioTotal' inputMode='numeric' messageErrors={errors.precioTotal?.message} />
                </Col>
                <Col lg={5}>
                  {/* InputMontoCR permite decimales ("12.5"); el valor vive en el form vía setValue */}
                  <InputMontoCR
                    label='Descuento máximo (S/)'
                    value={maxDescuento}
                    onChange={(valor) => setValue('max_descuento', valor)}
                  />
                </Col>
                <Col lg={4} className="d-flex align-items-center">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="plan-estado"
                      checked={estado}
                      onChange={(e) => setValue('estado', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="plan-estado">Activo</label>
                  </div>
                </Col>
              </Row>

              <div className="fw-bold mt-3 mb-2">Regalos</div>
              <Row className="g-2">
                <Col lg={6}>
                  <InputCR {...register('citas_nutricion_regalo', entero(false))} label='Citas de nutrición' name='citas_nutricion_regalo' inputMode='numeric' messageErrors={errors.citas_nutricion_regalo?.message} />
                </Col>
                <Col lg={6}>
                  <InputCR {...register('dias_congelamiento_regalo', entero(false))} label='Días de congelamiento' name='dias_congelamiento_regalo' inputMode='numeric' messageErrors={errors.dias_congelamiento_regalo?.message} />
                </Col>
              </Row>

              <div className="fw-bold mt-3 mb-2">{esEdicion ? 'Programa' : 'Programas (se crea un plan por cada uno)'}</div>
              {esEdicion ? (
                <InputSelectCR {...register('id_programa', {
                    min: { value: 1, message: 'Selecciona un programa' },
                  })} label='Programa' name='id_programa' options={opcionesProgramas} messageErrors={errors.id_programa?.message} />
              ) : (
                <>
                  {/* Multiselección con checkboxes, igual que categorías/sucursales en GestionProgramasEntrenamiento */}
                  {opcionesProgramas.map((programa) => (
                    <div className="form-check" key={programa.value}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`plan-programa-${programa.value}`}
                        checked={idProgramas.includes(programa.value)}
                        onChange={() => onTogglePrograma(programa.value)}
                      />
                      <label className="form-check-label" htmlFor={`plan-programa-${programa.value}`}>{programa.label}</label>
                    </div>
                  ))}
                  <span className="text-danger fw-bold px-2" style={{ fontSize: '11px' }}>{errors.id_programas?.message}</span>
                </>
              )}

              <div className="d-flex align-items-center mt-3">
                <ButtonCR label='Guardar' type='submit' />
                <ButtonCR label='Cancelar' variant='link' onClick={onHide} />
              </div>
            </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
