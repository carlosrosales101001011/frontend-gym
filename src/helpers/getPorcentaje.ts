
export const getPorcentaje = (
  value: number,
  total: number,
): number => {
  if (!total) return 0;
  return (value / total) * 100;
};