import { Badge, ListGroup } from 'react-bootstrap';
import { Card1 } from '@/components/Cards/Card1/Card1';

/** Clases de los cards de la pantalla (entidades, grupos, subgrupos y valores): alto del contenido (100vh - topbar), el body hace scroll */
export const CLASE_CARD_TERMINOLOGIAS = 'view-h-100';

type Props = {
  titulo: string;
  opciones: string[];
  valorSeleccionado: string | null;
  onSeleccionar: (valor: string | null) => void;
};

/** Columna de seleccion generica: lista clickeable con una opcion "Todas" siempre al inicio. */
export const ColumnaSeleccion = ({ titulo, opciones, valorSeleccionado, onSeleccionar }: Props) => {
  return (
    <Card1 className={CLASE_CARD_TERMINOLOGIAS}>
      {/* Título y, a la derecha, cuántos ítems tiene */}
      <Card1.Header className="d-flex align-items-center justify-content-between">
        {titulo}
        <Badge bg="secondary" pill>{opciones.length}</Badge>
      </Card1.Header>
      <Card1.Body className="p-2">
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
      </Card1.Body>
      {/* <Card1.Footer className="small opacity-75">{opciones.length} {titulo.toLowerCase()}</Card1.Footer> */}
    </Card1>
  );
};
