import type { Dispatch, MutableRefObject, SetStateAction } from "react";

type Deps = {
  measuredIds: MutableRefObject<Set<number>>;
  resizedIdsRef: MutableRefObject<Set<number>>;
  setColWidths: Dispatch<SetStateAction<Record<number, number>>>;
  setFrozenIds: Dispatch<SetStateAction<Set<number>>>;
  setHiddenIds: Dispatch<SetStateAction<Set<number>>>;
  setColumnOrder: Dispatch<SetStateAction<number[]>>;
  columns: { id: number }[];
  setIsCustomized: Dispatch<SetStateAction<boolean>>;
  setResetToken: Dispatch<SetStateAction<number>>;
  storageKey: string | null;
};

/** Limpia anchos, columnas congeladas/ocultas, orden y lo persistido en localStorage. */
export const createResetCustomization = (deps: Deps) => () => {
  const {
    measuredIds,
    resizedIdsRef,
    setColWidths,
    setFrozenIds,
    setHiddenIds,
    setColumnOrder,
    columns,
    setIsCustomized,
    setResetToken,
    storageKey,
  } = deps;

  measuredIds.current.clear();
  resizedIdsRef.current.clear();
  setColWidths({});
  setFrozenIds(new Set());
  setHiddenIds(new Set());
  setColumnOrder(columns.map((c) => c.id));
  setIsCustomized(false);
  setResetToken((t) => t + 1);
  if (storageKey) {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // ignorar
    }
  }
};
