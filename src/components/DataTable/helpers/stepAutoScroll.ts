import type { MutableRefObject } from "react";

type Deps = {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  autoScrollDirRef: MutableRefObject<"left" | "right" | null>;
  autoScrollRafRef: MutableRefObject<number | null>;
};

/** Un frame del desplazamiento continuo mientras se mantiene el mouse sobre una flecha. */
export const createStepAutoScroll = ({ containerRef, autoScrollDirRef, autoScrollRafRef }: Deps) => {
  const step = () => {
    const el = containerRef.current;
    if (!el || !autoScrollDirRef.current) return;
    const speed = 7; // px por frame
    el.scrollLeft += autoScrollDirRef.current === "right" ? speed : -speed;
    autoScrollRafRef.current = requestAnimationFrame(step);
  };
  return step;
};
