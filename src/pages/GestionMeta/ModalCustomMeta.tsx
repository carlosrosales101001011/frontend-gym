import { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { BsPlusLg } from 'react-icons/bs'
import ModalCR from '@/components/Modal/ModalCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputMontoCR } from '@/components/TextFields/InputMontoCR'
import { useAppDispatch } from '@/stores/Store'
import { onAddAsesor, onRepartirIgual, onSetMontoPrograma, onUpdateMetaCampo } from '@/pages/GestionMeta/store/metaSlice'
import { sumarPorcentajes } from '@/pages/GestionMeta/helpers/repartirMonto'
import { useMetaStore } from '@/pages/GestionMeta/useMetaStore'
import { ItemAsesorMeta } from '@/pages/GestionMeta/components/ItemAsesorMeta'

type Errores = {
  nombre?: string
  fecha_inicio?: string
  fecha_fin?: string
  /** Error por índice de asesor */
  asesores: Record<number, string>
  porcentajes?: string
}

/**
 * Formulario de la meta y su reparto por asesor:
 * - monto de programas = suma de las metas de los asesores.
 * - si se cambia el monto de programas, se reparte en partes iguales entre los asesores.
 * Se monta al abrirse (ver App), así el form arranca con los datos correctos.
 */
export const ModalCustomMeta = ({ id, onHide, show }: { id: number, onHide: () => void, show: boolean }) => {
  const dispatch = useAppDispatch()
  const { meta, cargarMeta, guardarMeta } = useMetaStore()
  const [errores, setErrores] = useState<Errores>({ asesores: {} })
  const [guardando, setGuardando] = useState(false)
  const esEdicion = id !== 0
  const totalPorcentajes = sumarPorcentajes(meta.asesores.map((a) => a.porcentaje))
  const porcentajesCompletos = meta.asesores.length === 0 || totalPorcentajes === 100

  useEffect(() => {
    cargarMeta(id)
  }, [id])

  const validar = (): Errores => {
    const nuevos: Errores = { asesores: {} }
    if (!meta.nombre.trim()) nuevos.nombre = 'Este campo es obligatorio'
    if (!meta.fecha_inicio) nuevos.fecha_inicio = 'Este campo es obligatorio'
    if (!meta.fecha_fin) nuevos.fecha_fin = 'Este campo es obligatorio'
    else if (meta.fecha_inicio && meta.fecha_fin < meta.fecha_inicio) nuevos.fecha_fin = 'No puede ser antes de la fecha de inicio'
    if (!porcentajesCompletos) nuevos.porcentajes = `Los porcentajes deben sumar 100% (ahora ${totalPorcentajes}%)`
    meta.asesores.forEach((asesor, i) => {
      if (!asesor.id_empl) nuevos.asesores[i] = 'Selecciona un asesor'
      else if (meta.asesores.findIndex((a) => a.id_empl === asesor.id_empl) !== i) nuevos.asesores[i] = 'Este asesor ya tiene una meta'
    })
    return nuevos
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nuevos = validar()
    setErrores(nuevos)
    const hayErrores = Boolean(nuevos.nombre || nuevos.fecha_inicio || nuevos.fecha_fin || nuevos.porcentajes) || Object.keys(nuevos.asesores).length > 0
    if (hayErrores) return
    setGuardando(true)
    const guardado = await guardarMeta(meta)
    setGuardando(false)
    if (guardado) onHide()
  }

  return (
    <ModalCR show={show} onHide={onHide} size='lg' position='center'>
      <ModalCR.Header>
        <ModalCR.Title>{esEdicion ? 'Editar meta' : 'Nueva meta'}</ModalCR.Title>
      </ModalCR.Header>
      <ModalCR.Body>
        <form onSubmit={onSubmit}>
          <Row className="g-2">
            <Col lg={12}>
              <InputCR
                label='Nombre'
                value={meta.nombre}
                onChange={(e) => dispatch(onUpdateMetaCampo({ name: 'nombre', value: e.target.value }))}
                messageErrors={errores.nombre}
              />
            </Col>
            <Col lg={4}>
              <InputCR
                type='date'
                label='Fecha de inicio'
                value={meta.fecha_inicio}
                onChange={(e) => dispatch(onUpdateMetaCampo({ name: 'fecha_inicio', value: e.target.value }))}
                messageErrors={errores.fecha_inicio}
              />
            </Col>
            <Col lg={4}>
              <InputCR
                type='date'
                label='Fecha de fin'
                value={meta.fecha_fin}
                min={meta.fecha_inicio || undefined}
                onChange={(e) => dispatch(onUpdateMetaCampo({ name: 'fecha_fin', value: e.target.value }))}
                messageErrors={errores.fecha_fin}
              />
            </Col>
            <Col lg={4}>
              <InputMontoCR
                label='Monto de programas (S/)'
                value={meta.monto_programa}
                onChange={(monto) => dispatch(onSetMontoPrograma(monto))}
              />
              {meta.asesores.length > 0 && (
                <span className="small opacity-75">Se reparte según el % de cada asesor</span>
              )}
            </Col>
          </Row>

          <div className="d-flex flex-wrap align-items-center gap-2 mt-4 mb-2">
            <span className="fw-bold">Metas por asesor ({meta.asesores.length})</span>
            {meta.asesores.length > 0 && (
              <>
                <span className={`small fw-bold ${porcentajesCompletos ? 'text-success' : 'text-danger'}`}>
                  Total: {totalPorcentajes}%{!porcentajesCompletos && ' (debe ser 100%)'}
                </span>
                <ButtonCR label='Repartir en partes iguales' variant='link' className='ms-auto' onClick={() => dispatch(onRepartirIgual())} />
              </>
            )}
          </div>
          {errores.porcentajes && !porcentajesCompletos && (
            <div className="text-danger fw-bold mb-2" style={{ fontSize: '11px' }}>{errores.porcentajes}</div>
          )}
          {meta.asesores.map((asesor, index) => (
            <ItemAsesorMeta key={asesor.id ?? `nuevo-${index}`} index={index} asesor={asesor} messageErrors={errores.asesores[index]} />
          ))}
          <Card
            role="button"
            tabIndex={0}
            className="add-item-card"
            onClick={() => dispatch(onAddAsesor())}
          >
            <div className="d-flex flex-column align-items-center gap-2 py-2">
              <BsPlusLg size={22} />
              <span>Agregar meta por asesor</span>
            </div>
          </Card>

          <div className="d-flex align-items-center mt-3">
            <ButtonCR label={guardando ? 'Guardando...' : 'Guardar'} type='submit' disabled={guardando} />
            <ButtonCR label='Cancelar' variant='link' onClick={onHide} disabled={guardando} />
          </div>
        </form>
      </ModalCR.Body>
    </ModalCR>
  )
}
