import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import { DEFAULT_COL_WIDTH, MIN_COL_WIDTH } from "@/components/DataTable/helpers/constants";

type Deps = {
  colWidths: Record<number, number>;
  thRefs: MutableRefObject<Record<number, HTMLTableCellElement | null>>;
  resizingRef: MutableRefObject<{ colId: number; startX: number; startWidth: number } | null>;
  resizedIdsRef: MutableRefObject<Set<number>>;
  setColWidths: Dispatch<SetStateAction<Record<number, number>>>;
  setIsCustomized: Dispatch<SetStateAction<boolean>>;
};

/** Inicia el arrastre de la manija de redimensionado de una columna. */
export const createHandleResizeStart =
  (deps: Deps) => (e: React.PointerEvent<HTMLDivElement>, colId: number) => {
    const { colWidths, thRefs, resizingRef, resizedIdsRef, setColWidths, setIsCustomized } = deps;

    e.preventDefault();
    e.stopPropagation();

    const startWidth = colWidths[colId] ?? thRefs.current[colId]?.offsetWidth ?? DEFAULT_COL_WIDTH;
    resizingRef.current = { colId, startX: e.clientX, startWidth };

    const onMove = (ev: PointerEvent) => {
      if (!resizingRef.current) return;
      const { colId, startX, startWidth } = resizingRef.current;
      const delta = ev.clientX - startX;
      const newWidth = Math.max(MIN_COL_WIDTH, startWidth + delta);
      resizedIdsRef.current.add(colId);
      setColWidths((prev) => ({ ...prev, [colId]: newWidth }));
      setIsCustomized(true);
    };

    const onUp = () => {
      resizingRef.current = null;
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };
