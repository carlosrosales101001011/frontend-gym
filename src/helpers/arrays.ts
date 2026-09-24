import { sumBy } from "./reports";

export const uniqueById = <T extends { id: number | string }>(
  items: T[],
): T[] =>
  Array.from(
    new Map(items.map((item) => [item.id, item])).values(),
  );
export const groupBy = <T>(
  items: T[],
  key: keyof T,
): Record<string, T[]> =>
  items.reduce<Record<string, T[]>>((acc, item) => {
    const group = String(item[key]);

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