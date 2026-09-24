import type { Dispatch, MutableRefObject, SetStateAction } from "react";

type Deps = {
  dragIdRef: MutableRefObject<number | null>;
  setDragOverId: Dispatch<SetStateAction<number | null>>;
  setColumnOrder: Dispatch<SetStateAction<number[]>>;
  setIsCustomized: Dispatch<SetStateAction<boolean>>;
};

/** Suelta la columna arrastrada en su nueva posición dentro del orden. */
export const createHandleDrop =
  ({ dragIdRef, setDragOverId, setColumnOrder, setIsCustomized }: Deps) =>
  (e: React.DragEvent<HTMLTableCellElement>, targetId: number) => {
    e.preventDefault();
    const sourceId = dragIdRef.current;
    dragIdRef.current = null;
    setDragOverId(null);
    if (sourceId === null || sourceId === targetId) return;

    setColumnOrder((prev) => {
      const next = [...prev];
      const fromIndex = next.indexOf(sourceId);
      const toIndex = next.indexOf(targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      next.splice(fromIndex, 1);
      next.splice(toIndex, 0, sourceId);
      return next;
    });
    setIsCustomized(true);
  };
