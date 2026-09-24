interface FormatMoneyOptions {
  currency?: 'PEN' | 'USD';
  decimals?: number;
  showSymbol?: boolean;
}

export const getFormatMoney = (
  amount: number,
  {
    currency = 'PEN',
    decimals = 2,
    showSymbol = true,
  }: FormatMoneyOptions = {},
): string => {
  return new Intl.NumberFormat('es-PE', {
    style: showSymbol ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};