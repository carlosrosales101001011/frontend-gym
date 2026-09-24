import type { ReactNode } from 'react';
import { Table } from 'react-bootstrap';

export type ColumnaSimple<T> = {
  id: number | string;
  header: ReactNode;
  render: (row: T) => ReactNode;
};

type Props<T> = {
  data: T[];
  columns: ColumnaSimple<T>[];
};

/** Tabla de solo lectura: mismo look del header/celdas de DataTableTest, sin buscador, toolbar ni paginacion. */
export function DataTableSimple<T>({ data, columns }: Props<T>) {
  return (
    <div>
      <Table style={{ marginBottom: 0 }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th 
                      className='thead-actual' key={column.id}>
                <span className="fw-bold">{column.header}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={Math.max(columns.length, 1)} className="text-center py-4 ">
                No hay datos disponibles
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td className='tbody-actual' key={column.id}>{column.render(row)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
