import React, { useState } from "react";

export type DataTableArrowRow = {
    [key: string]: any;
    children?: DataTableArrowRow[];
};

export type DataTableArrowColumn<T = DataTableArrowRow> = {
    key: string;
    label: string;
    width?: string | number;
    render?: (row: T) => React.ReactNode;
};

interface DataTableArrowCRProps<T extends DataTableArrowRow> {
    columns: DataTableArrowColumn<T>[];
    data: T[];
}

const DataTableArrowCR = <T extends DataTableArrowRow>({
    columns,
    data,
}: DataTableArrowCRProps<T>) => {

    const [expandedRows, setExpandedRows] = useState<Set<string>>(
        new Set()
    );

    const toggleRow = (id: string) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev);

            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }

            return newSet;
        });
    };

    const renderRows = (
        rows: T[],
        level = 0,
        parentId = ""
    ): React.ReactNode[] => {

        return rows.flatMap((row, index) => {

            /**
             * ID utilizado para controlar
             * el estado de expansión.
             */
            const rowId = parentId
                ? `${parentId}-${row.id ?? index}`
                : `${row.id ?? index}`;

            /**
             * Detectamos automáticamente
             * si existen children.
             */
            const hasChildren =
                Array.isArray(row.children) &&
                row.children.length > 0;

            const isExpanded = expandedRows.has(rowId);

            /**
             * Fila principal
             */
            const rowElement = (
                <tr key={rowId}>

                    {columns.map((column, columnIndex) => {

                        const value = row[column.key];

                        return (
                            <td
                                key={column.key}
                                style={{
                                    width: column.width,
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >

                                    {/* Flecha */}
                                    {columnIndex === 0 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (hasChildren) {
                                                    toggleRow(rowId);
                                                }
                                            }}
                                            style={{
                                                width: 24,
                                                height: 24,
                                                border: "none",
                                                background: "transparent",
                                                padding: 0,
                                                marginRight: 5,
                                                cursor: hasChildren
                                                    ? "pointer"
                                                    : "default",
                                                visibility: hasChildren
                                                    ? "visible"
                                                    : "hidden",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    transition:
                                                        "transform 0.2s ease",
                                                    transform: isExpanded
                                                        ? "rotate(90deg)"
                                                        : "rotate(0deg)",
                                                }}
                                            >
                                                ▶
                                            </span>
                                        </button>
                                    )}

                                    {/* Indentación */}
                                    <div
                                        style={{
                                            paddingLeft:
                                                columnIndex === 0
                                                    ? level * 25
                                                    : 0,
                                        }}
                                    >
                                        {column.render
                                            ? column.render(row)
                                            : value}
                                    </div>

                                </div>

                            </td>
                        );
                    })}

                </tr>
            );

            /**
             * Si está expandido,
             * renderizamos recursivamente
             * los children.
             */
            if (hasChildren && isExpanded) {
                return [
                    rowElement,
                    ...renderRows(
                        row.children as T[],
                        level + 1,
                        rowId
                    ),
                ];
            }

            return [rowElement];
        });
    };

    return (
        <div
            style={{
                width: "100%",
                overflowX: "auto",
            }}
        >

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                }}
            >

                <thead>
                    <tr>

                        {columns.map((column) => (
                            <th
                                key={column.key}
                                style={{
                                    width: column.width,
                                    textAlign: "left",
                                    padding: "10px",
                                }}
                            >
                                {column.label}
                            </th>
                        ))}

                    </tr>
                </thead>

                <tbody>
                    {renderRows(data)}
                </tbody>

            </table>

        </div>
    );
};

export default DataTableArrowCR;