// utils/date.ts
export const localDateStringToDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    // Construye la fecha con hora local en vez de UTC
    return new Date(year, month - 1, day, 12, 0, 0); // mediodía local = seguro en cualquier timezone
};