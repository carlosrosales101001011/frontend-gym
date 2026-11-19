import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import ModalCR from "@/components/Modal/ModalCR";
import { InputCR } from "@/components/TextFields/InputCR";
import { InputSelectCR } from "@/components/TextFields/InputSelectCR";
import { InputMontoCR } from "@/components/TextFields/InputMontoCR";
import { ButtonCR } from "@/components/Button/ButtonCR";
import IconCR from "@/components/Icons/IconCR";
import type { IngredienteProps } from "@/pages/GestionIngredientes/store/ingredienteSlice";
import { DIFICULTADES_RECETA, initialStateReceta, type RecetaIngredienteProps, type RecetaProps } from "@/pages/GestionRecetas/store/recetaSlice";
import { calcularNutricion, useRecetaStore } from "@/pages/GestionRecetas/useRecetaStore";

/** El select trabaja con números: la dificultad es su posición + 1 (0 = sin elegir) */
const opcionesDificultad = DIFICULTADES_RECETA.map((d, i) => ({ value: i + 1, label: d }))

const redondear = (n: number) => Math.round(n * 100) / 100

/**
 * Formulario de la receta: título, porciones, dificultad y sus ingredientes (ingrediente, unidad y cantidad).
 * Solo se pueden elegir las unidades registradas en cada ingrediente; los gramos y la nutrición
 * se muestran calculados. Se monta al abrirse (ver App).
 */
export const ModalCustomReceta = ({id, onHide, show}: {id: number, onHide: ()=>void, show: boolean}) => {
    const { obtenerReceta, obtenerOpcionesIngredientes, guardarReceta } = useRecetaStore()
    const esEdicion = id !== 0
    const [form, setForm] = useState<RecetaProps>(initialStateReceta.receta)
    const [opciones, setOpciones] = useState<IngredienteProps[]>([])
    const [cargando, setCargando] = useState(true)
    const [errores, setErrores] = useState<{ titulo?: string, porciones?: string, dificultad?: string, ingredientes?: string }>({})

    // Opciones de ingredientes y, al editar, la receta completa (el listado no trae sus ingredientes)
    useEffect(() => {
        const ctrl = new AbortController()
        Promise.all([
          obtenerOpcionesIngredientes(ctrl.signal),
          esEdicion ? obtenerReceta(id, ctrl.signal) : Promise.resolve(null),
        ]).then(([listaOpciones, receta]) => {
          if (ctrl.signal.aborted) return
          setOpciones(listaOpciones)
          if (receta) setForm(receta)
          setCargando(false)
        })
        return () => ctrl.abort()
    }, [id])

    const ingredientes = form.ingredientes ?? []
    /** Cambia un campo del formulario */
    const cambiar = <K extends keyof RecetaProps>(campo: K, valor: RecetaProps[K]) =>
        setForm((actual) => ({ ...actual, [campo]: valor }))

    // ─── Ingredientes de la receta ───
    const cambiarIngrediente = (index: number, cambios: Partial<RecetaIngredienteProps>) =>
        cambiar('ingredientes', ingredientes.map((item, i) => (i === index ? { ...item, ...cambios } : item)))
    const agregarIngrediente = () => cambiar('ingredientes', [...ingredientes, { id_ingrediente: 0, id_unidad: 0, cantidad: 0 }])
    const quitarIngrediente = (index: number) => cambiar('ingredientes', ingredientes.filter((_, i) => i !== index))
    /** Al cambiar de ingrediente se elige de nuevo la unidad (cada ingrediente tiene las suyas) */
    const elegirIngrediente = (index: number, id_ingrediente: number) => {
        const unidades = opciones.find((o) => o.id === id_ingrediente)?.unidades ?? []
        cambiarIngrediente(index, { id_ingrediente, id_unidad: unidades.length === 1 ? unidades[0].id_unidad : 0 })
    }
    /** Ingredientes que no se eligieron en otra fila (no se repiten) */
    const opcionesIngrediente = (index: number) => opciones
        .filter((o) => !ingredientes.some((item, i) => i !== index && item.id_ingrediente === o.id))
        .map((o) => ({ value: o.id, label: o.nombre }))
    const unidadesDe = (id_ingrediente: number) => (opciones.find((o) => o.id === id_ingrediente)?.unidades ?? [])
        .map((u) => ({ value: u.id_unidad, label: `${u.label_unidad} (${Number(u.gramos)} g)` }))
    const gramosDe = (item: RecetaIngredienteProps) => {
        const unidad = opciones.find((o) => o.id === item.id_ingrediente)?.unidades.find((u) => u.id_unidad === item.id_unidad)
        return unidad ? redondear(Number(item.cantidad) * Number(unidad.gramos)) : 0
    }

    const total = calcularNutricion(ingredientes, opciones)
    const porciones = Math.max(Number(form.porciones) || 1, 1)

    const validar = () => {
        const nuevos: typeof errores = {}
        if (!form.titulo.trim()) nuevos.titulo = 'Escribe el título'
        if (!Number.isInteger(Number(form.porciones)) || Number(form.porciones) < 1) nuevos.porciones = 'Debe ser un entero mayor a 0'
        if (!form.dificultad) nuevos.dificultad = 'Elige la dificultad'
        if (ingredientes.length === 0) nuevos.ingredientes = 'Agrega al menos un ingrediente'
        else if (ingredientes.some((i) => !i.id_ingrediente || !i.id_unidad || Number(i.cantidad) <= 0)) nuevos.ingredientes = 'Cada ingrediente necesita unidad y cantidad mayor a 0'
        setErrores(nuevos)
        return Object.keys(nuevos).length === 0
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validar()) return
        const guardado = await guardarReceta({ ...form, id })
        if (guardado) onHide()
    }

  return (
    <ModalCR onHide={onHide} show={show} size='lg' position='center'>
        <ModalCR.Header>
            <ModalCR.Title>{esEdicion ? 'Editar receta' : 'Agregar receta'}</ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
          {cargando ? <p className="m-2">Cargando...</p> : (
            <form onSubmit={onSubmit}>
              <Row className="g-2">
                <Col lg={6}>
                  <InputCR label='Título' value={form.titulo} required maxLength={150}
                    onChange={(e) => cambiar('titulo', e.target.value)} messageErrors={errores.titulo} />
                </Col>
                <Col lg={3}>
                  <InputMontoCR label='Porciones' decimales={0} required value={Number(form.porciones) || 0}
                    onChange={(valor) => cambiar('porciones', valor)} messageErrors={errores.porciones} />
                </Col>
                <Col lg={3}>
                  <InputSelectCR label='Dificultad' required options={opcionesDificultad}
                    defaultValue={String(DIFICULTADES_RECETA.indexOf(form.dificultad as never) + 1)}
                    onChange={(e) => cambiar('dificultad', DIFICULTADES_RECETA[Number(e.target.value) - 1] ?? '')}
                    messageErrors={errores.dificultad} />
                </Col>
                {esEdicion && (
                  <Col lg={12}>
                    <InputCR label='Slug (se genera del título)' value={form.slug} disabled readOnly />
                  </Col>
                )}

                <Col lg={12}>
                  <div className="d-flex align-items-center justify-content-between mx-2 mt-2">
                    <h6 className="m-0">Ingredientes</h6>
                    <ButtonCR label='Agregar ingrediente' variant='link' onClick={agregarIngrediente} icon={<IconCR name='plus' size={14}/>} />
                  </div>
                  {errores.ingredientes && <span className="text-danger fw-bold px-2" style={{ fontSize: '11px' }}>{errores.ingredientes}</span>}
                  {opciones.length === 0 && <p className="mx-2 text-muted">Primero registra ingredientes en Gestión de ingredientes.</p>}
                </Col>
                {ingredientes.map((item, index) => (
                  <Col lg={12} key={index}>
                    <Row className="g-2 align-items-center">
                      <Col xs={4}>
                        <InputSelectCR label='Ingrediente' options={opcionesIngrediente(index)} defaultValue={String(item.id_ingrediente)}
                          onChange={(e) => elegirIngrediente(index, Number(e.target.value))} />
                      </Col>
                      <Col xs={3}>
                        <InputSelectCR key={item.id_ingrediente} label='Unidad' options={unidadesDe(item.id_ingrediente)} defaultValue={String(item.id_unidad)}
                          onChange={(e) => cambiarIngrediente(index, { id_unidad: Number(e.target.value) })} />
                      </Col>
                      <Col xs={2}>
                        <InputMontoCR label='Cantidad' value={Number(item.cantidad) || 0}
                          onChange={(cantidad) => cambiarIngrediente(index, { cantidad })} />
                      </Col>
                      <Col xs={2}>
                        <InputCR label='Gramos' value={String(gramosDe(item))} disabled readOnly />
                      </Col>
                      <Col xs={1}>
                        <div onClick={() => quitarIngrediente(index)} className="cursor-pointer" title="Quitar ingrediente">
                          <IconCR name="delete" size={14}/>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                ))}

                <Col lg={12}>
                  <div className="mx-2 mt-2">
                    <h6 className="mb-1">Nutrición aproximada</h6>
                    <div>Total: {redondear(total.kcal)} kcal · P {redondear(total.proteinas_g)} g · C {redondear(total.carbohidratos_g)} g · G {redondear(total.grasas_g)} g</div>
                    <div>Por porción: {redondear(total.kcal / porciones)} kcal · P {redondear(total.proteinas_g / porciones)} g · C {redondear(total.carbohidratos_g / porciones)} g · G {redondear(total.grasas_g / porciones)} g</div>
                    {!!form.alergenos?.length && (
                      <div className="text-danger">Alérgenos: {form.alergenos.map((a) => a.label_alergeno).join(', ')}</div>
                    )}
                  </div>
                </Col>
              </Row>
              <div className="d-flex align-items-center mt-3">
                <ButtonCR label='Guardar' type='submit' />
                <ButtonCR label='Cancelar' variant='link' onClick={onHide} />
              </div>
            </form>
          )}
        </ModalCR.Body>
    </ModalCR>
  )
}
