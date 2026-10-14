export const querys = {
    page: 'page',
    show: 'show',
    search: 'search',
    /** Campos del backend donde buscar ("Buscar en columnas" de DataTableTest), separados por coma */
    columnas: 'columnas',
    total: 'total',
    /** Rango de fechas (yyyy-mm-dd) de las tablas que lo filtran (ej. asistencias) */
    fechaInicio: 'fecha_inicio',
    fechaFin: 'fecha_fin',
}
/** Zona horaria del negocio (Perú, UTC-5, sin horario de verano), en minutos respecto a UTC */
export const OFFSET_UTC_NEGOCIO = -5 * 60
export const models={
    user:'user',

}
export const apis = {
    user:{
        login: `login`,
        register: `register`,
        obtener: ``
    }
}