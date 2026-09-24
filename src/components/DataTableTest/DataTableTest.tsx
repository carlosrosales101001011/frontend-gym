import { Children, Fragment, cloneElement, isValidElement, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Button, Col, Dropdown, Form, Row, Table } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import ResizeHandle from '@/components/DataTable/ResizeHandle'
import { GripIcon, PinIcon, ChevronLeftIcon, ChevronRightIcon } from '@/components/DataTable/DataTableIcons'
import Paginacion from '@/components/DataTableTest/Paginacion'
import IconCR from '@/components/Icons/IconCR'
import { useQueryParams } from '@/hook/useQueryParams'
import { querys } from '@/types/parametros'
import { SearchedCR } from '@/components/DataTableTest/SearchedCR'
import DataTableSkeleton from '@/components/DataTableTest/DataTableSkeleton'

/** Escapa caracteres especiales de regex para poder buscar el término literal */
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Etiqueta de texto de una columna: usa el header si es string, si no cae al id */
const getColumnLabel = <T,>(column: Column<T>): string =>
  typeof column.header === 'string' ? column.header : String(column.id)

/**
 * Recorre un ReactNode y resalta en amarillo las coincidencias del término buscado.
 * Solo actúa sobre texto (string/number); los demás nodos se recorren recursivamente
 * para poder resaltar texto anidado dentro de elementos (spans, divs, etc).
 */
const highlightNode = (node: ReactNode, term: string): ReactNode => {
  if (!term) return node

  if (typeof node === 'string' || typeof node === 'number') {
    const text = String(node)
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi')
    const parts = text.split(regex)
    if (parts.length <= 1) return node
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={i} style={{ backgroundColor: '#ffe600', padding: 0 }}>
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  if (Array.isArray(node)) {
    return node.map((child, i) => <Fragment key={i}>{highlightNode(child, term)}</Fragment>)
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    if (!node.props.children) return node
    return cloneElement(node, undefined, Children.map(node.props.children, (child) => highlightNode(child, term)))
  }

  return node
}

const MIN_COL_WIDTH = 60
const DEFAULT_COL_WIDTH = 120
const STORAGE_PREFIX = 'dataTableTest'
const ARROW_SIZE = 30
const ARROW_HOVER_RADIUS = 60
// Espacio dejado entre el borde inferior de la tabla y el final de la pantalla visible
const TABLE_BOTTOM_GUTTER = 12
// Alto mínimo del bloque tabla+paginación, para no colapsar en pantallas muy bajas
const MIN_TABLE_AREA_HEIGHT = 240

export type Column<T> = {
  id: number | string
  header: ReactNode
  render: (row: T) => ReactNode
  /** Si es true, el usuario puede arrastrar el borde derecho del header para redimensionar la columna */
  widthEditable?: boolean
}

export type DataTableTestProps<T> = {
  data: T[]
  columns: Column<T>[]
  /** Si es true, muestra un skeleton en lugar de la data (default: false) */
  loading?: boolean
  /** Permite reordenar columnas arrastrando el encabezado (default: false) */
  permitirReordenarColumnas?: boolean
  /** Permite ocultar/mostrar columnas mediante un selector múltiple (default: false) */
  permitirOcultarColumnas?: boolean
  /** Habilita el botón de "congelar columnas" cuando hay scroll horizontal (default: false) */
  congelarColumnas?: boolean
  /** Muestra flechas laterales para hacer scroll horizontal a la tabla (solo la tabla, no la página) cuando el mouse se acerca a 60px de ellas (default: false) */
  mostrarFlechas?: boolean
  /**
   * Identificador adicional para distinguir varias tablas dentro de la misma
   * página (ej: "detalle-productos"). La ruta actual ya se usa como parte de
   * la clave de localStorage, así que solo hace falta esto si una misma
   * página tiene más de un DataTableTest.
   */
  persistKey?: string
  /** Botones u otros elementos adicionales que se muestran a la izquierda de la tabla, arriba de esta */
  otrosBotones?: ReactNode
  /** Clase CSS adicional para la barra de herramientas que contiene los botones u otros elementos adicionales */
  classNameToolBar?: string
  /** Clase CSS adicional para el encabezado de la tabla */
  classNameTableHeader?: string
  classNameTablePagination?:string
  /** Callback externo invocado en cada cambio del input buscador */
  onSearchChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void
}

type PersistedState = {
  colWidths: Record<string, number>
  columnOrder: (number | string)[]
  hiddenIds: (number | string)[]
  frozenIds: (number | string)[]
}

const EMPTY_PERSISTED: PersistedState = { colWidths: {}, columnOrder: [], hiddenIds: [], frozenIds: [] }

const loadPersistedState = (storageKey: string): PersistedState => {
  if (typeof window === 'undefined') return EMPTY_PERSISTED
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return EMPTY_PERSISTED
    const parsed = JSON.parse(raw)
    return {
      colWidths: parsed?.colWidths && typeof parsed.colWidths === 'object' ? parsed.colWidths : {},
      columnOrder: Array.isArray(parsed?.columnOrder) ? Array.from(new Set(parsed.columnOrder)) : [],
      hiddenIds: Array.isArray(parsed?.hiddenIds) ? parsed.hiddenIds : [],
      frozenIds: Array.isArray(parsed?.frozenIds) ? parsed.frozenIds : [],
    }
  } catch {
    // localStorage no disponible (modo privado) o datos corruptos: se ignora
    return EMPTY_PERSISTED
  }
}

export function DataTableTest<T>({
  data,
  columns,
  loading = false,
  permitirReordenarColumnas = false,
  permitirOcultarColumnas = false,
  congelarColumnas = false,
  mostrarFlechas = false,
  persistKey,
  otrosBotones,
  classNameToolBar,
  classNameTableHeader,
  classNameTablePagination,
  onSearchChange
}: DataTableTestProps<T>) {
  const { pathname } = useLocation()
  const storageKey = `${STORAGE_PREFIX}-${pathname}${persistKey ? `-${persistKey}` : ''}`

  const { get: getQueryParam } = useQueryParams()
  const searchTerm = getQueryParam(querys.search)
  /** Cantidad de filas por página actual (misma fuente que usa Paginacion) */
  const skeletonRows = Number(getQueryParam(querys.show)) || 20

  const initialPersisted = useRef<PersistedState | null>(null)
  if (initialPersisted.current === null) {
    initialPersisted.current = loadPersistedState(storageKey)
  }

  const rootRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollWrapperRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)
  const thRefs = useRef<Record<string, HTMLTableCellElement | null>>({})
  const resizingRef = useRef<{ colId: string; startX: number; startWidth: number } | null>(null)
  const dragIdRef = useRef<number | string | null>(null)
  const autoScrollDirRef = useRef<'left' | 'right' | null>(null)
  const autoScrollRafRef = useRef<number | null>(null)

  /* ---- Alto disponible hasta el final de la pantalla (para que el thead ---- */
  /* ---- pueda quedar realmente fijo en el eje Y dentro de su propio scroll) ---- */
  const [tableAreaHeight, setTableAreaHeight] = useState<number | null>(null)

  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return

    const recalcHeight = () => {
      const top = el.getBoundingClientRect().top
      const available = window.innerHeight - top - TABLE_BOTTOM_GUTTER
      setTableAreaHeight(Math.max(available, MIN_TABLE_AREA_HEIGHT))
    }

    recalcHeight()
    window.addEventListener('resize', recalcHeight)
    return () => window.removeEventListener('resize', recalcHeight)
  }, [data])

  const [colWidths, setColWidths] = useState<Record<string, number>>(() => initialPersisted.current!.colWidths)
  const [columnOrder, setColumnOrder] = useState<(number | string)[]>(() => initialPersisted.current!.columnOrder)
  const [hiddenIds, setHiddenIds] = useState<Set<number | string>>(
    () => new Set(initialPersisted.current!.hiddenIds)
  )
  const [frozenIds, setFrozenIds] = useState<Set<number | string>>(
    () => new Set(initialPersisted.current!.frozenIds)
  )
  const [searchColumns, setSearchColumns] = useState<Set<number | string>>(() => new Set())
  const [dragOverId, setDragOverId] = useState<number | string | null>(null)
  const [needsHScroll, setNeedsHScroll] = useState(false)
  const [needsVScroll, setNeedsVScroll] = useState(false)
  const [scrollEdges, setScrollEdges] = useState({ atStart: true, atEnd: false })
  const [arrowProximity, setArrowProximity] = useState({ left: false, right: false })

  const orderedColumns = useMemo(() => {
    // Columnas únicas por id (si se repite un id, se queda la primera)
    const byId = new Map<number | string, Column<T>>()
    columns.forEach((c) => {
      if (!byId.has(c.id)) byId.set(c.id, c)
    })
    // Recorre el orden guardado sin repetir ids: un columnOrder con ids
    // duplicados (ej: localStorage viejo o corrupto) generaba columnas duplicadas
    const seen = new Set<number | string>()
    const ordered: Column<T>[] = []
    columnOrder.forEach((id) => {
      const col = byId.get(id)
      if (col && !seen.has(id)) {
        seen.add(id)
        ordered.push(col)
      }
    })
    byId.forEach((col, id) => {
      if (!seen.has(id)) ordered.push(col)
    })
    return ordered
  }, [columns, columnOrder])

  const visibleOrderedColumns = useMemo(
    () => orderedColumns.filter((c) => !hiddenIds.has(c.id)),
    [orderedColumns, hiddenIds]
  )

  const displayColumns = useMemo(() => {
    const frozen = visibleOrderedColumns.filter((c) => frozenIds.has(c.id))
    const rest = visibleOrderedColumns.filter((c) => !frozenIds.has(c.id))
    return [...frozen, ...rest]
  }, [visibleOrderedColumns, frozenIds])

  const frozenVisibleCount = useMemo(
    () => visibleOrderedColumns.filter((c) => frozenIds.has(c.id)).length,
    [visibleOrderedColumns, frozenIds]
  )

  const leftOffsets = useMemo(() => {
    const offsets: number[] = []
    let acc = 0
    displayColumns.forEach((col) => {
      offsets.push(acc)
      acc += colWidths[String(col.id)] ?? thRefs.current[String(col.id)]?.offsetWidth ?? DEFAULT_COL_WIDTH
    })
    return offsets
  }, [displayColumns, colWidths])

  const toggleHidden = useCallback(
    (id: number | string) => {
      const isCurrentlyHidden = hiddenIds.has(id)
      if (!isCurrentlyHidden && visibleOrderedColumns.length <= 1) return
      setHiddenIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
      if (!isCurrentlyHidden) {
        setFrozenIds((prev) => {
          if (!prev.has(id)) return prev
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }
    },
    [hiddenIds, visibleOrderedColumns.length]
  )

  const toggleFrozen = useCallback((id: number | string) => {
    setFrozenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleSearchColumn = useCallback((id: number | string) => {
    setSearchColumns((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  /** Array de strings con las columnas seleccionadas para buscar (vacío = todas) */
  const searchColumnsArray = useMemo(
    () => orderedColumns.filter((c) => searchColumns.has(c.id)).map(getColumnLabel),
    [orderedColumns, searchColumns]
  )

  /* ------------------------- Scroll vertical (alto) ------------------------- */
  useEffect(() => {
    const checkVOverflow = () => {
      if (!containerRef.current || !tableRef.current) return
      const containerHeight = containerRef.current.clientHeight
      const tableHeight = tableRef.current.scrollHeight
      setNeedsVScroll(tableHeight > containerHeight)
    }

    checkVOverflow()

    const observer = new ResizeObserver(checkVOverflow)
    if (containerRef.current) observer.observe(containerRef.current)
    if (tableRef.current) observer.observe(tableRef.current)

    return () => observer.disconnect()
  }, [data, tableAreaHeight])

  /* ------------------------ Scroll horizontal (ancho) ------------------------ */
  useEffect(() => {
    const checkHOverflow = () => {
      if (!containerRef.current) return
      const overflow = containerRef.current.scrollWidth > containerRef.current.clientWidth + 1
      setNeedsHScroll(overflow)
      // Si ya no hay scroll horizontal, no tiene sentido mantener columnas congeladas
      if (!overflow) {
        setFrozenIds((prev) => (prev.size > 0 ? new Set() : prev))
      }
    }

    checkHOverflow()

    const observer = new ResizeObserver(checkHOverflow)
    if (containerRef.current) observer.observe(containerRef.current)
    window.addEventListener('resize', checkHOverflow)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', checkHOverflow)
    }
  }, [data, colWidths, displayColumns])

  /* ------------------------ Flechas de scroll horizontal ------------------------ */
  const updateScrollEdges = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const maxScrollLeft = el.scrollWidth - el.clientWidth
    setScrollEdges({
      atStart: el.scrollLeft <= 1,
      atEnd: el.scrollLeft >= maxScrollLeft - 1,
    })
  }, [])

  useEffect(() => {
    updateScrollEdges()
  }, [updateScrollEdges, data, colWidths, displayColumns, needsHScroll])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollEdges, { passive: true })
    return () => el.removeEventListener('scroll', updateScrollEdges)
  }, [updateScrollEdges])

  const stepAutoScrollRef = useRef<() => void>(() => {})
  useEffect(() => {
    stepAutoScrollRef.current = () => {
      const el = containerRef.current
      if (!el || !autoScrollDirRef.current) return
      const speed = 7
      el.scrollLeft += autoScrollDirRef.current === 'right' ? speed : -speed
      autoScrollRafRef.current = requestAnimationFrame(() => stepAutoScrollRef.current())
    }
  })

  const startAutoScroll = useCallback((dir: 'left' | 'right') => {
    autoScrollDirRef.current = dir
    if (autoScrollRafRef.current === null) {
      autoScrollRafRef.current = requestAnimationFrame(() => stepAutoScrollRef.current())
    }
  }, [])

  const stopAutoScroll = useCallback(() => {
    autoScrollDirRef.current = null
    if (autoScrollRafRef.current !== null) {
      cancelAnimationFrame(autoScrollRafRef.current)
      autoScrollRafRef.current = null
    }
  }, [])

  useEffect(() => stopAutoScroll, [stopAutoScroll])

  const handleArrowClick = useCallback((dir: 'left' | 'right') => {
    const el = containerRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'right' ? 220 : -220, behavior: 'smooth' })
  }, [])

  const handleScrollWrapperMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!mostrarFlechas || !needsHScroll) return
      const rect = scrollWrapperRef.current?.getBoundingClientRect()
      if (!rect) return
      const centerY = rect.top + rect.height / 2
      const leftCenterX = rect.left + 6 + ARROW_SIZE / 2
      const rightCenterX = rect.right - 6 - ARROW_SIZE / 2
      const distLeft = Math.hypot(e.clientX - leftCenterX, e.clientY - centerY)
      const distRight = Math.hypot(e.clientX - rightCenterX, e.clientY - centerY)
      setArrowProximity({
        left: distLeft <= ARROW_HOVER_RADIUS,
        right: distRight <= ARROW_HOVER_RADIUS,
      })
    },
    [mostrarFlechas, needsHScroll]
  )

  const handleScrollWrapperMouseLeave = useCallback(() => {
    setArrowProximity({ left: false, right: false })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          colWidths,
          columnOrder: orderedColumns.map((c) => c.id),
          hiddenIds: Array.from(hiddenIds),
          frozenIds: Array.from(frozenIds),
        })
      )
    } catch {
      // localStorage no disponible (modo privado): se ignora
    }
  }, [storageKey, colWidths, orderedColumns, hiddenIds, frozenIds])

  const handleResizeStart = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, colId: number | string) => {
      e.preventDefault()
      e.stopPropagation()

      const key = String(colId)
      const startWidth = colWidths[key] ?? thRefs.current[key]?.offsetWidth ?? DEFAULT_COL_WIDTH
      resizingRef.current = { colId: key, startX: e.clientX, startWidth }

      const onMove = (ev: PointerEvent) => {
        if (!resizingRef.current) return
        const { colId, startX, startWidth } = resizingRef.current
        const newWidth = Math.max(MIN_COL_WIDTH, startWidth + (ev.clientX - startX))
        setColWidths((prev) => ({ ...prev, [colId]: newWidth }))
      }

      const onUp = () => {
        resizingRef.current = null
        document.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerup', onUp)
        document.body.style.userSelect = ''
        document.body.style.cursor = ''
      }

      document.addEventListener('pointermove', onMove)
      document.addEventListener('pointerup', onUp)
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'col-resize'
    },
    [colWidths]
  )

  const handleDragStart = useCallback((e: React.DragEvent<HTMLTableCellElement>, id: number | string) => {
    dragIdRef.current = id
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(id))
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLTableCellElement>, id: number | string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragIdRef.current !== null && dragIdRef.current !== id) {
      setDragOverId(id)
    }
  }, [])

  const handleDragLeave = useCallback((id: number | string) => {
    setDragOverId((prev) => (prev === id ? null : prev))
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLTableCellElement>, targetId: number | string) => {
      e.preventDefault()
      const sourceId = dragIdRef.current
      dragIdRef.current = null
      setDragOverId(null)
      if (sourceId === null || sourceId === targetId) return

      const currentOrder = orderedColumns.map((c) => c.id)
      const fromIndex = currentOrder.indexOf(sourceId)
      const toIndex = currentOrder.indexOf(targetId)
      if (fromIndex === -1 || toIndex === -1) return

      const next = [...currentOrder]
      next.splice(fromIndex, 1)
      next.splice(toIndex, 0, sourceId)
      setColumnOrder(next)
    },
    [orderedColumns]
  )

  const handleDragEnd = useCallback(() => {
    dragIdRef.current = null
    setDragOverId(null)
  }, [])

  const canFreeze = congelarColumnas && needsHScroll

  return (
    <div
      className='p-1 card-actual'
      ref={rootRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: tableAreaHeight !== null ? `${tableAreaHeight}px` : '100%',
        minHeight: 0,
      }}
    >
      <div
        style={{ flexShrink: 0 }}
        className={`d-flex flex-wrap bg-actual align-items-center mb-2 gap-2 ${classNameToolBar || ''}`}
      >
        <div className="d-flex gap-2 align-items-center">
          {otrosBotones}
        </div>
        <div className="d-flex gap-2 flex-nowrap ms-auto">
          <SearchedCR onSearchChange={onSearchChange} columnasBusqueda={searchColumnsArray}/>
          <Dropdown autoClose="outside" className=''>
            <Dropdown.Toggle
              as={Button}
              id="search-columns-toggle"
              size="sm"
              variant={searchColumns.size > 0 ? 'primary' : 'outline-secondary'}
              className="d-flex align-items-center gap-1 dropdown-toggle-actual"
              style={{ fontSize: '12px' }}
            >
              <IconCR name='filtro' size={14}/>
              {searchColumns.size > 0 ? `Buscar en (${searchColumns.size})` : 'Buscar en columnas'}
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-actual" style={{ maxHeight: 300, overflowY: 'auto', minWidth: 230 }}>
              <Dropdown.Header>Seleccionar columnas donde buscar</Dropdown.Header>
              {orderedColumns.map((column) => (
                <div key={column.id} className="px-3 py-1">
                  <Form.Check
                    type="checkbox"
                    id={`search-column-check-${column.id}`}
                    label={column.header}
                    checked={searchColumns.has(column.id)}
                    onChange={() => toggleSearchColumn(column.id)}
                  />
                </div>
              ))}
              {searchColumns.size > 0 && (
                <>
                  <Dropdown.Divider />
                  <div className="px-3 pb-1">
                    <Button
                      size="sm"
                      variant="link"
                      className="p-0 text-decoration-none"
                      onClick={() => setSearchColumns(new Set())}
                    >
                      Buscar en todas
                    </Button>
                  </div>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
          {canFreeze && (
            <Dropdown autoClose="outside">
              <Dropdown.Toggle
                as={Button}
                id="freeze-columns-toggle"
                size="sm"
                variant={frozenIds.size > 0 ? 'primary' : 'outline-secondary'}
                className="d-flex align-items-center gap-1 dropdown-toggle-actual"
                style={{ fontSize: '12px' }}
              >
                <PinIcon />
                {frozenIds.size > 0 ? `Congeladas (${frozenIds.size})` : 'Congelar columnas'}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-actual" style={{ maxHeight: 300, overflowY: 'auto', minWidth: 230 }}>
                <Dropdown.Header>Seleccionar columnas a congelar</Dropdown.Header>
                {visibleOrderedColumns.map((column) => (
                  <div key={column.id} className="px-3 py-1">
                    <Form.Check
                      type="checkbox"
                      id={`freeze-check-${column.id}`}
                      label={column.header}
                      checked={frozenIds.has(column.id)}
                      onChange={() => toggleFrozen(column.id)}
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
                        onClick={() => setFrozenIds(new Set())}
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
                variant={hiddenIds.size > 0 ? 'primary' : 'outline-secondary'}
                className="d-flex align-items-center gap-1 dropdown-toggle-actual"
                style={{ fontSize: '12px' }}
              >
                <IconCR name='eye' size={14}/>
                {hiddenIds.size > 0 ? `Columnas (${hiddenIds.size} ocultas)` : 'Ocultar columnas'}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-actual" style={{ maxHeight: 300, overflowY: 'auto', minWidth: 230 }}>
                <Dropdown.Header>Mostrar / ocultar columnas</Dropdown.Header>
                {orderedColumns.map((column) => {
                  const isVisible = !hiddenIds.has(column.id)
                  const isOnlyVisible = isVisible && visibleOrderedColumns.length <= 1
                  return (
                    <div key={column.id} className="px-3 py-1">
                      <Form.Check
                        type="checkbox"
                        id={`hide-check-${column.id}`}
                        label={column.header}
                        checked={isVisible}
                        disabled={isOnlyVisible}
                        onChange={() => toggleHidden(column.id)}
                      />
                    </div>
                  )
                })}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>
      <div
        ref={scrollWrapperRef}
        style={{ flex: 1, minHeight: 0, position: 'relative' }}
        onMouseMove={mostrarFlechas ? handleScrollWrapperMouseMove : undefined}
        onMouseLeave={mostrarFlechas ? handleScrollWrapperMouseLeave : undefined}
      >
        <div
          ref={containerRef}
          style={{ height: '100%', overflowY: needsVScroll ? 'auto' : 'visible', overflowX: 'auto' }}
        >
          <Table ref={tableRef} style={{ marginBottom: 0 }}>
            <thead className={`${classNameTableHeader}`}>
              <tr >
                {displayColumns.map((column, index) => {
                  const key = String(column.id)
                  const isDragOver = dragOverId === column.id
                  const isFrozen = index < frozenVisibleCount
                  const isLastFrozen = isFrozen && index === frozenVisibleCount - 1

                  return (
                    <th
                      key={column.id}
                      ref={(el) => {
                        thRefs.current[key] = el
                      }}
                      className='thead-actual'
                      draggable={permitirReordenarColumnas}
                      onDragStart={permitirReordenarColumnas ? (e) => handleDragStart(e, column.id) : undefined}
                      onDragOver={permitirReordenarColumnas ? (e) => handleDragOver(e, column.id) : undefined}
                      onDragLeave={permitirReordenarColumnas ? () => handleDragLeave(column.id) : undefined}
                      onDrop={permitirReordenarColumnas ? (e) => handleDrop(e, column.id) : undefined}
                      onDragEnd={permitirReordenarColumnas ? handleDragEnd : undefined}
                      style={{
                        position: needsVScroll || isFrozen ? 'sticky' : 'relative',
                        top: 0,
                        left: isFrozen ? leftOffsets[index] : undefined,
                        zIndex: isFrozen ? 3 : needsVScroll ? 2 : 1,
                        backgroundColor: needsVScroll || isFrozen ? 'var(--bs-table-bg, #fff)' : undefined,
                        width: colWidths[key] ? `${colWidths[key]}px` : undefined,
                        minWidth: MIN_COL_WIDTH,
                        boxShadow: [
                          isLastFrozen ? '2px 0 4px rgba(0,0,0,0.15)' : '',
                          isDragOver ? 'inset 3px 0 0 0 #0d6efd' : '',
                        ]
                          .filter(Boolean)
                          .join(', ') || undefined,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden' }}>
                        {permitirReordenarColumnas && (
                          <span
                            style={{ cursor: 'grab', opacity: 0.65, flexShrink: 0, display: 'flex' }}
                            title="Arrastrar para reordenar la columna"
                          >
                            <GripIcon />
                          </span>
                        )}
                        {isFrozen && (
                          <span style={{ flexShrink: 0, display: 'flex' }} title="Columna congelada">
                            <PinIcon />
                          </span>
                        )}
                        <span className='fw-bold' style={{ paddingRight: column.widthEditable ? '10px' : undefined }}>{column.header}</span>
                      </div>

                      {column.widthEditable && <ResizeHandle onPointerDown={(e) => handleResizeStart(e, column.id)} />}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody >
              {loading ? (
                <DataTableSkeleton columnsCount={displayColumns.length} rows={skeletonRows} />
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={Math.max(displayColumns.length, 1)} className="text-center text-muted py-4">
                    No hay datos disponibles
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {displayColumns.map((column, index) => {
                      const isFrozen = index < frozenVisibleCount
                      const isLastFrozen = isFrozen && index === frozenVisibleCount - 1

                      return (
                        <td
                          key={column.id}
                          className='tbody-actual'
                          style={{
                            position: isFrozen ? 'sticky' : 'static',
                            left: isFrozen ? leftOffsets[index] : undefined,
                            zIndex: isFrozen ? 1 : undefined,
                            backgroundColor: isFrozen ? '#fff' : undefined,
                            boxShadow: isLastFrozen ? '2px 0 4px rgba(0,0,0,0.15)' : undefined,
                          }}
                        >
                          {highlightNode(column.render(row), searchTerm)}
                        </td>
                      )
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {mostrarFlechas && needsHScroll && !scrollEdges.atStart && (
          <button
            type="button"
            aria-label="Desplazar tabla hacia la izquierda"
            title="Mantén el mouse aquí para desplazar (o haz click)"
            onMouseEnter={() => startAutoScroll('left')}
            onMouseLeave={stopAutoScroll}
            onFocus={() => startAutoScroll('left')}
            onBlur={stopAutoScroll}
            onClick={() => handleArrowClick('left')}
            style={{
              position: 'absolute',
              top: '50%',
              left: '6px',
              transform: 'translateY(-50%)',
              width: `${ARROW_SIZE}px`,
              height: `${ARROW_SIZE}px`,
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(33, 37, 41, 0.65)',
              color: '#fff',
              cursor: 'pointer',
              zIndex: 20,
              padding: 0,
              opacity: arrowProximity.left ? 1 : 0,
              pointerEvents: arrowProximity.left ? 'auto' : 'none',
              transition: 'opacity 0.15s ease',
            }}
          >
            <ChevronLeftIcon />
          </button>
        )}

        {mostrarFlechas && needsHScroll && !scrollEdges.atEnd && (
          <button
            type="button"
            aria-label="Desplazar tabla hacia la derecha"
            title="Mantén el mouse aquí para desplazar (o haz click)"
            onMouseEnter={() => startAutoScroll('right')}
            onMouseLeave={stopAutoScroll}
            onFocus={() => startAutoScroll('right')}
            onBlur={stopAutoScroll}
            onClick={() => handleArrowClick('right')}
            style={{
              position: 'absolute',
              top: '50%',
              right: '6px',
              transform: 'translateY(-50%)',
              width: `${ARROW_SIZE}px`,
              height: `${ARROW_SIZE}px`,
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(33, 37, 41, 0.65)',
              color: '#fff',
              cursor: 'pointer',
              zIndex: 20,
              padding: 0,
              opacity: arrowProximity.right ? 1 : 0,
              pointerEvents: arrowProximity.right ? 'auto' : 'none',
              transition: 'opacity 0.15s ease',
            }}
          >
            <ChevronRightIcon />
          </button>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>
        <Paginacion classNameTablePagination={classNameTablePagination}/>
      </div>
    </div>
  )
}
