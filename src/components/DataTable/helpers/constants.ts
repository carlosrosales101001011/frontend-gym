import type { PersistedState } from "@/components/DataTable/DataTableCR.types";

export const MIN_COL_WIDTH = 60;
export const DEFAULT_COL_WIDTH = 120;
export const STORAGE_PREFIX = "dataTableCR";

// Espacio dejado entre el borde inferior de la tabla y el final de la pantalla visible
export const TABLE_BOTTOM_GUTTER = 12;
// Alto mínimo del bloque tabla+paginación, para no colapsar en pantallas muy bajas
export const MIN_TABLE_AREA_HEIGHT = 240;

export const EMPTY_PERSISTED: PersistedState = { colWidths: {}, frozenIds: [], hiddenIds: [], columnOrder: [] };
