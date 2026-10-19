import type { ReactNode } from 'react'
import IconCR from '@/components/Icons/IconCR'
import { TabsCR } from '@/components/Tabs/TabsCR'
import { TabCR } from '@/components/Tabs/TabCR'
import { DataTableSimple2, type ColumnaSimple2 } from '@/components/DataTableSimple/DataTableSimple2'
import type { EstadoEvento } from '@/pages/AgendaNutricionista/helpers/agendaHelpers'
import type { ConteoEstado, FilaApilada } from '../helpers/resumenCitas'

/** Título de pestaña con solo un ícono (tooltip y aria-label con el texto); el color lo da TabsCR */
const TituloIcono = ({ icono, texto }: { icono: 'grafica' | 'tabla', texto: string }) => (
  <span className="d-inline-flex" title={texto} aria-label={texto}>
    <IconCR name={icono} size={18} className="" />
  </span>
)

/** Contenido de las cards del reporte de citas: pestañas Gráfica y Tabla con los mismos datos */
export const PanelCitas = ({ grafica, tabla }: { grafica: ReactNode, tabla: ReactNode }) => (
  <TabsCR defaultActiveKey="grafica" variant="pildora">
    <TabCR eventKey="grafica" title={<TituloIcono icono="grafica" texto="Gráfica" />}>
      {grafica}
    </TabCR>
    <TabCR eventKey="tabla" title={<TituloIcono icono="tabla" texto="Tabla" />}>
      {tabla}
    </TabCR>
  </TabsCR>
)

type TablaApiladaProps = {
  filas: FilaApilada[]
  estados: EstadoEvento[]
  /** Título de la primera columna: "Día", "Nutricionista" u "Hora" */
  etiquetaColumna: string
}

/** Tabla de un gráfico apilado: una columna por estado y el total */
export const TablaApilada = ({ filas, estados, etiquetaColumna }: TablaApiladaProps) => {
  const columnas: ColumnaSimple2<FilaApilada>[] = [
    { id: 'nombre', header: etiquetaColumna, render: (fila) => fila.titulo },
    ...estados.map((estado): ColumnaSimple2<FilaApilada> => ({
      id: estado.value,
      header: estado.label,
      render: (fila) => fila.porEstado[estado.value] ?? 0,
      sortValue: (fila) => fila.porEstado[estado.value] ?? 0,
    })),
    { id: 'total', header: 'Total', render: (fila) => <span className="fw-semibold">{fila.total}</span>, sortValue: (fila) => fila.total },
  ]
  // Sin buscador ni "Mostrando": solo la tabla con su paginación
  return <DataTableSimple2 data={filas} columns={columnas} mostrarBuscador={false} mostrarTamanoPagina={false} />
}

/** Tabla de las citas por estado: cantidad y participación del total */
export const TablaEstados = ({ conteos }: { conteos: ConteoEstado[] }) => {
  const columnas: ColumnaSimple2<ConteoEstado>[] = [
    { id: 'estado', header: 'Estado', render: (conteo) => conteo.label, sortValue: (conteo) => conteo.label },
    { id: 'cantidad', header: 'Cantidad', render: (conteo) => conteo.cantidad, sortValue: (conteo) => conteo.cantidad },
    { id: 'participacion', header: 'Participación', render: (conteo) => `${conteo.participacion}%`, sortValue: (conteo) => conteo.participacion },
  ]
  return <DataTableSimple2 data={conteos} columns={columnas} mostrarBuscador={false} mostrarTamanoPagina={false} />
}
