import { useState, useEffect, useRef, useCallback, type ClipboardEvent, type DragEvent, forwardRef } from "react";
import { getFiles, type ZoneData } from "@/helpers/getFiles";


interface ImageZoneProps {
  zone: ZoneData;
  index: number;
  disabled?: boolean;
  onLoad: (id: number, file: File) => void;
  onClear: (id: number) => void;
  onZoneBlur: () => void;
  widthZone: number;
  heightZone: number;
}

function ImageZone({   zone,
  index,
  disabled,
  onLoad,
  onClear,
  onZoneBlur,
  widthZone,
  heightZone, }: ImageZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [hover, setHover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
 
  const filled = !!zone.src;
 
  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) onLoad(zone.id, file);
    },
    [zone.id, onLoad, disabled]
  );
 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onLoad(zone.id, file);
    e.target.value = "";
  };
 
  return (
    <div
      style={{
        width: widthZone,
        height: heightZone,
        border: dragOver
          ? "2px solid #378ADD"
          : filled
          ? "1.5px solid #d3d1c7"
          : "1.5px dashed #b4b2a9",
        background: dragOver
          ? "#E6F1FB"
          : disabled
          ? "#e8e6e0"
          : filled
          ? "transparent"
          : "#f1efe8",
        position: "relative",
        overflow: "hidden",
        cursor: disabled ? "not-allowed" : filled ? "default" : "pointer",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 8,
        transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
        boxShadow: dragOver ? "0 0 0 4px rgba(55,138,221,0.15)" : "none",
        opacity: disabled ? 0.6 : 1,
      }}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => { if (!filled && !disabled) fileInputRef.current?.click(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onBlur={onZoneBlur}
      role={filled || disabled ? undefined : "button"}
      tabIndex={filled || disabled ? undefined : 0}
      aria-label={
        disabled
          ? `Zona ${index + 1}: deshabilitada`
          : filled
          ? `Zona ${index + 1}: ${zone.name}`
          : `Zona ${index + 1}: vacía, clic para cargar`
      }
      onKeyDown={(e) => {
        if (!filled && !disabled && (e.key === "Enter" || e.key === " "))
          fileInputRef.current?.click();
      }}
    >
      {/* Image */}
      {zone.src && (
        <img
          src={zone.src}
          alt={zone.name ?? "imagen"}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}
 
      {/* Overlay con botón eliminar */}
      {filled && !disabled && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hover ? 1 : 0,
            transition: "opacity 0.15s",
            zIndex: 3,
          }}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClear(zone.id); }}
            style={{
              background: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "6px 16px",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              color: "#2c2c2a",
            }}
          >
            Eliminar
          </button>
        </div>
      )}
 
      {/* Placeholder */}
      {!filled && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, pointerEvents: "none" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#b4b2a9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span style={{ fontSize: 12, color: "#888780", textAlign: "center", lineHeight: 1.4, padding: "0 14px" }}>
            {disabled ? "Deshabilitado" : dragOver ? "Suelta aquí" : "Arrastra, pega o haz clic"}
          </span>
        </div>
      )}
 
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        disabled={disabled}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}

let zoneCounter = 0;
function makeZone(initialSrc?: string | null): ZoneData {
  return { id: ++zoneCounter, src: initialSrc ?? null, name: null, file: null };
}
export type formProp={
  name?: string; value: ZoneData
}
type ImageProps  = {
  /** Nombre del campo — compatible con react-hook-form / formularios HTML */
  name?: string;
  /** Callback que recibe el array de Files cada vez que cambia */
  onChange?: (event: formProp) => void;
  /** Se dispara cuando alguna zona pierde el foco */
  onBlur?: (event: { target: { name?: string; value: File[] } }) => void;
  /** Deshabilita todas las interacciones */
  disabled?: boolean;
  widthZone?: number;
  heightZone?: number;
  messageErrors?: string;
  /** URL de una imagen ya existente (p.ej. al editar) para precargar la zona */
  initialSrc?: string | null;
}

export const ImageDropZone=forwardRef<HTMLInputElement, ImageProps>(
  (
    {
      name,
      onChange,
      onBlur,
      disabled = false,
      widthZone = 200,
      heightZone = 200,
      messageErrors = "",
      initialSrc = null,
    },
    ref
  )=> {
    const [zones, setZones] = useState<ZoneData[]>([makeZone(initialSrc)]);
    const [toast, setToast] = useState<string | null>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sincroniza la zona cuando la imagen inicial llega/cambia (p.ej. al abrir el modal de edición), sin usar un efecto
    const [lastInitialSrc, setLastInitialSrc] = useState(initialSrc);
    if (lastInitialSrc !== initialSrc) {
      setLastInitialSrc(initialSrc);
      setZones([makeZone(initialSrc)]);
    }
 
    const showToast = useCallback((msg: string) => {
      setToast(msg);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2200);
    }, []);
 
    const notifyChange = useCallback(
      (updatedZones: ZoneData[]) => {
        console.log({updatedZones, u: getFiles(updatedZones)});
        
        onChange?.({ name, value: updatedZones[0]});
      },
      [onChange, name]
    );
    
    const loadFileToZone = useCallback(
      (zoneId: number, file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setZones((prev) => {
            const updated = prev.map((z) =>
              z.id === zoneId
                ? { ...z, src: e.target?.result as string, file, name: file.name }
                : z
            );
            notifyChange(updated);
            return updated;
          });
          showToast("Imagen cargada");
        };
        reader.readAsDataURL(file);
      },
      [showToast, notifyChange]
    );
 
    const clearZone = useCallback(
      (zoneId: number) => {
        setZones((prev) => {
          const updated = prev.map((z) =>
            z.id === zoneId ? { ...z, src: null, file: null, name: null } : z
          );
          notifyChange(updated);
          return updated;
        });
      },
      [notifyChange]
    );
 
    const handleZoneBlur = useCallback(() => {
      onBlur?.({ target: { name, value: getFiles(zones) } });
    }, [onBlur, name, zones]);
 
    // Listener global de paste (Ctrl+V)
    useEffect(() => {
      if (disabled) return;
 
      const handlePaste = (e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;
 
        let imageFile: File | null = null;
        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            imageFile = item.getAsFile();
            break;
          }
        }
 
        if (!imageFile) { showToast("No hay imagen en el portapapeles"); return; }
 
        const file = imageFile;
        setZones((prev) => {
          const emptyZone = prev.find((z) => !z.src);
          if (!emptyZone) {
            showToast("Todas las zonas están llenas");
            return prev;
          }
          setTimeout(() => loadFileToZone(emptyZone.id, file), 0);
          return prev;
        });
      };
 
      document.addEventListener("paste", handlePaste as unknown as EventListener);
      return () =>
        document.removeEventListener("paste", handlePaste as unknown as EventListener);
    }, [loadFileToZone, showToast, disabled]);
 
    return (
      <div style={{ fontFamily: "system-ui, sans-serif" }}>
        {/* Input oculto representativo para ref externo (react-hook-form) */}
        <input
          ref={ref}
          type="hidden"
          name={name}
          aria-hidden="true"
          style={{ display: "none" }}
        />
 
        {/* Grid de zonas */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
          {zones.map((zone, i) => (
            <ImageZone
              key={zone.id}
              zone={zone}
              index={i}
              disabled={disabled}
              widthZone={widthZone}
              heightZone={heightZone}
              onLoad={loadFileToZone}
              onClear={clearZone}
              onZoneBlur={handleZoneBlur}
            />
          ))}
        </div>
 
        {/* Mensaje de error */}
        {messageErrors.trim().length !== 0 && (
          <p style={{ fontSize: 12, color: "#dc3545", fontWeight: 600, margin: "6px 0 0 2px" }}>
            {messageErrors}
          </p>
        )}
 
        {/* Toast */}
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: 28,
            left: "50%",
            transform: `translateX(-50%) translateY(${toast ? "0" : "60px"})`,
            background: "#2c2c2a",
            color: "#f1efe8",
            fontSize: 13,
            borderRadius: 8,
            padding: "9px 22px",
            opacity: toast ? 1 : 0,
            transition: "opacity 0.2s, transform 0.2s",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 999,
          }}
        >
          {toast ?? ""}
        </div>
      </div>
    );
  }
)