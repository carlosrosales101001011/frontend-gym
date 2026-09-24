import { ColumnaSeleccion } from '@/pages/GestionTerminologias/components/ColumnaSeleccion';

type Props = {
  subgrupos: string[];
  subgrupoSeleccionado: string | null;
  onSeleccionarSubgrupo: (subgrupo: string | null) => void;
};

export const ColumnaSubgrupos = ({ subgrupos, subgrupoSeleccionado, onSeleccionarSubgrupo }: Props) => {
  return (
    <ColumnaSeleccion
      titulo="Subgrupos"
      opciones={subgrupos}
      valorSeleccionado={subgrupoSeleccionado}
      onSeleccionar={onSeleccionarSubgrupo}
    />
  );
};
