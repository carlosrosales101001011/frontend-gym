import { sumBy } from "./reports";

export const uniqueById = <T extends { id: number | string }>(
  items: T[],
): T[] =>
  Array.from(
    new Map(items.map((item) => [item.id, item])).values(),
  );
// Agrupa por una propiedad ('id_tipo') o por una función ((item) => item.seccion.subSeccion)
export const groupBy = <T>(
  items: T[],
  key: keyof T | ((item: T) => string | number),
): Record<string, T[]> =>
  items.reduce<Record<string, T[]>>((acc, item) => {
    const group = String(typeof key === 'function' ? key(item) : item[key]);

    acc[group] ??= [];
    acc[group].push(item);

    return acc;
  }, {});

  export const groupAndSum = <T>(
  data: T[],
  groupSelector: (item: T) => string | number,
  valueSelector: (item: T) => number,
) => {
  const groups = groupBy(data, groupSelector);

  return Object.entries(groups).map(([key, items]) => ({
    key,
    total: sumBy(items, valueSelector),
    cantidad: items.length,
  }));
};