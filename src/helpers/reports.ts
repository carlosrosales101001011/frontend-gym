// reports.ts
export const sumBy = <T>(
  data: T[],
  selector: (item: T) => number,
): number =>
  data.reduce((total, item) => total + selector(item), 0);

export const averageBy = <T>(
  data: T[],
  selector: (item: T) => number,
): number => {
  if (!data.length) return 0;

  return sumBy(data, selector) / data.length;
};

export const percentageChange = (
  current: number,
  previous: number,
): number => {
  if (previous === 0) return current > 0 ? 100 : 0;

  return ((current - previous) / previous) * 100;
};

export const calculatePercentage = (
  value: number,
  total: number,
): number => {
  if (!total) return 0;

  return (value / total) * 100;
};
export const runningTotal = (
  values: number[],
): number[] => {
  let total = 0;

  return values.map((value) => {
    total += value;
    return total;
  });
};