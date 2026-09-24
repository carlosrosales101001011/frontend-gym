import { ListGroup } from 'react-bootstrap';

type Props = {
  titulo: string;
  opciones: string[];
  valorSeleccionado: string | null;
  onSeleccionar: (valor: string | null) => void;
};

/** Columna de seleccion generica: lista clickeable con una opcion "Todas" siempre al inicio. */
export const ColumnaSeleccion = ({ titulo, opciones, valorSeleccionado, onSeleccionar }: Props) => {
  return (
    <div>
      <h6>{titulo}</h6>
      <ListGroup>
        <ListGroup.Item
          action
          active={valorSeleccionado === null}
          onClick={() => onSeleccionar(null)}
        >
          Todas
        </ListGroup.Item>
        {opciones.map((opcion) => (
          <ListGroup.Item
            key={opcion}
            action
            active={valorSeleccionado === opcion}
            onClick={() => onSeleccionar(opcion)}
          >
            {opcion}
          </ListGroup.Item>
        ))}
        {opciones.length === 0 && (
          <ListGroup.Item disabled>Sin opciones</ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
};
