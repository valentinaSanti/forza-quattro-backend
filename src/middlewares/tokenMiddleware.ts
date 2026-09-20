import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import { UserDAo } from "../dao/user.dao";
import { MATCH_COSTS } from "../utils/constants";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../utils/errors";
import { MatchType } from "../enum/matchType";

const userDAo = new UserDAo();
export const checkTokenBalance = async (req:AuthRequest, res: Response, next:NextFunction)=>{
    try{
        const authenticateUser = req.user;
        if (!authenticateUser || !authenticateUser.id){
            return next(new UnauthorizedError("Utente non autenticato o token non valido"));
        }
        const user = await userDAo.read(authenticateUser.id);
        if(!user){
            return next(new NotFoundError("Utente non trovato"));
        }
        const {type} = req.body;
        const requiredCost = (type === MatchType.VS_AI ) ? MATCH_COSTS.VS_AI_CREATION : MATCH_COSTS.UVU_CREATION;
        if (user.tokens < requiredCost){
            return next(new ForbiddenError("I token che possiedi non sono sufficienti per avviare il match"))
        }
        next();
    }catch(error){
        next(error);
    }
};