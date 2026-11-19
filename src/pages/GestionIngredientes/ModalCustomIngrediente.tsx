import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import ModalCR from "@/components/Modal/ModalCR";
import { InputCR } from "@/components/TextFields/InputCR";
import { InputSelectCR } from "@/components/TextFields/InputSelectCR";
import { InputMontoCR } from "@/components/TextFields/InputMontoCR";
import { ButtonCR } from "@/components/Button/ButtonCR";
import IconCR from "@/components/Icons/IconCR";
import { useTerminologiaPersona } from "@/hook/usePropiedadesStore";
import { initialStateIngrediente, type IngredienteProps, type UnidadIngredienteProps } from "@/pages/GestionIngredientes/store/ingredienteSlice";
import { useIngredienteStore } from "@/pages/GestionIngredientes/useIngredienteStore";

/** Campos numéricos por cada 100 g */
const CAMPOS_NUTRICION = [
  { campo: 'kcal', label: 'Kcal' },
  { campo: 'proteinas_g', label: 'Proteínas (g)' },
  { campo: 'carbohidratos_g', label: 'Carbohidratos (g)' },
  { campo: 'grasas_g', label: 'Grasas (g)' },
] as const

/**
 * Formulario del ingrediente: nombre, nutrición por 100 g, sus unidades (cuántos gramos pesa
 * cada una) y sus alérgenos. Se monta al abrirse (ver App), así arranca limpio o con los datos a editar.
 */
export const ModalCustomIngrediente = ({id, onHide, show}: {id: number, onHide: ()=>void, show: boolean}) => {
    const { ingredientes, guardarIngrediente } = useIngredienteStore()
    const esEdicion = id !== 0
    // La fila del listado ya trae sus unidades y alérgenos
    const [form, setForm] = useState<IngredienteProps>(
      () => ingredientes.find((i) => i.id === id) ?? initialStateIngrediente.ingrediente
    )
    const [errores, setErrores] = useState<{ nombre?: string, unidades?: string }>({})
    const { data: dataUnidades, cargar: cargarUnidades } = useTerminologiaPersona('unidadIngrediente')
    const { data: dataAlergenos, cargar: cargarAlergenos } = useTerminologiaPersona('alergenoIngrediente')

    useEffect(() => {
        cargarUnidades()
        cargarAlergenos()
    }, [])

    /** Cambia un campo del formulario */
    const cambiar = <K extends keyof IngredienteProps>(campo: K, valor: IngredienteProps[K]) =>
        setForm((actual) => ({ ...actual, [campo]: valor }))

    // ─── Unidades ───
    const cambiarUnidad = (index: number, cambios: Partial<UnidadIngredienteProps>) =>
        cambiar('unidades', form.unidades.map((u, i) => (i === index ? { ...u, ...cambios } : u)))
    const agregarUnidad = () => cambiar('unidades', [...form.unidades, { id_unidad: 0, gramos: 0 }])
    const quitarUnidad = (index: number) => cambiar('unidades', form.unidades.filter((_, i) => i !== index))
    /** Para cada fila, las unidades que no se eligieron en otra fila (no se repiten) */
    const opcionesUnidad = (index: number) =>
        dataUnidades.filter((op) => !form.unidades.some((u, i) => i !== index && u.id_unidad === op.value))

    // ─── Alérgenos ───
    const tieneAlergeno = (id_alergeno: number) => form.alergenos.some((a) => a.id_alergeno === id_alergeno)
    const marcarAlergeno = (id_alergeno: number, marcado: boolean) =>
        cambiar('alergenos', marcado
          ? [...form.alergenos, { id_alergeno }]
          : form.alergenos.filter((a) => a.id_alergeno !== id_alergeno))

    const validar = () => {
        const nuevos: typeof errores = {}
        if (!form.nombre.trim()) nuevos.nombre = 'Escribe el nombre'
        if (form.unidades.length === 0) nuevos.unidades = 'Agrega al menos una unidad (ej. Gramo = 1 g)'
        else if (form.unidades.some((u) => !u.id_unidad || Number(u.gramos) <= 0)) nuevos.unidades = 'Cada unidad necesita su tipo y gramos mayores a 0'
        setErrores(nuevos)
        return Object.keys(nuevos).length === 0
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validar()) return
        const guardado = await guardarIngrediente(form)
        if (guardado) onHide()
    }

  return (
    <ModalCR onHide={onHide} show={show} size='lg' position='center'>
        <ModalCR.Header>
            <ModalCR.Title>{esEdicion ? 'Editar ingrediente' : 'Agregar ingrediente'}</ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            <form onSubmit={onSubmit}>
              <Row className="g-2">
                <Col lg={12}>
                  <InputCR label='Nombre' value={form.nombre} required maxLength={150}
                    onChange={(e) => cambiar('nombre', e.target.value)} messageErrors={errores.nombre} />
                </Col>

                <Col lg={12}><h6 className="mx-2 mt-2 mb-0">Nutrición por cada 100 g</h6></Col>
                {CAMPOS_NUTRICION.map(({ campo, label }) => (
                  <Col lg={3} key={campo}>
                    <InputMontoCR label={label} value={Number(form[campo]) || 0} onChange={(valor) => cambiar(campo, valor)} />
                  </Col>
                ))}

                <Col lg={12}>
                  <div className="d-flex align-items-center justify-content-between mx-2 mt-2">
                    <h6 className="m-0">Unidades (cuántos gramos pesa 1 unidad)</h6>
                    <ButtonCR label='Agregar unidad' variant='link' onClick={agregarUnidad} icon={<IconCR name='plus' size={14}/>} />
                  </div>
                  {errores.unidades && <span className="text-danger fw-bold px-2" style={{ fontSize: '11px' }}>{errores.unidades}</span>}
                </Col>
                {form.unidades.map((unidad, index) => (
                  <Col lg={12} key={index}>
                    <Row className="g-2 align-items-center">
                      <Col xs={6}>
                        <InputSelectCR label='Unidad' options={opcionesUnidad(index)} defaultValue={String(unidad.id_unidad)}
                          onChange={(e) => cambiarUnidad(index, { id_unidad: Number(e.target.value) })} />
                      </Col>
                      <Col xs={5}>
                        <InputMontoCR label='Gramos' value={Number(unidad.gramos) || 0}
                          onChange={(gramos) => cambiarUnidad(index, { gramos })} />
                      </Col>
                      <Col xs={1}>
                        <div onClick={() => quitarUnidad(index)} className="cursor-pointer" title="Quitar unidad">
                          <IconCR name="delete" size={14}/>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                ))}

                <Col lg={12}><h6 className="mx-2 mt-2 mb-0">Alérgenos</h6></Col>
                <Col lg={12}>
                  <div className="d-flex flex-wrap gap-3 mx-2">
                    {dataAlergenos.map((alergeno) => (
                      <Form.Check key={alergeno.value} type="checkbox" id={`alergeno-${alergeno.value}`} label={alergeno.label}
                        checked={tieneAlergeno(alergeno.value)}
                        onChange={(e) => marcarAlergeno(alergeno.value, e.target.checked)} />
                    ))}
                  </div>
                </Col>
              </Row>
              <div className="d-flex align-items-center mt-3">
                <ButtonCR label='Guardar' type='submit' />
                <ButtonCR label='Cancelar' variant='link' onClick={onHide} />
              </div>
            </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
