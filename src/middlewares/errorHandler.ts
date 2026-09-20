import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/errors";

//middleware per la gestione degli errori
export const errorHandler = (err:Error, req:Request, res:Response, next:NextFunction) => {
    if (err instanceof ApiError){
        res.status(err.statusCode).json({message: err.message});
        return;
    }
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Errore interno del server"}); 
}