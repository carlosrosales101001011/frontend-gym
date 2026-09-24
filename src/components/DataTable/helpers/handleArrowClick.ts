import type { MutableRefObject } from "react";

type Deps = {
  containerRef: MutableRefObject<HTMLDivElement | null>;
};

/** Desplaza la tabla al hacer click en una de las flechas laterales. */
export const createHandleArrowClick = ({ containerRef }: Deps) => (dir: "left" | "right") => {
  const el = containerRef.current;
  if (!el) return;
  el.scrollBy({ left: dir === "right" ? 220 : -220, behavior: "smooth" });
};
