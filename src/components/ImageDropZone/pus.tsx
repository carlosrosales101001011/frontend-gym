
        {/* 
            Add zone button 
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
            Toast
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
        */}