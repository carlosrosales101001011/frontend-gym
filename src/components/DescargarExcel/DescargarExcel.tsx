import { useState } from 'react'
import Swal from 'sweetalert2'
import { ButtonCR } from '@/components/Button/ButtonCR'
import IconCR from '@/components/Icons/IconCR'
import { mensajeError } from '@/helpers/mensajeError'

/** Columna del Excel: título, ancho, valor de cada fila y si es un monto (se le da formato de moneda) */
export type ColumnaExcel<T> = {
  header: string
  width: number
  valor: (fila: T) => string | number
  esMonto?: boolean
}

type DescargarExcelProps<T> = {
  /** Filas a descargar: lo que se ve en la tabla (con su buscador y orden) */
  filas: T[]
  columnas: ColumnaExcel<T>[]
  /** Nombre de la hoja (máx. 31 caracteres en Excel) */
  hoja: string
  /** Nombre del archivo, sin .xlsx */
  archivo: string
}

/** Botón que descarga en Excel (.xlsx) las filas que se ven en una tabla (reportes de metas y de ventas) */
export function DescargarExcel<T>({ filas, columnas, hoja, archivo }: DescargarExcelProps<T>) {
  const [descargando, setDescargando] = useState(false)

  const descargar = async () => {
    setDescargando(true)
    try {
      // exceljs pesa: se carga solo al descargar
      const { Workbook } = await import('exceljs')
      const libro = new Workbook()
      const hojaExcel = libro.addWorksheet(hoja.slice(0, 31), { views: [{ state: 'frozen', ySplit: 1 }] })
      hojaExcel.columns = columnas.map(({ header, width, esMonto }) => ({ header, width, style: esMonto ? { numFmt: '#,##0.00' } : undefined }))
      hojaExcel.getRow(1).font = { bold: true }
      filas.forEach((fila) => hojaExcel.addRow(columnas.map(({ valor }) => valor(fila))))

      const buffer = await libro.xlsx.writeBuffer()
      const url = URL.createObjectURL(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
      const enlace = document.createElement('a')
      enlace.href = url
      enlace.download = `${archivo}.xlsx`
      enlace.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'No se pudo descargar el Excel', html: mensajeError(e) })
    } finally {
      setDescargando(false)
    }
  }

  return (
    <ButtonCR
      label={descargando ? 'Descargando...' : 'Descargar'}
      variant="outline-primary"
      className="btn-sm text-nowrap"
      icon={<IconCR name="descargar" size={14} className="" />}
      onClick={descargar}
      disabled={descargando || filas.length === 0}
      title={`Descargar en Excel las ${filas.length} filas que se ven en la tabla`}
    />
  )
}
