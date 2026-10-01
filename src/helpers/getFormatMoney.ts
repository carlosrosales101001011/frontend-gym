interface FormatMoneyOptions {
  currency?: 'PEN' | 'USD';
  decimals?: number;
  showSymbol?: boolean;
  /** Versión corta para gráficos: miles con "mil" y millones con "M" (S/ 4 mil, S/ 12.5 mil, S/ 1.3 M), hasta 1 decimal y sin ceros de más (S/ 850) */
  is_version_cut?: boolean;
}

/** Unidades de la versión corta, de mayor a menor */
const UNIDADES_CORTAS = [
  { divisor: 1_000_000, sufijo: 'M' },
  { divisor: 1_000, sufijo: 'mil' },
];

export const getFormatMoney = (
  amount: number,
  {
    currency = 'PEN',
    decimals = 2,
    showSymbol = true,
    is_version_cut = false,
  }: FormatMoneyOptions = {},
): string => {
  const formatear = (valor: number, minimo: number, maximo: number) => new Intl.NumberFormat('es-PE', {
    style: showSymbol ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits: minimo,
    maximumFractionDigits: maximo,
  }).format(valor);

  if (is_version_cut) {
    // Se redondea a 1 decimal antes de elegir la unidad: 999,960 es "S/ 1 M", no "S/ 1,000 mil"
    const unidad = UNIDADES_CORTAS.find(({ divisor }) => Math.round(Math.abs(amount) / divisor * 10) / 10 >= 1);
    return unidad ? `${formatear(amount / unidad.divisor, 0, 1)} ${unidad.sufijo}` : formatear(amount, 0, 1);
  }
  return formatear(amount, decimals, decimals);
};
