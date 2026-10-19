import { useState } from 'react'
import Swal from 'sweetalert2'
import { ButtonCR } from '@/components/Button/ButtonCR'
import IconCR from '@/components/Icons/IconCR'
import { formatDate } from '@/helpers/FormatDate'
import { mensajeError } from '@/helpers/mensajeError'
import { diasVencidos, sesionesDisponibles } from '@/helpers/diasMembresia'
import { extensionEnCurso } from './helpers/seguimiento'
import type { SeguimientoMembresiaProps } from './store/seguimientoMembresiaSlice'

type ExportSeguimientoMembresiaProps = {
    /** Filas a descargar: lo que se ve en la tabla (con su buscador y orden) */
    filas: SeguimientoMembresiaProps[]
    /** activo: días por vencer; inactivo: días vencidos */
    tipo: 'activo' | 'inactivo'
}

/** Columnas del Excel: título, ancho y valor de cada fila */
const columnasExcel = (tipo: 'activo' | 'inactivo'): { header: string, width: number, valor: (row: SeguimientoMembresiaProps) => string | number }[] => [
    { header: 'Cliente', width: 34, valor: (row) => row.label_nombres_apellidos_cli ?? '' },
    { header: 'Email', width: 30, valor: (row) => row.email_cli?.trim() ?? '' },
    { header: 'Teléfono', width: 14, valor: (row) => row.telefono_cli?.trim() ?? '' },
    { header: 'Asesor', width: 28, valor: (row) => row.label_nombres_apellidos_empl?.trim() ?? '' },
    // Igual que la tabla: sin programa = "POR DEFINIR"
    { header: 'Programa', width: 28, valor: (row) => row.label_programa?.trim() || 'POR DEFINIR' },
    { header: 'Plan', width: 12, valor: (row) => row.n_plan?.trim() ?? '' },
    tipo === 'activo'
        ? { header: 'Días por vencer', width: 15, valor: (row) => sesionesDisponibles(row.fecha_vencimiento) }
        : { header: 'Días vencidos', width: 14, valor: (row) => -diasVencidos(row.fecha_vencimiento) },
    { header: 'Fecha de vencimiento', width: 20, valor: (row) => formatDate(row.fecha_vencimiento, 'yyyy-mm-dd', 'dd/mm/yyyy') },
    {
        header: 'Extensión en curso', width: 22, valor: (row) => {
            const extension = extensionEnCurso(row)
            return extension ? `${extension.tipo === 'congelamiento' ? 'Congelamiento' : 'Regalo'} ${extension.dia}/${extension.total} días` : ''
        },
    },
]

/** Botón que descarga en Excel (.xlsx) las filas que se ven en una tabla de seguimiento */
export const ExportSeguimientoMembresia = ({ filas, tipo }: ExportSeguimientoMembresiaProps) => {
    const [descargando, setDescargando] = useState(false)

    const descargar = async () => {
        setDescargando(true)
        try {
            // exceljs pesa: se carga solo al descargar
            const { Workbook } = await import('exceljs')
            const titulo = tipo === 'activo' ? 'Clientes activos' : 'Clientes inactivos'
            const columnas = columnasExcel(tipo)
            const libro = new Workbook()
            const hoja = libro.addWorksheet(titulo, { views: [{ state: 'frozen', ySplit: 1 }] })
            hoja.columns = columnas.map(({ header, width }) => ({ header, width }))
            hoja.getRow(1).font = { bold: true }
            filas.forEach((row) => hoja.addRow(columnas.map(({ valor }) => valor(row))))

            const buffer = await libro.xlsx.writeBuffer()
            const url = URL.createObjectURL(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
            const enlace = document.createElement('a')
            enlace.href = url
            enlace.download = `seguimiento-${tipo === 'activo' ? 'activos' : 'inactivos'}-${formatDate(new Date(), 'yyyy-mm-dd', 'yyyy-mm-dd')}.xlsx`
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
