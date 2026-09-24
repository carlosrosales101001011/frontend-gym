import { format } from "date-fns";
export function getDateFormat(date:string) {
    //=> '02/11/2014'
    const mes = format(new Date(date), "MM");
    const dia = format(new Date(date), "dd");
    const anio = format(new Date(date), "yyyy");
    return{
        dia,
        anio,
        mes
    }
}