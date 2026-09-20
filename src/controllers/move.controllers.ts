import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { matchDao, getMoveHistory as getHistoryBase } from "../services/baseGameService";
import * as UvUGameService from "../services/UvUGameService";
import * as UvAiGameService from "../services/UvAiGameService";
import { generateMoveHistoryPDF } from "../utils/pdfGenerator";
import { MatchType } from "../enum/matchType";
import { NotFoundError } from "../utils/errors";
import { parseDateParam } from "../utils/dateUtils";

//funzione per la gestione delle mosse
export const makeMove = async (req: AuthRequest, res:Response, next:NextFunction) =>{
    try{
        const matchId = Number(req.params.id);
        const {column} = req.body;

        const match = await matchDao.read(matchId);
        if(!match) throw new NotFoundError("Partita non trovata");

        const result = 
            match.type === MatchType.VS_AI 
            ?await UvAiGameService.makeMove(matchId, req.user.id,column)
            : await UvUGameService.makeMove(matchId, req.user.id, column);

        res.json(result);
    }catch(error){
        next(error)
    }
};

// funzione per ottenere la storia
export const getHistory = async (req: AuthRequest, res: Response, next: NextFunction) =>{
    try{
        const matchId = Number(req.params.id);
        const {from, to, format} = req.query;
        const fromDate = parseDateParam(from);
        const toDate = parseDateParam(to);
        const history = await getHistoryBase(matchId, fromDate, toDate);
        if (format === 'pdf'){
            return generateMoveHistoryPDF(history, matchId,res);
        }
        res.json(history);
    }catch(error){
        next(error);
    }
}