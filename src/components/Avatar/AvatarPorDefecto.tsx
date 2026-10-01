type AvatarPorDefectoProps = {
  /** Ancho y alto en px */
  tamano?: number
  className?: string
}

/**
 * Avatar para personas sin foto: silueta sobre un círculo, en SVG (nítido a cualquier tamaño).
 * Los colores salen del tema (_AvatarPorDefecto.scss), así se ve bien en modo claro y nocturno.
 */
export const AvatarPorDefecto = ({ tamano = 80, className = '' }: AvatarPorDefectoProps) => (
  <svg
    className={`avatar-por-defecto ${className}`}
    width={tamano}
    height={tamano}
    viewBox="0 0 80 80"
    role="img"
    aria-label="Sin foto"
  >
    <defs>
      <clipPath id="avatar-por-defecto-circulo">
        <circle cx="40" cy="40" r="40" />
      </clipPath>
    </defs>
    <g clipPath="url(#avatar-por-defecto-circulo)">
      <rect className="avatar-por-defecto__fondo" width="80" height="80" />
      <circle className="avatar-por-defecto__silueta" cx="40" cy="31" r="14" />
      <path className="avatar-por-defecto__silueta" d="M12 80c0-16 12.5-27 28-27s28 11 28 27z" />
    </g>
  </svg>
)
