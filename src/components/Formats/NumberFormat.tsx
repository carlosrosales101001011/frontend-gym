interface FormatNumberOptions {
  decimals?: number;        // cantidad de decimales
  decimalSeparator?: string; // ej: '.', ',', 'b'
  thousandsSeparator?: string; // ej: ',', '.', 'a', ' '
  groupSize?: number;        // cada cuántos dígitos separar (default 3)
}

function formatNumber(
  value: unknown,
  options: FormatNumberOptions = {}
): string {
  const {
    decimals = 2,
    decimalSeparator = '.',
    thousandsSeparator = ',',
    groupSize = 3,
  } = options;

  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  const safeNum = isNaN(num) ? 0 : num;

  // Separa parte entera y decimal usando punto fijo internamente
  const fixed = safeNum.toFixed(decimals);
  const [integerPart, decimalPart] = fixed.split('.');

  // Agrupa la parte entera cada `groupSize` dígitos desde la derecha
  const isNegative = integerPart.startsWith('-');
  const digits = isNegative ? integerPart.slice(1) : integerPart;

  const regex = new RegExp(`\\B(?=(\\d{${groupSize}})+(?!\\d))`, 'g');
  const groupedInteger = digits.replace(regex, thousandsSeparator);

  const result = (isNegative ? '-' : '') + groupedInteger;

  return decimals > 0 ? `${result}${decimalSeparator}${decimalPart}` : result;
}


export const NumberFormatMoney = ({ value }: { value: unknown }) => {
  return (
    <span className="mx-2">
        {formatNumber(value, { decimals: 2, decimalSeparator: '.', thousandsSeparator: ',' })}
    </span>
  )
}
