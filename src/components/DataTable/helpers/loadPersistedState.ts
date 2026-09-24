import type { PersistedState } from "@/components/DataTable/DataTableCR.types";
import { EMPTY_PERSISTED } from "@/components/DataTable/helpers/constants";

export const loadPersistedState = (storageKey: string | null): PersistedState => {
  if (!storageKey || typeof window === "undefined") return EMPTY_PERSISTED;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return EMPTY_PERSISTED;
    const parsed = JSON.parse(raw);
    return {
      colWidths: parsed?.colWidths && typeof parsed.colWidths === "object" ? parsed.colWidths : {},
      frozenIds: Array.isArray(parsed?.frozenIds) ? parsed.frozenIds : [],
      hiddenIds: Array.isArray(parsed?.hiddenIds) ? parsed.hiddenIds : [],
      columnOrder: Array.isArray(parsed?.columnOrder) ? parsed.columnOrder : [],
    };
  } catch {
    // localStorage no disponible (modo privado) o datos corruptos: se ignora
    return EMPTY_PERSISTED;
  }
};
