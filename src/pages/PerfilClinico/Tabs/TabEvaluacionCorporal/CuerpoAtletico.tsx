/** Gris que se ve en modo claro y oscuro */
const GRIS = '#9ca3af'

type CuerpoAtleticoProps = {
  /** Alto en px (el ancho se ajusta solo) */
  alto?: number
}

/**
 * Silueta atlética de frente, en gris. Cada segmento (brazos, tronco, piernas) es una figura aparte,
 * separados por una línea del color del fondo, para el análisis segmental.
 * Se dibuja la mitad izquierda y la derecha es su espejo.
 */
export const CuerpoAtletico = ({ alto =180 }: CuerpoAtleticoProps) => {
  const mitad = (
    <>
      {/* Brazo */}
      <path d="M57 74 C45 78 38 92 38 108 C36 124 34 138 34 150 C30 170 26 190 26 212 C24 222 24 232 28 240 C32 244 38 242 38 234 C38 222 40 212 42 204 C46 186 50 168 50 152 C52 138 55 124 58 114 Z" />
      {/* Pierna */}
      <path d="M73 202 L100 202 L98 236 C97 262 94 284 92 300 C94 318 94 342 90 372 L90 388 C88 394 80 396 72 394 C70 390 72 386 76 382 C74 362 68 336 70 318 C72 310 74 304 74 298 C68 276 64 252 66 230 C67 216 70 208 73 202 Z" />
    </>
  )

  return (
    <svg viewBox="0 0 200 400" height={alto} role="img" aria-label="Cuerpo atlético" fill={GRIS} stroke="var(--bs-body-bg)" strokeWidth={2} strokeLinejoin="round">
      {/* Cabeza y cuello */}
      <ellipse cx={100} cy={32} rx={17} ry={21} />
      <path d="M91 50 L109 50 L111 68 L89 68 Z" />
      {/* Tronco: hombros anchos y cintura angosta */}
      <path d="M90 64 C80 68 66 68 58 76 C52 84 54 100 60 112 C64 130 70 150 76 170 C74 182 72 192 72 204 L128 204 C128 192 126 182 124 170 C130 150 136 130 140 112 C146 100 148 84 142 76 C134 68 120 68 110 64 Z" />
      {mitad}
      <g transform="translate(200 0) scale(-1 1)">{mitad}</g>
    </svg>
  )
}
