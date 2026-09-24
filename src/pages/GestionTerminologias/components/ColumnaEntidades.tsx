import { ColumnaSeleccion } from '@/pages/GestionTerminologias/components/ColumnaSeleccion';

type Props = {
  entidades: string[];
  entidadSeleccionada: string | null;
  onSeleccionarEntidad: (entidad: string | null) => void;
};

export const ColumnaEntidades = ({ entidades, entidadSeleccionada, onSeleccionarEntidad }: Props) => {
  return (
    <ColumnaSeleccion
      titulo="Entidades"
      opciones={entidades}
      valorSeleccionado={entidadSeleccionada}
      onSeleccionar={onSeleccionarEntidad}
    />
  );
};
