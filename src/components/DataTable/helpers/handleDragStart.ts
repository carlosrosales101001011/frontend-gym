import type { MutableRefObject } from "react";

type Deps = {
  dragIdRef: MutableRefObject<number | null>;
};

/** Marca qué columna se empezó a arrastrar para reordenar. */
export const createHandleDragStart =
  ({ dragIdRef }: Deps) => (e: React.DragEvent<HTMLTableCellElement>, id: number) => {
    dragIdRef.current = id;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(id));
  };
