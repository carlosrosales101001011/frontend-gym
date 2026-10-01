/** Paleta de acentos (fondo suave + color del ícono) */
const PALETA = [
  { bg: '#E8F3EC', fg: '#1E7A52' }, // verde
  { bg: '#E8EEF9', fg: '#2A56A8' }, // azul
  { bg: '#F3EAF6', fg: '#7C3F9E' }, // violeta
  { bg: '#FBEFE4', fg: '#B4611B' }, // naranja
  { bg: '#FCE8EC', fg: '#B23A5A' }, // rosa
  { bg: '#E9F1F2', fg: '#1F6E75' }, // teal
  { bg: '#F0EEE6', fg: '#6B6455' }, // gris cálido
];

/**
 * Color estable derivado de un texto (ej. el nombre de un módulo): el mismo texto siempre da
 * el mismo color, sin depender de un campo "color" en el backend.
 */
export const colorPorTexto = (texto: string) => {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) hash = texto.charCodeAt(i) + ((hash << 5) - hash);
  return PALETA[Math.abs(hash) % PALETA.length];
};
