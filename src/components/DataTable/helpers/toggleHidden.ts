import type { Dispatch, SetStateAction } from "react";

type Deps = {
  hiddenIds: Set<number>;
  columnsLength: number;
  setHiddenIds: Dispatch<SetStateAction<Set<number>>>;
  setFrozenIds: Dispatch<SetStateAction<Set<number>>>;
  setIsCustomized: Dispatch<SetStateAction<boolean>>;
};

/** Oculta o muestra una columna (no permite ocultar la última visible). */
export const createToggleHidden =
  ({ hiddenIds, columnsLength, setHiddenIds, setFrozenIds, setIsCustomized }: Deps) => (id: number) => {
    const isCurrentlyHidden = hiddenIds.has(id);
    if (!isCurrentlyHidden) {
      const visibleCount = columnsLength - hiddenIds.size;
      if (visibleCount <= 1) return; // no permitir ocultar la última columna visible
    }
    setHiddenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    if (!isCurrentlyHidden) {
      // al ocultar una columna, también se descongela
      setFrozenIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
    setIsCustomized(true);
  };
