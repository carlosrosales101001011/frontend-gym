import type { Dispatch, MutableRefObject, SetStateAction } from "react";

type Deps = {
  dragIdRef: MutableRefObject<number | null>;
  setDragOverId: Dispatch<SetStateAction<number | null>>;
};

/** Limpia el estado de arrastre al terminar (con o sin drop). */
export const createHandleDragEnd = ({ dragIdRef, setDragOverId }: Deps) => () => {
  dragIdRef.current = null;
  setDragOverId(null);
};
