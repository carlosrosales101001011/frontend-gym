/**
 * Colores del reporte de metas por tema. Meta = morado, ventas = azul (validados con el validador
 * de paleta de dataviz: separación para daltonismo y contraste contra el fondo de la card en cada tema).
 * `pendiente` (plomo) es la pista de la dona: lo que falta para la meta.
 */
export const COLORES_REPORTE = {
  light: { meta: '#4a3aa7', ventas: '#2a78d6', pendiente: '#d0d5dd', superficie: '#ffffff', texto: '#6b7280', grilla: '#e9ecef' },
  dark: { meta: '#a855f7', ventas: '#4899ea', pendiente: '#333333', superficie: '#121212', texto: '#a3a3a3', grilla: '#1f1f1f' },
}

export type ColoresReporte = (typeof COLORES_REPORTE)['light']
