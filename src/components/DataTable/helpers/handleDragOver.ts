import type { Dispatch, MutableRefObject, SetStateAction } from "react";

type Deps = {
  dragIdRef: MutableRefObject<number | null>;
  setDragOverId: Dispatch<SetStateAction<number | null>>;
};

/** Resalta la columna sobre la que se está arrastrando otra para reordenar. */
export const createHandleDragOver =
  ({ dragIdRef, setDragOverId }: Deps) => (e: React.DragEvent<HTMLTableCellElement>, id: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragIdRef.current !== null && dragIdRef.current !== id) {
      setDragOverId(id);
    }
  };
