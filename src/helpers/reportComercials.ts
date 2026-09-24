export const calculateConversionRate = (
  converted: number,
  total: number,
): number =>
  total > 0
    ? (converted / total) * 100
    : 0;

    export const calculateTicketAverage = (
  totalSales: number,
  totalTransactions: number,
): number =>
  totalTransactions > 0
    ? totalSales / totalTransactions
    : 0;