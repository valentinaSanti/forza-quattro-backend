import { StatusCodes } from "http-status-codes";
export class ApiError extends Error {

    constructor( public message: string,public statusCode: number){
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this,this.constructor);
    }
}

//400 - Bad Request: dati mancanti o non validi
export class BadRequestError extends ApiError{
    constructor(message:string="Richiesta non valida"){
        super(message, StatusCodes.BAD_REQUEST);
    }
}

//401 - Unauthorized: login fallito, JWT mancante/ scaduto, crediti (token) esauriti
export class UnauthorizedError extends ApiError{
    constructor(message:string="Non autorizzato"){
        super(message, StatusCodes.UNAUTHORIZED);
    }
}

//403- Forbidden: utente autenticato ma senza i permessi necessari
// (esempio utente che prova ad accedere come amministratore ma non lo è o prova ad accedere ad una martita non sua)
export class ForbiddenError extends ApiError{
    constructor(message:string="Non hai i permessi per questa operazione"){
        super(message, StatusCodes.FORBIDDEN);
    }
}

//404 - Not Found: partita, utente o mossa non trovata
export class NotFoundError extends ApiError{
    constructor(message:string="Risorsa non trovata"){
        super(message, StatusCodes.NOT_FOUND);
    }
}

// 409 - Conflict: esempio di utilizzo --> email già utilizzata
export class ConflictError extends ApiError{
    constructor(message:string="C'è un conflitto"){
        super(message, StatusCodes.CONFLICT);
    }
}

//422 - Unprocessable Entity: mossa non ammisibile per le regole di forza 4
export class UnprocessableEntityError extends ApiError{
    constructor(message:string="Operazione non eseguibile"){
        super(message, StatusCodes.UNPROCESSABLE_ENTITY);
    }
}

//500 - Internal SErver Error: errori di configurazione o problemi generici del server
export class InternalServerError extends ApiError{
    constructor(message:string="Errore interno al server"){
        super(message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}