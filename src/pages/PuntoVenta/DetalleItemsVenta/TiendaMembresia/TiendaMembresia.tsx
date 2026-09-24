import { useEffect, useMemo } from "react"
import classNames from "classnames"
import { Card, Col, Row } from "react-bootstrap"
import { BsCheckCircleFill } from "react-icons/bs"
import { addMonths, format, subDays } from "date-fns"
import { getBlobUrl } from "@/helpers/blobUrl"
import { useVentasStore } from "../../hook/useVentasStore"
import type { PlanProps, ProgramaProps } from "../../store/ventaSlice"
import { ButtonCR } from "@/components/Button/ButtonCR"
import { InputCR } from "@/components/TextFields/InputCR"
import { InputSelectCR } from "@/components/TextFields/InputSelectCR"

type TiendaMembresiaProps = {
  onAgregar?: () => void
}

export const TiendaMembresia = ({ onAgregar }: TiendaMembresiaProps = {}) => {
  const { programas, obtenerProgramas, idProgramaSeleccionado, onSelectPrograma, planes, obtenerPlanProgramas, venta, onSetMembresia, obtenerHorarios, horarios } = useVentasStore()
  const fechaMinima = format(subDays(new Date(), 7), "yyyy-MM-dd")

  const idPlanSeleccionado = venta.detalleventa_membresias.id_plan || null
  const idHorarioSeleccionado = venta.detalleventa_membresias.id_horario || null
  const fechaInicio = venta.detalleventa_membresias.fecha_inicio || format(new Date(), "yyyy-MM-dd")

  const programaSeleccionado = programas.find((programa) => programa.id === idProgramaSeleccionado)
  const planSeleccionado = planes.find((plan) => plan.id === idPlanSeleccionado)

  const fechaFinTexto = useMemo(() => {
    if (!planSeleccionado) return "Seleccionar plan"
    if (!fechaInicio) return ""
    const fecha = addMonths(new Date(`${fechaInicio}T00:00:00`), planSeleccionado.nMeses)
    const partes = new Intl.DateTimeFormat("es-PE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).formatToParts(fecha)
    const obtener = (tipo: Intl.DateTimeFormatPartTypes) => partes.find((parte) => parte.type === tipo)?.value ?? ""
    return `${obtener("weekday")} ${obtener("day")} de ${obtener("month")} del ${obtener("year")}`
  }, [fechaInicio, planSeleccionado])

  // Al cambiar plan o fecha se conserva el horario ya elegido (es del mismo programa)
  const actualizarMembresia = (idPlan: number | null, fecha: string, idHorario = idHorarioSeleccionado) => {
    const plan = planes.find((p) => p.id === idPlan)
    if (!idProgramaSeleccionado || !plan) return
    const fechaFinISO = format(addMonths(new Date(`${fecha}T00:00:00`), plan.nMeses), "yyyy-MM-dd")
    onSetMembresia({
      id_programa: idProgramaSeleccionado,
      id_plan: plan.id,
      id_horario: idHorario ?? 0,
      fecha_inicio: fecha,
      label_programa: programaSeleccionado?.nombre ?? "",
      label_horario: horarios.find((horario) => horario.value === idHorario)?.label ?? "",
      label_nmeses: `${plan.nMeses} ${plan.nMeses === 1 ? "mes" : "meses"}`,
      label_precio: formatoMoneda.format(plan.precioTotal),
      fecha_fin: fechaFinISO,
      montoTotal: plan.precioTotal,
    })
  }

  useEffect(() => {
    obtenerProgramas()
  }, [])
  useEffect(() => {
    if (!idProgramaSeleccionado && programas.length > 0) {
      const primerPrograma = programas.find((programa) => programa.estado)
      if (primerPrograma) {
        onSelectPrograma(primerPrograma.id)
      }
    }
  }, [programas])
  useEffect(() => {
    if (idProgramaSeleccionado) {
      obtenerPlanProgramas(idProgramaSeleccionado)
      obtenerHorarios(idProgramaSeleccionado)
    }
  }, [idProgramaSeleccionado])

  return (
    <div className="h-100 overflow-y-auto overflow-x-hidden">
    <div className="mb-3">
      <label>Programas disponibles</label>
      <Row className="g-3">
        {programas.filter((programa) => programa.estado)
        .map((programa) => (
          <Col key={programa.id} md={4}>
            <ItemPrograma
              programa={programa}
              seleccionado={programa.id === idProgramaSeleccionado}
              onSelect={() => onSelectPrograma(programa.id)}
            />
          </Col>
        ))}
      </Row>
    </div>
    <div className="mb-3">
      <label>Planes del programa <span className="fw-bolder" style={{fontSize: '15px'}}>{programas.find(f=>f.id===idProgramaSeleccionado)?.nombre}</span></label>
        <Row className="g-3">
        {planes.filter((plan) => plan.estado)
        .map((plan) => (
          <Col key={plan.id} md={4}>
            <ItemPlan
              plan={plan}
              seleccionado={plan.id === idPlanSeleccionado}
              onSelect={() => actualizarMembresia(plan.id, fechaInicio)}
            />
          </Col>
        ))}
      </Row>
    </div>
    <div className="mb-3">
        <label>Detalle de la membresia</label>
        <Row className="g-3">
          <Col md={4}>
            <InputCR
              type="date"
              label="Fecha de inicio"
              value={fechaInicio}
              onChange={(e) => actualizarMembresia(idPlanSeleccionado, e.target.value)}
              min={fechaMinima}
              style={{ paddingTop: "5px", paddingBottom: "5px" }}
            />
          </Col>
          <Col md={4}>
            <div className="input-textfield">
              <div>
                <div className="bg-actual">
                  <div className="textfield-filled">
                    <div
                      className="textfield-input input-mode-actual text-capitalize"
                      style={{ paddingTop: "5px", paddingBottom: "5px" }}
                    >
                      {fechaFinTexto}
                    </div>
                    <label
                      className="textfield-label"
                      style={{ top: "-10px", fontSize: "12px", padding: "0 4px", backgroundColor: "inherit" }}
                    >
                      Fecha de fin
                    </label>
                  </div>
                </div>
              </div>
              <span className="text-danger fw-bold px-2 m-0" style={{ fontSize: "11px" }} />
            </div>
          </Col>
          <Col md={4}>
            <div
              className=""
              style={{ paddingTop: "5px", paddingBottom: "5px" }}
            >
              {planSeleccionado ? `${planSeleccionado.nMeses * 4 * 6} Sesiones` : "Seleccionar plan"}
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            {/* El horario se guarda junto al plan en la membresía: primero hay que elegir un plan */}
            {idPlanSeleccionado ? (
              <InputSelectCR
                options={horarios}
                label="Horario"
                defaultValue={String(idHorarioSeleccionado ?? "")}
                onChange={(e) => actualizarMembresia(idPlanSeleccionado, fechaInicio, Number(e.target.value) || null)}
              />
            ) : (
              <div className="small" style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                Selecciona un plan para elegir el horario
              </div>
            )}
          </Col>
        </Row>
    </div>
    <div className="mb-3">
        <ButtonCR label={<span className="mx-5">Agregar membresia</span>} disabled={!idPlanSeleccionado} onClick={onAgregar}/>
    </div>
    </div>
  )
}

type ItemProgramaProps = {
  programa: ProgramaProps
  seleccionado: boolean
  onSelect: () => void
}

export const ItemPrograma = ({ programa, seleccionado, onSelect }: ItemProgramaProps) => {
  const imagen = getBlobUrl(programa.url_avatar)

  return (
    <Card
      className={classNames("h-100 tienda-membresia__item", {
        "tienda-membresia__item--seleccionado": seleccionado,
        "bg-black text-white": !imagen,
      })}
      onClick={onSelect}
    >
      {seleccionado && (
        <BsCheckCircleFill className="tienda-membresia__check" />
      )}
      {imagen && <Card.Img variant="top" src={imagen} alt={programa.nombre} />}
      <Card.Body
        className={classNames({
          "d-flex flex-column align-items-center justify-content-center text-center": !imagen,
        })}
      >
        <Card.Title className={imagen ? "fs-6 fw-bolder" : "fs-2 fw-bolder"}>
          {programa.nombre}
        </Card.Title>
        <Card.Text className="text-truncate">
          {programa.descripcion}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

type ItemPlanProps = {
  plan: PlanProps
  seleccionado: boolean
  onSelect: () => void
}

const formatoMoneda = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
})

export const ItemPlan = ({ plan, seleccionado, onSelect }: ItemPlanProps) => {
  return (
    <Card
      className={`card-mode-actual ${
        classNames("h-100 tienda-membresia__item", {
        "tienda-membresia__item--seleccionado": seleccionado,
      })
      }`}
      onClick={onSelect}
    >
      {seleccionado && (
        <BsCheckCircleFill className="tienda-membresia__check" />
      )}
      <Card.Body className="m-2 p-0 fw-bold">
          {plan.nMeses} {plan.nMeses === 1 ? "mes" : "meses"}
          <br/>
          {formatoMoneda.format(plan.precioTotal)}
          <br/>
          {plan.label_tipo_tarifa}
      </Card.Body>
    </Card>
  )
}

