import { Request, Response, NextFunction } from "express";
import * as AuthService from "../services/auth.service"
import { ConflictError, UnauthorizedError } from "../utils/errors";
import { StatusCodes } from "http-status-codes";
import { STATUS_CODES } from "http";

export const login =async (req: Request,res:Response, next: NextFunction):Promise<void> =>{
    try{
        const {email, password} =req.body;
        const token = await AuthService.login(email,password);

        if(!token) {
            return next(new UnauthorizedError("Credenziali non valide"));
        }
        res.status(StatusCodes.OK).json({token});
    }catch(error){
        next(error);
    }
};

export const register = async(req: Request,res:Response, next: NextFunction):Promise<void> => {
    try {
        const {email, password} =req.body;
        const user = await AuthService.register(email, password);

        if(!user){
            return next(new ConflictError("Utente già esistente"));
        }
        res.status(StatusCodes.CREATED).json({message:"Utente registrato con successo", userId:user.id});

    }catch(error){
        next(error);
    }
};