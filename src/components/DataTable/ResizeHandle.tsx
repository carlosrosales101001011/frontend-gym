import { useState } from "react";
import { ResizeArrowsIcon } from "@/components/DataTable/DataTableIcons";

/**
 * Manija de redimensionado. Usa su propio wrapper posicionado (position:
 * relative en el <th> padre) así funciona sin importar si el <th> es sticky
 * o no. Al pasar el mouse resalta la línea y muestra un ícono de flechas
 * para indicar que se puede arrastrar. `draggable={false}` evita que el
 * drag nativo de reordenamiento de columnas se dispare desde acá.
 */
const ResizeHandle = ({
  onPointerDown,
}: {
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
}) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      onPointerDown={onPointerDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      role="separator"
      aria-orientation="vertical"
      title="Arrastrar para cambiar el ancho de la columna"
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "10px",
        height: "100%",
        cursor: "col-resize",
        touchAction: "none",
        zIndex: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "2px",
          height: hover ? "70%" : "45%",
          backgroundColor: hover ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.4)",
          borderRadius: "1px",
          transition: "all 0.15s ease",
        }}
      />
      {hover && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            backgroundColor: "rgba(0,0,0,0.35)",
            color: "#fff",
            pointerEvents: "none",
          }}
        >
          <ResizeArrowsIcon />
        </div>
      )}
    </div>
  );
};

export default ResizeHandle;
