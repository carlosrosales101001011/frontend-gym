import { useRef, useState, useEffect, useLayoutEffect, useCallback, useMemo } from "react";
import { Table, Button, Dropdown, Form } from "react-bootstrap";
import Paginacion from "@/components/DataTable/Paginacion";
import ResizeHandle from "@/components/DataTable/ResizeHandle";
import { PinIcon, ColumnsIcon, GripIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/DataTable/DataTableIcons";
import type { Column, DataTableProps, PersistedState } from "@/components/DataTable/DataTableCR.types";
import {
  MIN_COL_WIDTH,
  DEFAULT_COL_WIDTH,
  STORAGE_PREFIX,
  TABLE_BOTTOM_GUTTER,
  MIN_TABLE_AREA_HEIGHT,
} from "@/components/DataTable/helpers/constants";
import { loadPersistedState } from "@/components/DataTable/helpers/loadPersistedState";
import { createResetCustomization } from "@/components/DataTable/helpers/resetCustomization";
import { createHandleResizeStart } from "@/components/DataTable/helpers/handleResizeStart";
import { createToggleFrozen } from "@/components/DataTable/helpers/toggleFrozen";
import { createToggleHidden } from "@/components/DataTable/helpers/toggleHidden";
import { createHandleDragStart } from "@/components/DataTable/helpers/handleDragStart";
import { createHandleDragOver } from "@/components/DataTable/helpers/handleDragOver";
import { createHandleDragLeave } from "@/components/DataTable/helpers/handleDragLeave";
import { createHandleDrop } from "@/components/DataTable/helpers/handleDrop";
import { createHandleDragEnd } from "@/components/DataTable/helpers/handleDragEnd";
import { createUpdateScrollEdges } from "@/components/DataTable/helpers/updateScrollEdges";
import { createStepAutoScroll } from "@/components/DataTable/helpers/stepAutoScroll";
import { createStartAutoScroll } from "@/components/DataTable/helpers/startAutoScroll";
import { createStopAutoScroll } from "@/components/DataTable/helpers/stopAutoScroll";
import { createHandleArrowClick } from "@/components/DataTable/helpers/handleArrowClick";

const DataTableCR = <T,>({
  columns,
  showPagination=true,
  data,
  totalPages,
  countTotal,
  isUrlPagination,
  congelarColumnas = false,
  permitirOcultarColumnas = true,
  permitirReordenarColumnas = true,
  mostrarFlechasScroll = false,
  persistKey,
}: DataTableProps<T>) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const thRefs = useRef<Record<number, HTMLTableCellElement | null>>({});

  /* ---- Alto disponible hasta el final de la pantalla (para toolbar y ---- */
  /* ---- header estáticos y paginación fija al fondo, sin tocar el layout) ---- */
  const [tableAreaHeight, setTableAreaHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const recalcHeight = () => {
      const top = el.getBoundingClientRect().top;
      const available = window.innerHeight - top - TABLE_BOTTOM_GUTTER;
      setTableAreaHeight(Math.max(available, MIN_TABLE_AREA_HEIGHT));
    };

    recalcHeight();
    window.addEventListener("resize", recalcHeight);
    return () => window.removeEventListener("resize", recalcHeight);
  }, [data]);

  const storageKey = persistKey ? `${STORAGE_PREFIX}:${persistKey}` : null;
  const initialPersisted = useRef<PersistedState | null>(null);
  if (initialPersisted.current === null) {
    initialPersisted.current = loadPersistedState(storageKey);
  }

  const [needsVScroll, setNeedsVScroll] = useState(false);
  const [needsHScroll, setNeedsHScroll] = useState(false);

  const [colWidths, setColWidths] = useState<Record<number, number>>(
    () => initialPersisted.current!.colWidths
  );
  const measuredIds = useRef<Set<number>>(
    new Set(Object.keys(initialPersisted.current!.colWidths).map(Number))
  );
  const resizedIdsRef = useRef<Set<number>>(
    new Set(Object.keys(initialPersisted.current!.colWidths).map(Number))
  );

  const [frozenIds, setFrozenIds] = useState<Set<number>>(
    () => new Set(initialPersisted.current!.frozenIds)
  );
  const [hiddenIds, setHiddenIds] = useState<Set<number>>(
    () => new Set(initialPersisted.current!.hiddenIds)
  );
  const [columnOrder, setColumnOrder] = useState<number[]>(() => {
    const persistedOrder = initialPersisted.current!.columnOrder;
    const currentIds = columns.map((c) => c.id);
    if (persistedOrder.length === 0) return currentIds;
    const valid = persistedOrder.filter((id) => currentIds.includes(id));
    const missing = currentIds.filter((id) => !valid.includes(id));
    return [...valid, ...missing];
  });

  const [isCustomized, setIsCustomized] = useState(() => {
    const p = initialPersisted.current!;
    return (
      Object.keys(p.colWidths).length > 0 ||
      p.frozenIds.length > 0 ||
      p.hiddenIds.length > 0 ||
      p.columnOrder.length > 0
    );
  });

  const resizingRef = useRef<{ colId: number; startX: number; startWidth: number } | null>(null);
  const [resetToken, setResetToken] = useState(0);

  const dragIdRef = useRef<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  /* ------------------------- Scroll vertical (alto) ------------------------- */
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && tableRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const tableHeight = tableRef.current.scrollHeight;
        setNeedsVScroll(tableHeight > containerHeight);
      }
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    if (containerRef.current) observer.observe(containerRef.current);
    if (tableRef.current) observer.observe(tableRef.current);

    return () => observer.disconnect();
  }, [data]);

  /* ------------------------ Scroll horizontal (ancho) ------------------------ */
  useEffect(() => {
    const checkHOverflow = () => {
      if (containerRef.current) {
        setNeedsHScroll(containerRef.current.scrollWidth > containerRef.current.clientWidth + 1);
      }
    };

    checkHOverflow();

    const observer = new ResizeObserver(checkHOverflow);
    if (containerRef.current) observer.observe(containerRef.current);
    if (tableRef.current) observer.observe(tableRef.current);
    window.addEventListener("resize", checkHOverflow);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkHOverflow);
    };
  }, [data, colWidths, columns, hiddenIds]);

  // Si ya no hay scroll horizontal, no tiene sentido mantener columnas congeladas
  useEffect(() => {
    if (!needsHScroll && frozenIds.size > 0) setFrozenIds(new Set());
  }, [needsHScroll, frozenIds]);

  // Sincroniza orden / congeladas / ocultas cuando cambia el set de columnas recibido
  useEffect(() => {
    const currentIds = columns.map((c) => c.id);
    const currentIdSet = new Set(currentIds);

    setColumnOrder((prev) => {
      const filtered = prev.filter((id) => currentIdSet.has(id));
      const missing = currentIds.filter((id) => !filtered.includes(id));
      if (missing.length === 0 && filtered.length === prev.length) return prev;
      return [...filtered, ...missing];
    });

    setFrozenIds((prev) => {
      const next = new Set(Array.from(prev).filter((id) => currentIdSet.has(id)));
      return next.size === prev.size ? prev : next;
    });

    setHiddenIds((prev) => {
      const next = new Set(Array.from(prev).filter((id) => currentIdSet.has(id)));
      return next.size === prev.size ? prev : next;
    });
     
  }, [columns]);

  /* ------------------- Medición inicial de anchos de columna ------------------ */
  useLayoutEffect(() => {
    const newWidths: Record<number, number> = {};
    let changed = false;

    columns.forEach((col) => {
      if (measuredIds.current.has(col.id)) return;
      const el = thRefs.current[col.id];
      if (!el) return; // columna oculta todavía: se mide cuando sea visible
      const width = Math.round(el.getBoundingClientRect().width);
      newWidths[col.id] = Math.max(width, MIN_COL_WIDTH);
      measuredIds.current.add(col.id);
      changed = true;
    });

    if (changed) {
      setColWidths((prev) => ({ ...prev, ...newWidths }));
    }

    const currentIds = new Set(columns.map((c) => c.id));
    Array.from(measuredIds.current).forEach((id) => {
      if (!currentIds.has(id)) measuredIds.current.delete(id);
    });
     
  }, [columns, resetToken, hiddenIds]);

  const hasFixedWidths = Object.keys(colWidths).length > 0;

  /* ------------------------------ Persistencia ------------------------------ */
  useEffect(() => {
    if (!storageKey) return;
    try {
      const widthsToPersist: Record<number, number> = {};
      resizedIdsRef.current.forEach((id) => {
        if (colWidths[id] !== undefined) widthsToPersist[id] = colWidths[id];
      });

      const defaultOrder = columns.map((c) => c.id);
      const isOrderCustom = JSON.stringify(columnOrder) !== JSON.stringify(defaultOrder);

      const payload: PersistedState = {
        colWidths: widthsToPersist,
        frozenIds: Array.from(frozenIds),
        hiddenIds: Array.from(hiddenIds),
        columnOrder: isOrderCustom ? columnOrder : [],
      };
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // Storage lleno o no disponible: se ignora silenciosamente
    }
  }, [storageKey, colWidths, frozenIds, hiddenIds, columnOrder, columns]);

  /* --------------------- Funciones (definidas en ./helpers) --------------------- */
  const resetCustomization = useCallback(
    createResetCustomization({
      measuredIds,
      resizedIdsRef,
      setColWidths,
      setFrozenIds,
      setHiddenIds,
      setColumnOrder,
      columns,
      setIsCustomized,
      setResetToken,
      storageKey,
    }),
    [storageKey, columns]
  );

  const handleResizeStart = useCallback(
    createHandleResizeStart({ colWidths, thRefs, resizingRef, resizedIdsRef, setColWidths, setIsCustomized }),
    [colWidths]
  );

  const toggleFrozen = createToggleFrozen({ setFrozenIds, setIsCustomized });

  const toggleHidden = createToggleHidden({
    hiddenIds,
    columnsLength: columns.length,
    setHiddenIds,
    setFrozenIds,
    setIsCustomized,
  });

  const handleDragStart = createHandleDragStart({ dragIdRef });
  const handleDragOver = createHandleDragOver({ dragIdRef, setDragOverId });
  const handleDragLeave = createHandleDragLeave({ setDragOverId });
  const handleDrop = createHandleDrop({ dragIdRef, setDragOverId, setColumnOrder, setIsCustomized });
  const handleDragEnd = createHandleDragEnd({ dragIdRef, setDragOverId });

  /* ------------------------- Flechas laterales de navegación ------------------------- */
  const [scrollEdges, setScrollEdges] = useState({ atStart: true, atEnd: false });

  const updateScrollEdges = useCallback(createUpdateScrollEdges({ containerRef, setScrollEdges }), []);

  useEffect(() => {
    updateScrollEdges();
  }, [updateScrollEdges, data, colWidths, columns, hiddenIds, needsHScroll]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollEdges, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollEdges);
  }, [updateScrollEdges]);

  const autoScrollRafRef = useRef<number | null>(null);
  const autoScrollDirRef = useRef<"left" | "right" | null>(null);

  const stepAutoScroll = useCallback(
    createStepAutoScroll({ containerRef, autoScrollDirRef, autoScrollRafRef }),
    []
  );

  const startAutoScroll = createStartAutoScroll({ autoScrollDirRef, autoScrollRafRef, stepAutoScroll });
  const stopAutoScroll = createStopAutoScroll({ autoScrollDirRef, autoScrollRafRef });

  useEffect(() => stopAutoScroll, []);

  const handleArrowClick = createHandleArrowClick({ containerRef });

  /* ------------------------------ Orden visual ------------------------------ */
  const columnsById = useMemo(() => new Map(columns.map((c) => [c.id, c])), [columns]);

  const orderedColumns = useMemo(
    () => columnOrder.map((id) => columnsById.get(id)).filter((c): c is Column<T> => Boolean(c)),
    [columnOrder, columnsById]
  );

  const visibleOrderedColumns = useMemo(
    () => orderedColumns.filter((c) => !hiddenIds.has(c.id)),
    [orderedColumns, hiddenIds]
  );

  const displayColumns = useMemo(() => {
    const frozen = visibleOrderedColumns.filter((c) => frozenIds.has(c.id));
    const rest = visibleOrderedColumns.filter((c) => !frozenIds.has(c.id));
    return [...frozen, ...rest];
  }, [visibleOrderedColumns, frozenIds]);

  const frozenVisibleCount = useMemo(
    () => visibleOrderedColumns.filter((c) => frozenIds.has(c.id)).length,
    [visibleOrderedColumns, frozenIds]
  );

  const leftOffsets = useMemo(() => {
    const offsets: number[] = [];
    let acc = 0;
    displayColumns.forEach((col) => {
      offsets.push(acc);
      acc += colWidths[col.id] ?? thRefs.current[col.id]?.offsetWidth ?? DEFAULT_COL_WIDTH;
    });
    return offsets;
  }, [displayColumns, colWidths]);

  const canFreeze = congelarColumnas && needsHScroll;
  const showToolbar = canFreeze || permitirOcultarColumnas || (Boolean(storageKey) && isCustomized);

  return (
    <div
      ref={rootRef}
      style={{
        display: "flex",
        flexDirection: "column",
        height: tableAreaHeight !== null ? `${tableAreaHeight}px` : "100%",
        minHeight: 0,
      }}
    >
      {/* Barra de herramientas: congelar / ocultar columnas y restablecer vista */}
      {showToolbar && (
        <div style={{ flexShrink: 0 }} className="d-flex gap-2 mb-2 justify-content-end">
          {canFreeze && (
            <Dropdown autoClose="outside">
              <Dropdown.Toggle
                as={Button}
                id="freeze-columns-toggle"
                size="sm"
                variant={frozenIds.size > 0 ? "primary" : "outline-secondary"}
                className="d-flex align-items-center gap-1"
                style={{ fontSize: "12px" }}
              >
                <PinIcon />
                {frozenIds.size > 0 ? `Congeladas (${frozenIds.size})` : "Congelar columnas"}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: 300, overflowY: "auto", minWidth: 230 }}>
                <Dropdown.Header>Seleccionar columnas a congelar</Dropdown.Header>
                {visibleOrderedColumns.map((col) => (
                  <div key={col.id} className="px-3 py-1">
                    <Form.Check
                      type="checkbox"
                      id={`freeze-check-${col.id}`}
                      label={col.header}
                      checked={frozenIds.has(col.id)}
                      onChange={() => toggleFrozen(col.id)}
                    />
                  </div>
                ))}
                {frozenIds.size > 0 && (
                  <>
                    <Dropdown.Divider />
                    <div className="px-3 pb-1">
                      <Button
                        size="sm"
                        variant="link"
                        className="p-0 text-decoration-none"
                        onClick={() => {
                          setFrozenIds(new Set());
                          setIsCustomized(true);
                        }}
                      >
                        Quitar todas
                      </Button>
                    </div>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          )}

          {permitirOcultarColumnas && (
            <Dropdown autoClose="outside">
              <Dropdown.Toggle
                as={Button}
                id="hide-columns-toggle"
                size="sm"
                variant={hiddenIds.size > 0 ? "primary" : "outline-secondary"}
                className="d-flex align-items-center gap-1"
                style={{ fontSize: "12px" }}
              >
                <ColumnsIcon />
                {hiddenIds.size > 0 ? `Columnas (${hiddenIds.size} ocultas)` : "Columnas"}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: 300, overflowY: "auto", minWidth: 230 }}>
                <Dropdown.Header>Mostrar / ocultar columnas</Dropdown.Header>
                {orderedColumns.map((col) => {
                  const isVisible = !hiddenIds.has(col.id);
                  const isOnlyVisible = isVisible && columns.length - hiddenIds.size <= 1;
                  return (
                    <div key={col.id} className="px-3 py-1">
                      <Form.Check
                        type="checkbox"
                        id={`hide-check-${col.id}`}
                        label={col.header}
                        checked={isVisible}
                        disabled={isOnlyVisible}
                        onChange={() => toggleHidden(col.id)}
                      />
                    </div>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
          )}

          {storageKey && isCustomized && (
            <Button
              size="sm"
              variant="link"
              onClick={resetCustomization}
              className="text-decoration-none"
              style={{ fontSize: "12px", padding: "2px 4px" }}
              title="Restablecer anchos, columnas congeladas/ocultas y orden guardados"
            >
              Restablecer vista
            </Button>
          )}
        </div>
      )}

      {/* Área de tabla: crece y hace scroll solo si el contenido no cabe */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <div
          ref={containerRef}
          style={{
            height: "100%",
            overflowY: needsVScroll ? "auto" : "visible",
            overflowX: "auto",
          }}
        >
        <Table
          ref={tableRef}
          responsive={false}
          bordered
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 0,
            tableLayout: hasFixedWidths ? "fixed" : "auto",
          }}
        >
          {hasFixedWidths && (
            <colgroup>
              {displayColumns.map((col) => (
                <col
                  key={col.id}
                  style={{
                    width: colWidths[col.id] ? `${colWidths[col.id]}px` : undefined,
                    minWidth: MIN_COL_WIDTH,
                  }}
                />
              ))}
            </colgroup>
          )}
          <thead>
            <tr>
              {displayColumns.map((col, index) => {
                const isFrozen = index < frozenVisibleCount;
                const isLastFrozen = isFrozen && index === frozenVisibleCount - 1;
                const isDragOver = dragOverId === col.id;

                return (
                  <th
                    className="bg-primary text-white"
                    key={col.id}
                    ref={(el) => {
                      thRefs.current[col.id] = el;
                    }}
                    draggable={permitirReordenarColumnas}
                    onDragStart={(e) => handleDragStart(e, col.id)}
                    onDragOver={(e) => handleDragOver(e, col.id)}
                    onDragLeave={() => handleDragLeave(col.id)}
                    onDrop={(e) => handleDrop(e, col.id)}
                    onDragEnd={handleDragEnd}
                    style={{
                      fontSize: "13px",
                      fontWeight: "bold",
                      padding: "6px 4px",
                      position: needsVScroll || isFrozen ? "sticky" : "relative",
                      top: 0,
                      left: isFrozen ? leftOffsets[index] : undefined,
                      zIndex: isFrozen ? 3 : needsVScroll ? 2 : 1,
                      backgroundColor: "var(--bs-primary)",
                      boxShadow: [
                        needsVScroll ? "0 1px 0 #dee2e6" : "",
                        isLastFrozen ? "2px 0 4px rgba(0,0,0,0.15)" : "",
                        isDragOver ? "inset 3px 0 0 0 #0d6efd" : "",
                      ]
                        .filter(Boolean)
                        .join(", ") || "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", overflow: "hidden" }}>
                      {permitirReordenarColumnas && (
                        <span
                          style={{ cursor: "grab", opacity: 0.65, flexShrink: 0, display: "flex" }}
                          title="Arrastrar para reordenar la columna"
                        >
                          <GripIcon />
                        </span>
                      )}
                      {isFrozen && (
                        <span style={{ flexShrink: 0, display: "flex" }} title="Columna congelada">
                          <PinIcon />
                        </span>
                      )}
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          paddingRight: col.widthEditable ? "10px" : undefined,
                        }}
                        title={col.header}
                      >
                        {col.header}
                      </span>
                    </div>

                    {col.widthEditable && <ResizeHandle onPointerDown={(e) => handleResizeStart(e, col.id)} />}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data?.map((row, i) => (
              <tr key={i}>
                {displayColumns.map((col, index) => {
                  const isFrozen = index < frozenVisibleCount;
                  const isLastFrozen = isFrozen && index === frozenVisibleCount - 1;

                  return (
                    <td
                      key={col.id}
                      className="p-1 text-black"
                      style={{
                        fontSize: "13px",
                        position: isFrozen ? "sticky" : "static",
                        left: isFrozen ? leftOffsets[index] : undefined,
                        zIndex: isFrozen ? 1 : undefined,
                        backgroundColor: isFrozen ? "#fff" : undefined,
                        boxShadow: isLastFrozen ? "2px 0 4px rgba(0,0,0,0.15)" : undefined,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: hasFixedWidths ? "nowrap" : undefined,
                      }}
                    >
                      {col.render(row)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
        </div>

        {mostrarFlechasScroll && needsHScroll && !scrollEdges.atStart && (
          <button
            type="button"
            aria-label="Desplazar tabla hacia la izquierda"
            title="Mantén el mouse aquí para desplazar (o haz click)"
            onMouseEnter={(e) => {
              startAutoScroll("left");
              e.currentTarget.style.backgroundColor = "rgba(33, 37, 41, 0.65)";
            }}
            onMouseLeave={(e) => {
              stopAutoScroll();
              e.currentTarget.style.backgroundColor = "rgba(33, 37, 41, 0.35)";
            }}
            onClick={() => handleArrowClick("left")}
            style={{
              position: "absolute",
              top: "50%",
              left: "6px",
              transform: "translateY(-50%)",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(33, 37, 41, 0.35)",
              color: "#fff",
              cursor: "pointer",
              zIndex: 20,
              padding: 0,
              transition: "background-color 0.15s ease",
            }}
            onFocus={(e) => (e.currentTarget.style.backgroundColor = "rgba(33, 37, 41, 0.65)")}
            onBlur={(e) => (e.currentTarget.style.backgroundColor = "rgba(33, 37, 41, 0.35)")}
          >
            <ChevronLeftIcon />
          </button>
        )}

        {mostrarFlechasScroll && needsHScroll && !scrollEdges.atEnd && (
          <button
            type="button"
            aria-label="Desplazar tabla hacia la derecha"
            title="Mantén el mouse aquí para desplazar (o haz click)"
            onMouseEnter={(e) => {
              startAutoScroll("right");
              e.currentTarget.style.backgroundColor = "rgba(33, 37, 41, 0.65)";
            }}
            onMouseLeave={(e) => {
              stopAutoScroll();
              e.currentTarget.style.backgroundColor = "rgba(33, 37, 41, 0.35)";
            }}
            onClick={() => handleArrowClick("right")}
            style={{
              position: "absolute",
              top: "50%",
              right: "6px",
              transform: "translateY(-50%)",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(33, 37, 41, 0.35)",
              color: "#fff",
              cursor: "pointer",
              zIndex: 20,
              padding: 0,
              transition: "background-color 0.15s ease",
            }}
            onFocus={(e) => (e.currentTarget.style.backgroundColor = "rgba(33, 37, 41, 0.65)")}
            onBlur={(e) => (e.currentTarget.style.backgroundColor = "rgba(33, 37, 41, 0.35)")}
          >
            <ChevronRightIcon />
          </button>
        )}
      </div>
      {/* Paginación siempre abajo */}
        {
          showPagination && (
            <div style={{ flexShrink: 0 }}>
              <Paginacion
                showItems={data.length}
                totalPages={totalPages}
                total={countTotal}
                isUrlPagination={isUrlPagination}
              />
            </div>
          )
        }
    </div>
  );
};

export default DataTableCR;
