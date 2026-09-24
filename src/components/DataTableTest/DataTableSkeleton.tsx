import styles from '@/components/DataTableTest/DataTableSkeleton.module.scss'

type DataTableSkeletonProps = {
  /** Cantidad de columnas visibles en la tabla, para generar la misma cantidad de celdas */
  columnsCount: number
  /** Cantidad de filas a simular (normalmente el tamaño de página actual) */
  rows: number
}

// Patrón de anchos para que las barras no se vean todas idénticas
const WIDTH_PATTERN = [90, 65, 80, 55, 75]

export default function DataTableSkeleton({ columnsCount, rows }: DataTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: Math.max(rows, 0) }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: Math.max(columnsCount, 1) }).map((_, colIndex) => (
            <td key={colIndex}>
              <div
                className={styles.skeletonBar}
                style={{ width: `${WIDTH_PATTERN[(rowIndex + colIndex) % WIDTH_PATTERN.length]}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
