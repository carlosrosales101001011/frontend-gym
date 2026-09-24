import React from "react";
import classNames from "classnames";
import { Button, Dropdown } from "react-bootstrap";
import IconCR, { type IconName } from "@/components/Icons/IconCR";

export interface ProgramCardProps {
  id: number;

  nombre: string;
  descripcion: string;
  categoria?: string;

  imagen: string;
  estado: boolean;

  cantidadPlanes: number;
  cantidadHorarios: number;
  cantidadInstructores: number;

  onClick?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

/** "1 plan" / "3 planes" */
const pluralizar = (cantidad: number, singular: string, plural: string) =>
  `${cantidad} ${cantidad === 1 ? singular : plural}`

const ProgramCard: React.FC<ProgramCardProps> = ({
  id,
  nombre,
  descripcion,
  categoria,
  imagen,
  estado,
  cantidadPlanes,
  cantidadHorarios,
  cantidadInstructores,

  onClick,
  onEdit,
  onDelete,
}) => {
  const estadisticas: { icon: IconName; texto: string }[] = [
    { icon: "reporte", texto: pluralizar(cantidadPlanes, "plan", "planes") },
    { icon: "calendar", texto: pluralizar(cantidadHorarios, "horario", "horarios") },
    { icon: "users", texto: pluralizar(cantidadInstructores, "instructor", "instructores") },
  ];

  // El click de los ítems del menú no debe abrir también el card
  const handleEdit = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onEdit?.(id);
  };
  const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  return (
    <article className="program-card card-mode-actual" onClick={() => onClick?.(id)}>
      {/* Imagen + estado + menú */}
      <div className="program-card__media">
        {imagen
          ? <img src={imagen} alt={nombre} className="program-card__img" />
          : (
            <div className="program-card__img program-card__img--vacia">
              <IconCR name="no-icon" size={36} />
            </div>
          )}

        <span className={classNames("program-card__estado", { "program-card__estado--activo": estado })}>
          <span className="program-card__estado-dot" />
          {estado ? "Activo" : "Inactivo"}
        </span>

        <div className="program-card__menu" onClick={(e) => e.stopPropagation()}>
          <Dropdown align="end">
            <Dropdown.Toggle as={Button} variant="link" className="program-card__menu-btn" aria-label="Opciones">
              <IconCR name="threeDotsVertical" size={16} />
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-actual program-card__menu-lista">
              <Dropdown.Item onClick={handleEdit} className="d-flex align-items-center gap-2">
                <IconCR name="edit" size={14} />
                Editar
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleDelete} className="d-flex align-items-center gap-2 program-card__menu-eliminar">
                <IconCR name="trash" size={14} className="" />
                Eliminar
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Información */}
      <div className="program-card__body">
        {categoria && <span className="program-card__categoria">{categoria}</span>}
        <h4 className="program-card__titulo">{nombre}</h4>
        <p className="program-card__descripcion">{descripcion}</p>

        <div className="program-card__stats">
          {estadisticas.map(({ icon, texto }) => (
            <span key={icon} className="program-card__stat">
              <IconCR name={icon} size={13} />
              {texto}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default ProgramCard;
