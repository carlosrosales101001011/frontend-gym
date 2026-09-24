import type { MutableRefObject } from "react";

type Deps = {
  autoScrollDirRef: MutableRefObject<"left" | "right" | null>;
  autoScrollRafRef: MutableRefObject<number | null>;
};

/** Detiene el desplazamiento continuo iniciado por startAutoScroll. */
export const createStopAutoScroll = ({ autoScrollDirRef, autoScrollRafRef }: Deps) => () => {
  autoScrollDirRef.current = null;
  if (autoScrollRafRef.current !== null) {
    cancelAnimationFrame(autoScrollRafRef.current);
    autoScrollRafRef.current = null;
  }
};
