import type { MutableRefObject } from "react";

type Deps = {
  autoScrollDirRef: MutableRefObject<"left" | "right" | null>;
  autoScrollRafRef: MutableRefObject<number | null>;
  stepAutoScroll: () => void;
};

/** Empieza el desplazamiento continuo en la dirección indicada. */
export const createStartAutoScroll =
  ({ autoScrollDirRef, autoScrollRafRef, stepAutoScroll }: Deps) => (dir: "left" | "right") => {
    autoScrollDirRef.current = dir;
    if (autoScrollRafRef.current === null) {
      autoScrollRafRef.current = requestAnimationFrame(stepAutoScroll);
    }
  };
