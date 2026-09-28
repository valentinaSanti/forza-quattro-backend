import { BadRequestError } from "./errors";

// funzione per la gestione della conversione nel formato data
export const parseDateParam = (value: unknown): Date| undefined =>{
    if(!value) return undefined;
    const date = new Date(value as string);
    if(isNaN(date.getTime())){
        throw new BadRequestError("Formato data non valido, usare formato ISo (YYYY-MM-DD)")
    }
    return date;
}