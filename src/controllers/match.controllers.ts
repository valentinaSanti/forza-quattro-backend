import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as MatchService from "../services/match.services"
import { StatusCodes } from "http-status-codes";

//gestione della creazione di un match
export const createMatch = async (req: AuthRequest, res:Response, next:NextFunction)=>{
    try{
        const {type, playerTwoEmail,timeLimit} = req.body;
        const match = await MatchService.createMatch(
            req.user.id, 
            type, 
            playerTwoEmail, 
            timeLimit ?? null,
        );
        res.status(StatusCodes.CREATED).json(match);
    }catch(error){
        next(error);
    }
};

//gestione dello stato di un match
export const getStatus = async (req:AuthRequest, res: Response, next:NextFunction)=>{
    try{
        const matchId = Number(req.params.id);
        const match = await MatchService.getMatchStatus(matchId);
        res.json(match);
    }catch(error){
        next(error);
    }
};

//gestione la abbandono di un match
export const abandon = async (req:AuthRequest, res:Response, next:NextFunction)=>{
    try{
        const matchId = Number(req.params.id);
        const match = await MatchService.abandonMatch(matchId, req.user.id);
        res.json(match);
    }catch(error){
        next(error);
    }
};