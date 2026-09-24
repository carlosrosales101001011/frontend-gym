
function getDateHoy() {
    const d = new Date();
    const dia = new Intl.DateTimeFormat('es-PE', { weekday: 'short' }).format(d).replace('.', '');
    const date = d.getDate();
    const anio = d.getFullYear();
    const mes = d.getMonth() + 1;
    const hora = d.getHours();
    const minuto = d.getMinutes();
    return {
        dia,
        date,
        mes,
        hora,
        minuto,
        anio,
        d
    }
}

export default getDateHoy;