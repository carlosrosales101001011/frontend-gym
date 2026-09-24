import type { JSX, ReactNode } from "react";

export type SortState = 0 | 1 | 2;

export type Sort<T> = {
  column: Column<T>;
  state: SortState;
};

export type Column<T> = {
  id: number;
  header: string;
  sortable?: boolean;
  icon?: ReactNode;
  onSort?: (sorts: Sort<T>[]) => void;
  render: (row: T) => JSX.Element;
  /** Si es true, el usuario puede arrastrar el borde derecho del header para redimensionar la columna */
  widthEditable?: boolean;
};

export type DataTableProps<T> = {
  showPagination?: boolean;
  columns: Column<T>[];
  data: T[];
  totalPages: number;
  countTotal: number;
  isUrlPagination?: boolean;
  /** Si es true, habilita el botón de "congelar columnas" cuando hay scroll horizontal */
  congelarColumnas?: boolean;
  /** Permite ocultar/mostrar columnas mediante un selector múltiple (default: true) */
  permitirOcultarColumnas?: boolean;
  /** Permite reordenar columnas arrastrando el encabezado (default: true) */
  permitirReordenarColumnas?: boolean;
  /**
   * Si es true, muestra flechas laterales para desplazar la tabla
   * horizontalmente. Al mantener el mouse sobre una flecha (sin necesidad
   * de hacer click) la tabla se desplaza de forma continua en esa dirección.
   */
  mostrarFlechasScroll?: boolean;
  /**
   * Identificador único para persistir en localStorage los anchos, columnas
   * congeladas, ocultas y su orden (ej: "tabla-usuarios"). Si no se provee,
   * la configuración solo vive en memoria durante la sesión.
   */
  persistKey?: string;
};

export type PersistedState = {
  colWidths: Record<number, number>;
  frozenIds: number[];
  hiddenIds: number[];
  columnOrder: number[];
};
