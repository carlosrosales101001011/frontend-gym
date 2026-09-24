
export const BadgeCR = ({label, id, onRemove}: {label: string, id: number, onRemove: (id: number) => void}) => {
  return (
    <span className="badge section-assignment__badge d-inline-flex align-items-center">
      {label}
      <button
        type="button"
        className="btn-close btn-close-white ms-2 section-assignment__badge-close"
        aria-label={`Quitar ${label}`}
        onClick={() => onRemove(id)}
      />
    </span>
  );
}
