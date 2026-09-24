import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Button, Dropdown, Form, Table } from 'react-bootstrap';
import IconCR from '@/components/Icons/IconCR';
import { InputCR } from '@/components/TextFields/InputCR';

export type ColumnaSimple2<T> = {
  id: number | string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  /** Si se define, la columna se puede ordenar haciendo click en el header */
  sortValue?: (row: T) => number | string;
  /** Si se define, la columna entra en el buscador (y en el selector "Buscar en columnas") */
  searchValue?: (row: T) => string;
};

type Props<T> = {
  data: T[];
  columns: ColumnaSimple2<T>[];
  /** Filas por página inicial (default: 10) */
  defaultPageSize?: number;
};

type SortState = { id: number | string; dir: 'asc' | 'desc' } | null;

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

/** Etiqueta de texto de una columna: usa el header si es string, si no cae al id */
const getColumnLabel = <T,>(column: ColumnaSimple2<T>): ReactNode =>
  typeof column.header === 'string' ? column.header : String(column.id);

/** Números de página a mostrar, con "..." cuando hay muchas páginas */
const getPages = (page: number, totalPages: number): (number | '...')[] => {
  if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
  if (page >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  return [1, '...', page - 1, page, page + 1, '...', totalPages];
};

/**
 * Tabla con buscador, ordenamiento y paginación en el cliente.
 * A diferencia de DataTableTest, todo el estado es local (no usa la URL ni Redux),
 * así que se pueden tener varias en la misma página sin que se pisen.
 */
export function DataTableSimple2<T>({ data, columns, defaultPageSize = 10 }: Props<T>) {
  const [search, setSearch] = useState('');
  const [searchColumns, setSearchColumns] = useState<Set<number | string>>(() => new Set());
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const searchableColumns = useMemo(() => columns.filter((c) => c.searchValue), [columns]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data;
    // Sin columnas seleccionadas = buscar en todas las que tienen searchValue
    const cols = searchColumns.size > 0 ? searchableColumns.filter((c) => searchColumns.has(c.id)) : searchableColumns;
    return data.filter((row) => cols.some((c) => c.searchValue!(row).toLowerCase().includes(term)));
  }, [data, search, searchColumns, searchableColumns]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const column = columns.find((c) => c.id === sort.id);
    if (!column?.sortValue) return filtered;
    const factor = sort.dir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = column.sortValue!(a);
      const vb = column.sortValue!(b);
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * factor;
      return String(va).localeCompare(String(vb)) * factor;
    });
  }, [filtered, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Al cambiar el filtro o la data, volver a la primera página
  useEffect(() => {
    setPage(1);
  }, [search, searchColumns, data]);

  /** Ciclo del orden: asc -> desc -> sin orden */
  const toggleSort = (id: number | string) => {
    setSort((prev) => {
      if (!prev || prev.id !== id) return { id, dir: 'asc' };
      if (prev.dir === 'asc') return { id, dir: 'desc' };
      return null;
    });
  };

  const toggleSearchColumn = (id: number | string) => {
    setSearchColumns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <div className="d-flex gap-2 flex-nowrap justify-content-end mb-2">
        <InputCR
          label="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 220 }}
        />
        {searchableColumns.length > 0 && (
          <Dropdown autoClose="outside">
            <Dropdown.Toggle
              as={Button}
              size="sm"
              variant={searchColumns.size > 0 ? 'primary' : 'outline-secondary'}
              className="d-flex align-items-center gap-1 dropdown-toggle-actual"
              style={{ fontSize: '12px' }}
            >
              <IconCR name="filtro" size={14} />
              {searchColumns.size > 0 ? `Buscar en (${searchColumns.size})` : 'Buscar en columnas'}
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-actual" style={{ minWidth: 230 }}>
              <Dropdown.Header>Seleccionar columnas donde buscar</Dropdown.Header>
              {searchableColumns.map((column) => (
                <div key={column.id} className="px-3 py-1">
                  <Form.Check
                    type="checkbox"
                    label={getColumnLabel(column)}
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
        )}
      </div>

      <Table striped style={{ marginBottom: 0 }}>
        <thead>
          <tr>
            {columns.map((column) => {
              const sortable = !!column.sortValue;
              const dir = sort?.id === column.id ? sort.dir : null;
              return (
                <th
                  className="thead-actual"
                  key={column.id}
                  onClick={sortable ? () => toggleSort(column.id) : undefined}
                  style={{ cursor: sortable ? 'pointer' : undefined, userSelect: sortable ? 'none' : undefined }}
                  title={sortable ? 'Click para ordenar' : undefined}
                >
                  <span className="fw-bold d-inline-flex align-items-center gap-1">
                    {column.header}
                    {sortable && (
                      <IconCR
                        name={dir === 'asc' ? 'arrowUp' : dir === 'desc' ? 'arrowDown' : 'arrowUpDown'}
                        size={13}
                      />
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {pageRows.length === 0 ? (
            <tr>
              <td colSpan={Math.max(columns.length, 1)} className="text-center py-4 ">
                No hay datos disponibles
              </td>
            </tr>
          ) : (
            pageRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td className="tbody-actual" key={column.id}>{column.render(row)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <div className="tfoot-actual">
        <div className="d-flex justify-content-between align-items-center p-2 flex-wrap gap-2">
          <div className="d-flex align-items-center">
            <button
              type="button"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ border: 'none', background: 'transparent' }}
            >
              <IconCR name="arrowLeft" />
            </button>
            {getPages(currentPage, totalPages).map((p, i) =>
              p === '...' ? (
                <span key={`dots-${i}`} style={{ padding: '2px 8px' }}>...</span>
              ) : (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    fontSize: '12px',
                    padding: '2px 8px',
                    background: p === currentPage ? '#e9d5ff' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: p === currentPage ? 'bold' : 'normal',
                  }}
                >
                  {p}
                </button>
              )
            )}
            <button
              type="button"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ border: 'none', background: 'transparent' }}
            >
              <IconCR name="arrowRight" />
            </button>
          </div>
          <div style={{ fontSize: '12px' }}>
            Mostrando{' '}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>{' '}
            de {sorted.length}
          </div>
        </div>
      </div>
    </div>
  );
}
