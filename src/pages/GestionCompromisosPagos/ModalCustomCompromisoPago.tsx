import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import ModalCR from "@/components/Modal/ModalCR";
import { useForm } from "@/hook/useForm";
import { InputCR } from "@/components/TextFields/InputCR";
import { InputSelectCR } from "@/components/TextFields/InputSelectCR";
import { InputMontoCR } from "@/components/TextFields/InputMontoCR";
import { ButtonCR } from "@/components/Button/ButtonCR";
import { BuscadorPersona } from "@/components/BuscadorPersona/BuscadorPersona";
import type { ItemResultado } from "@/components/ModalSearching/ModalSearching";
import { useTerminologiaPersona } from "@/hook/usePropiedadesStore";
import { formatDate } from "@/helpers/FormatDate";
import { getFormatMoney } from "@/helpers/getFormatMoney";
import { initialStateCompromisoPago, type CompromisoPagoProps } from "@/pages/GestionCompromisosPagos/store/compromisoPagoSlice";
import { deudaTotal, deudaVenta, nombreVenta, useCompromisoPagoStore, type VentaDeudaProps } from "@/pages/GestionCompromisosPagos/useCompromisoPagoStore";
import { TablaVentasDeuda } from "@/pages/GestionCompromisosPagos/components/TablaVentasDeuda";

const ID_TIPO_CLIENTE = 2

/** Persona ya guardada (id + nombre) en el formato del buscador */
const aPersona = (id: number, nombre?: string | null): ItemResultado | null =>
  id ? { id, nombre: nombre ?? '', dni: '', email_personal: '', telefono: '' } : null

/**
 * Formulario del compromiso de pago: cliente, una de sus ventas con deuda (llena la deuda total), montos,
 * motivo, estado y observación. El colaborador es el usuario logueado (lo pone el backend al crear).
 * Al editar, el cliente y la venta no cambian.
 * Se monta al abrirse (ver App), así el form arranca con los valores correctos.
 */
export const ModalCustomCompromisoPago = ({id, onHide, show}: {id: number, onHide: ()=>void, show: boolean}) => {
    const { compromisosPago, obtenerVentasConDeuda, guardarCompromisoPago } = useCompromisoPagoStore()
    const esEdicion = id !== 0
    // La fila del listado ya trae todo lo que se muestra al editar (nombres y labels incluidos)
    const compromiso = compromisosPago.find((c) => c.id === id) ?? initialStateCompromisoPago.compromisoPago
    const { formState: { errors }, register, handleSubmit, watch, setValue, setError } = useForm<CompromisoPagoProps>({defaultValues: compromiso, mode: 'onChange'})
    const { data: dataMotivos, cargar: cargarMotivos } = useTerminologiaPersona('motivoCompromisoPago')
    const { data: dataEstados, cargar: cargarEstados } = useTerminologiaPersona('estadoCompromisoPago')
    const [cliente, setCliente] = useState(() => aPersona(compromiso.id_cli, compromiso.nombres_apellidos_clientes))
    const [ventas, setVentas] = useState<VentaDeudaProps[]>([])
    const [cargandoVentas, setCargandoVentas] = useState(false)

    useEffect(() => {
        cargarMotivos()
        cargarEstados()
    }, [])

    // Ventas con deuda del cliente elegido (al crear)
    useEffect(() => {
        if (esEdicion || !cliente?.id) return
        const ctrl = new AbortController()
        obtenerVentasConDeuda(cliente.id, ctrl.signal).then((lista) => {
            if (ctrl.signal.aborted) return
            setVentas(lista)
            // Deuda total = la suma de la deuda de todas sus ventas (se puede corregir)
            setValue('monto_total_deuda', deudaTotal(lista))
            setCargandoVentas(false)
        })
        return () => ctrl.abort()
    }, [cliente?.id])

    /** Otro cliente: su venta y deuda se vuelven a elegir */
    const onSelectCliente = (persona: ItemResultado) => {
        setCliente(persona)
        setVentas([])
        setCargandoVentas(true)
        setValue('id_venta', 0)
        setValue('monto_total_deuda', 0)
    }

    const idVenta = Number(watch('id_venta')) || 0
    const montoDeuda = Number(watch('monto_total_deuda')) || 0
    const montoComprometido = Number(watch('monto_comprometido')) || 0
    const montoPagado = Number(watch('monto_pagado')) || 0

    const opcionesVentas = ventas.map((venta) => ({
        value: venta.id,
        label: `${nombreVenta(venta)} · ${formatDate(venta.fecha_venta.slice(0, 10), 'yyyy-mm-dd', 'dd/mm/yyyy')} · Debe ${getFormatMoney(deudaVenta(venta))}`,
    }))
    /** Venta del compromiso (en el seleccionable o en la tabla); la deuda total no cambia: es la de todas sus ventas */
    const elegirVenta = (venta?: VentaDeudaProps) => setValue('id_venta', venta?.id ?? 0)
    const onChangeVenta = (e: React.ChangeEvent<HTMLSelectElement>) =>
        elegirVenta(ventas.find((v) => v.id === Number(e.target.value)))

    const onSubmit = async (data: CompromisoPagoProps) => {
        if (!esEdicion && !Number(data.id_venta)) {
            setError('id_venta', { type: 'validate', message: 'Selecciona una venta con deuda' })
            return
        }
        if (montoComprometido <= 0) {
            setError('monto_comprometido', { type: 'validate', message: 'Debe ser mayor a 0' })
            return
        }
        if (montoComprometido > montoDeuda) {
            setError('monto_comprometido', { type: 'validate', message: 'No puede ser mayor a la deuda total' })
            return
        }
        const guardado = await guardarCompromisoPago({
            ...compromiso,
            id_cli: cliente?.id ?? 0,
            id_venta: Number(data.id_venta),
            id_motivo: Number(data.id_motivo),
            id_estado: Number(data.id_estado),
            monto_total_deuda: montoDeuda,
            monto_comprometido: montoComprometido,
            monto_pagado: montoPagado,
            observacion: data.observacion ?? '',
        })
        if (guardado) onHide()
    }
  return (
    <ModalCR onHide={onHide} show={show} size='lg' position='center'>
        <ModalCR.Header>
            <ModalCR.Title>{esEdicion ? 'Editar compromiso de pago' : 'Agregar compromiso de pago'}</ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row className="g-2">
                <Col lg={6}>
                  {esEdicion
                    ? <InputCR label='Cliente' value={compromiso.nombres_apellidos_clientes ?? ''} disabled readOnly />
                    : <>
                        <BuscadorPersona
                          idTipo={ID_TIPO_CLIENTE}
                          label="Cliente"
                          placeholder="Buscar cliente por nombre, DNI o teléfono"
                          value={cliente}
                          onSelect={onSelectCliente}
                          onChange={register('id_cli', { min: { value: 1, message: 'Selecciona un cliente' } }).onChange}
                          soloNombre
                          required
                        />
                        <span className="text-danger fw-bold px-2" style={{ fontSize: '11px' }}>{errors.id_cli?.message}</span>
                      </>}
                </Col>
                <Col lg={6}>
                  {esEdicion
                    ? <InputCR label='Venta' value={`Venta ${compromiso.id_venta}`} disabled readOnly />
                    : <InputSelectCR
                        key={`${cliente?.id ?? 0}-${ventas.length}-${idVenta}`}
                        label={cliente && !cargandoVentas && !ventas.length ? 'Venta (el cliente no tiene deudas)' : 'Venta con deuda'}
                        name='id_venta'
                        defaultValue={String(idVenta)}
                        options={opcionesVentas}
                        onChange={onChangeVenta}
                        messageErrors={errors.id_venta?.message}
                      />}
                </Col>
                <Col lg={4}>
                  <InputMontoCR label='Deuda total (S/)' value={montoDeuda} onChange={(valor) => setValue('monto_total_deuda', valor)} />
                </Col>
                <Col lg={4}>
                  <InputMontoCR label='Monto comprometido (S/)' value={montoComprometido} onChange={(valor) => setValue('monto_comprometido', valor)} messageErrors={errors.monto_comprometido?.message} />
                </Col>
                <Col lg={4}>
                  <InputMontoCR label='Monto pagado (S/)' value={montoPagado} onChange={(valor) => setValue('monto_pagado', valor)} />
                </Col>
                <Col lg={6}>
                  <InputSelectCR {...register('id_motivo', { min: { value: 1, message: 'Selecciona un motivo' } })}
                    label='Motivo' options={dataMotivos} messageErrors={errors.id_motivo?.message} />
                </Col>
                <Col lg={6}>
                  <InputSelectCR {...register('id_estado', { min: { value: 1, message: 'Selecciona un estado' } })}
                    label='Estado' options={dataEstados} messageErrors={errors.id_estado?.message} />
                </Col>
                {/* Al editar se ve quién lo registró (no cambia) */}
                {esEdicion && (
                  <Col lg={12}>
                    <InputCR label='Colaborador' value={compromiso.nombres_apellidos_empl ?? ''} disabled readOnly />
                  </Col>
                )}
                <Col lg={12}>
                  <InputCR {...register('observacion', {
                      maxLength: { value: 250, message: 'Máximo 250 caracteres' },
                    })} label='Observación' name='observacion' type='text-area' messageErrors={errors.observacion?.message} />
                </Col>
                {/* Ventas con deuda del cliente elegido, debajo de la búsqueda (solo al crear) */}
                {!esEdicion && cliente && (
                  <Col lg={12}>
                    <TablaVentasDeuda ventas={ventas} idVentaElegida={idVenta} onElegir={elegirVenta} cargando={cargandoVentas} />
                  </Col>
                )}
              </Row>
              <div className="d-flex align-items-center mt-2">
                <ButtonCR label='Guardar' type='submit' />
                <ButtonCR label='Cancelar' variant='link' onClick={onHide} />
              </div>
            </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
