export type SegmentoProps = {
  /** Ej. "Brazo derecho" */
  nombre: string
  /** kg */
  masaMagra: number
  /** kg */
  grasa: number
}

/** Dato del cuadro: etiqueta arriba y valor en kg abajo */
const DatoSegmento = ({ etiqueta, kg }: { etiqueta: string, kg: number }) => (
  <div className="flex-fill">
    <div className="small opacity-75 text-nowrap">{etiqueta}</div>
    <div className="fw-bold text-nowrap">{kg.toFixed(1)} kg</div>
  </div>
)

/** Cuadro de un segmento del cuerpo: masa magra y grasa en kg, en una fila */
export const CuadroSegmento = ({ nombre, masaMagra, grasa }: SegmentoProps) => (
  // Rectángulo horizontal: más ancho que alto
  <div className="border rounded overflow-hidden text-center" style={{ width: 160 }}>
    {/* Título en franja negra con texto blanco (bg-black ya pone el texto blanco en app.scss) */}
    <div className="bg-black text-white fw-semibold small px-2 py-1">{nombre}</div>
    <div className="d-flex gap-2 px-2 py-1">
      <DatoSegmento etiqueta="Masa magra" kg={masaMagra} />
      <DatoSegmento etiqueta="Grasa" kg={grasa} />
    </div>
  </div>
)
