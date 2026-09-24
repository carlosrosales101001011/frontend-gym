import type { Dispatch, SetStateAction } from "react";

type Deps = {
  setFrozenIds: Dispatch<SetStateAction<Set<number>>>;
  setIsCustomized: Dispatch<SetStateAction<boolean>>;
};

/** Congela o descongela una columna. */
export const createToggleFrozen = ({ setFrozenIds, setIsCustomized }: Deps) => (id: number) => {
  setFrozenIds((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
  setIsCustomized(true);
};
