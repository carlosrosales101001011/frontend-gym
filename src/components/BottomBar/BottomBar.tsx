import React, { useState, type ReactElement } from "react";
import IconCR from "@/components/Icons/IconCR";

type Item = {
  label: string;
  icon: ReactElement;
};

const items: Item[] = [
  { label: "Inicio", icon: <></> },
  { label: "Buscar", icon: <><IconCR name="search"/></> },
  { label: "Favoritos", icon: <><IconCR name="heart"/></> },
  { label: "Menu", icon: <><IconCR name="barburger"/></> },
];

export const BottomBar = () => {
 const [active, setActive] = useState<number>(0);

  return (
    <nav className="bottom-nav sticky-bottom-0">
      {items.map((item, i) => (
        <button
          key={i}
          className={`bottom-nav__item ${active === i ? "active" : ""}`}
          onClick={() => setActive(i)}
        >
          <span className="icon">{item.icon}</span>
          <span className="label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
