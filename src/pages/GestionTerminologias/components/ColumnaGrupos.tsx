import { ColumnaSeleccion } from '@/pages/GestionTerminologias/components/ColumnaSeleccion';

type Props = {
  grupos: string[];
  grupoSeleccionado: string | null;
  onSeleccionarGrupo: (grupo: string | null) => void;
};

export const ColumnaGrupos = ({ grupos, grupoSeleccionado, onSeleccionarGrupo }: Props) => {
  return (
    <ColumnaSeleccion
      titulo="Grupos"
      opciones={grupos}
      valorSeleccionado={grupoSeleccionado}
      onSeleccionar={onSeleccionarGrupo}
    />
  );
};
