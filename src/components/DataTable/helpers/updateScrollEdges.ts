import type { Dispatch, MutableRefObject, SetStateAction } from "react";

type Deps = {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  setScrollEdges: Dispatch<SetStateAction<{ atStart: boolean; atEnd: boolean }>>;
};

/** Recalcula si el scroll horizontal está al inicio y/o al final. */
export const createUpdateScrollEdges = ({ containerRef, setScrollEdges }: Deps) => () => {
  const el = containerRef.current;
  if (!el) return;
  const maxScrollLeft = el.scrollWidth - el.clientWidth;
  setScrollEdges({
    atStart: el.scrollLeft <= 1,
    atEnd: el.scrollLeft >= maxScrollLeft - 1,
  });
};
