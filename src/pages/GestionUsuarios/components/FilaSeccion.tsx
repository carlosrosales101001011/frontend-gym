type FilaSeccionProps = {
  label: string
  /** "+" para asignar, "−" para quitar */
  signo: string
  onClick: () => void
}

/** Sección clickeable de los paneles del paso "Módulos" */
export const FilaSeccion = ({ label, signo, onClick }: FilaSeccionProps) => (
  <button type="button" className="btn secciones-usuario__fila" onClick={onClick}>
    <span className="secciones-usuario__signo">{signo}</span>
    <span>{label}</span>
  </button>
)
