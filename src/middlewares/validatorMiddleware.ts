import { Request, Response, NextFunction } from "express";
import { body,validationResult } from "express-validator";
import { BadRequestError } from "../utils/errors";
import { MatchType } from "../enum/matchType";


//funzione per gestire la validazione delle richieste
export const checkValidation = (req: Request, res: Response, next:NextFunction): void =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const messages = errors.array().map((e)=> e.msg).join(", ");
        return next(new BadRequestError(messages));
    }
    next();
}

export const validateRegister =[
    body("email").isEmail().withMessage("Email non valida"),
    body("password").isLength({min:6}).withMessage("Password troppo corta"),
    checkValidation,
];

export const validateLogin =[
     body("email").isEmail().withMessage("Email non valida"),
    body("password").notEmpty().withMessage("Password obbligatoria"),
    checkValidation,
];

export const  validateCreateMatch =[
    body("type").isIn(Object.values(MatchType)).withMessage("tipo partita non valida"),
    body("playerTwoEmail").if(body("type").equals(MatchType.UVU))
        .isEmail()
        .withMessage("Email avversario obbligatoria"),
    checkValidation,
];

export const validateMove =[
    body("column").isInt({min:0, max:6}).withMessage("Colonna non valida (0-6"),
    checkValidation,
];

export const validateRecharge = [
    body("email").isEmail().withMessage("Email non valida"),
    body("tokens").isFloat({min:0}).withMessage("Credito non valido"),
    checkValidation,
];