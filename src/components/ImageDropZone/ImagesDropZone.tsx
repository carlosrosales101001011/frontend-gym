import { useState, useEffect, useRef, useCallback, type ClipboardEvent, type DragEvent } from "react";

interface ZoneData {
  id: number;
  src: string | null;
  name: string | null;
}

interface ImageZoneProps {
  zone: ZoneData;
  index: number;
  onLoad: (id: number, file: File) => void;
  onClear: (id: number) => void;
}

function ImageZone({ zone, index, onLoad, onClear }: ImageZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [hover, setHover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onLoad(zone.id, file);
      }
    },
    [zone.id, onLoad]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onLoad(zone.id, file);
    e.target.value = "";
  };

  const filled = !!zone.src;

  return (
    <div
      style={{
        width: 200,
        height: 200,
        borderRadius: 16,
        border: dragOver
          ? "2px solid #378ADD"
          : filled
          ? "1.5px solid #d3d1c7"
          : "1.5px dashed #b4b2a9",
        background: dragOver
          ? "#E6F1FB"
          : filled
          ? "transparent"
          : "#f1efe8",
        position: "relative",
        overflow: "hidden",
        cursor: filled ? "default" : "pointer",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 8,
        transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
        boxShadow: dragOver ? "0 0 0 4px rgba(55,138,221,0.15)" : "none",
      }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => { if (!filled) fileInputRef.current?.click(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role={filled ? undefined : "button"}
      tabIndex={filled ? undefined : 0}
      aria-label={filled ? `Zona ${index + 1}: ${zone.name}` : `Zona ${index + 1}: vacía, clic para cargar`}
      onKeyDown={(e) => { if (!filled && (e.key === "Enter" || e.key === " ")) fileInputRef.current?.click(); }}
    >
      {/* Zone number badge */}
      <span
        style={{
          position: "absolute",
          top: 8,
          left: 10,
          fontSize: 11,
          fontWeight: 500,
          color: filled ? "rgba(255,255,255,0.7)" : "#888780",
          zIndex: 2,
          pointerEvents: "none",
          textShadow: filled ? "0 1px 3px rgba(0,0,0,0.4)" : "none",
        }}
      >
        {index + 1}
      </span>

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

      {/* Hover overlay for filled zones */}
      {filled && (
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            pointerEvents: "none",
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#b4b2a9"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span
            style={{
              fontSize: 12,
              color: "#888780",
              textAlign: "center",
              lineHeight: 1.4,
              padding: "0 14px",
            }}
          >
            {dragOver ? "Suelta aquí" : "Arrastra, pega o haz clic"}
          </span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}

let zoneCounter = 0;
function makeZone(): ZoneData {
  return { id: ++zoneCounter, src: null, name: null };
}

export default function ImageDropZones() {
  const [zones, setZones] = useState<ZoneData[]>([makeZone(), makeZone(), makeZone()]);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const loadFileToZone = useCallback(
    (zoneId: number, file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setZones((prev) =>
          prev.map((z) =>
            z.id === zoneId
              ? { ...z, src: e.target?.result as string, name: file.name }
              : z
          )
        );
        setZones((prev) => {
          const idx = prev.findIndex((z) => z.id === zoneId);
          showToast(`Imagen cargada en zona ${idx + 1}`);
          return prev;
        });
      };
      reader.readAsDataURL(file);
    },
    [showToast]
  );

  const clearZone = useCallback((zoneId: number) => {
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, src: null, name: null } : z))
    );
  }, []);

  const addZone = () => setZones((prev) => [...prev, makeZone()]);

  // Global paste handler
  useEffect(() => {
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
          showToast("Todas las zonas están llenas — agrega una nueva");
          return prev;
        }
        // trigger load outside setState
        setTimeout(() => loadFileToZone(emptyZone.id, file), 0);
        return prev;
      });
    };

    // Cast needed because global paste event
    document.addEventListener("paste", handlePaste as unknown as EventListener);
    return () => document.removeEventListener("paste", handlePaste as unknown as EventListener);
  }, [loadFileToZone, showToast]);

  return (
    <div style={{ padding: "1.5rem 0", fontFamily: "system-ui, sans-serif" }}>
      {/* Info pills */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {[
          { icon: "⌨️", label: "Ctrl+V para pegar" },
          { icon: "🖱️", label: "Arrastra imagen" },
          { icon: "👆", label: "Clic para seleccionar" },
        ].map(({ icon, label }) => (
          <span
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#f1efe8",
              border: "0.5px solid #d3d1c7",
              borderRadius: 99,
              padding: "4px 12px",
              fontSize: 11,
              color: "#5f5e5a",
            }}
          >
            <span aria-hidden="true">{icon}</span>
            {label}
          </span>
        ))}
      </div>

      {/* Zones grid */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
        {zones.map((zone, i) => (
          <ImageZone
            key={zone.id}
            zone={zone}
            index={i}
            onLoad={loadFileToZone}
            onClear={clearZone}
          />
        ))}

        {/* Add zone button */}
        <button
          onClick={addZone}
          style={{
            width: 200,
            height: 200,
            borderRadius: 16,
            border: "1.5px dashed #b4b2a9",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            color: "#888780",
            fontSize: 13,
            flexShrink: 0,
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#5f5e5a";
            (e.currentTarget as HTMLButtonElement).style.color = "#444441";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#b4b2a9";
            (e.currentTarget as HTMLButtonElement).style.color = "#888780";
          }}
          aria-label="Agregar nueva zona de imagen"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Agregar zona</span>
        </button>
      </div>

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