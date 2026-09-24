import { format as formatFns, isValid, parse } from "date-fns";
import { es } from "date-fns/locale";

// Formatos disponibles -> tokens de date-fns (en date-fns "mm" son minutos, "MM" es mes).
const FORMATOS = {
    'yyyy-mm-dd': 'yyyy-MM-dd',
    'yyyy/mm/dd': 'yyyy/MM/dd',
    'dd-mm-yyyy': 'dd-MM-yyyy',
    'dd/mm/yyyy': 'dd/MM/yyyy',
    'mm-dd-yyyy': 'MM-dd-yyyy',
    'mm/dd/yyyy': 'MM/dd/yyyy',
    'yyyy-mm-dd hh:mm': 'yyyy-MM-dd HH:mm',
    'yyyy-mm-dd hh:mm:ss': 'yyyy-MM-dd HH:mm:ss',
    'dd/mm/yyyy hh:mm': 'dd/MM/yyyy HH:mm',
    'dd/mm/yyyy hh:mm:ss': 'dd/MM/yyyy HH:mm:ss',
    'hh:mm': 'HH:mm',
    'hh:mm:ss': 'HH:mm:ss',
    // Con nombres (DDDD = día de la semana, MMMM = mes, [texto] = literal)
    'DDDD dd [de] MMMM [del] yyyy': "EEEE dd 'de' MMMM 'del' yyyy",
    'DDDD dd [de] MMMM': "EEEE dd 'de' MMMM",
    'dd [de] MMMM [del] yyyy': "dd 'de' MMMM 'del' yyyy",
    'DDD dd MMM yyyy': 'EEE dd MMM yyyy',
    'dd MMM yyyy': 'dd MMM yyyy',
    'MMMM yyyy': 'MMMM yyyy',
    'MMMM': 'MMMM',
    'DDDD': 'EEEE',
} as const;

export type FormatoFecha = keyof typeof FORMATOS;

// Convierte una fecha de un formato a otro.
// ej: formatDate('24/09/2026', 'dd/mm/yyyy', 'yyyy-mm-dd') => '2026-09-24'
export const formatDate = (date: Date | string, dateFormat: FormatoFecha, format: FormatoFecha): string => {
    const fecha = typeof date === 'string' ? parse(date, FORMATOS[dateFormat], new Date(), { locale: es }) : date;
    if (!isValid(fecha)) return '';
    return formatFns(fecha, FORMATOS[format], { locale: es });
}
