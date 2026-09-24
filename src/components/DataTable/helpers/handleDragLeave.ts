import type { Dispatch, SetStateAction } from "react";

type Deps = {
  setDragOverId: Dispatch<SetStateAction<number | null>>;
};

/** Quita el resaltado de la columna cuando el drag la abandona. */
export const createHandleDragLeave = ({ setDragOverId }: Deps) => (id: number) => {
  setDragOverId((prev) => (prev === id ? null : prev));
};
