
type BadgeCRProps = {
  label: string
  /** Clases extra (ej. fs-6 para letra más grande) */
  className?: string
} & (
  /** Con onRemove sale la X para quitarlo; sin él es solo informativo */
  | { id: number, onRemove: (id: number) => void }
  | { id?: never, onRemove?: never }
)

/** Badge negro del sistema: informativo, o con X para quitarlo si se pasa onRemove */
export const BadgeCR = ({ label, className = '', id, onRemove }: BadgeCRProps) => {
  return (
    <span className={`badge bg-black text-white section-assignment__badge d-inline-flex align-items-center ${className}`}>
      {label}
      {onRemove && (
        <button
          type="button"
          className="btn-close btn-close-white ms-2 section-assignment__badge-close"
          aria-label={`Quitar ${label}`}
          onClick={() => onRemove(id)}
        />
      )}
    </span>
  );
}
