// strings.ts
export const capitalizeWords = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());

export const normalizeText = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

export const cleanSpaces = (text: string): string =>
  text.trim().replace(/\s+/g, ' ');

export const truncateText = (
  text: string,
  maxLength: number = 30,
): string =>
  text.length > maxLength
    ? `${text.slice(0, maxLength)}...`
    : text;

export const getInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();