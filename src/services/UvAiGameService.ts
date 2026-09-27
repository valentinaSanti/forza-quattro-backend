import { sequelize } from "../db/database";
import { Connect4AI } from "connect4-ai";
import { playHumanMove, matchDao, moveDao, userDao } from "./baseGameService";
import { applyAIMove, getStatus, mapWinnerToUserId } from "../utils/gameEngine";
import { InternalServerError } from "../utils/errors";
import { MatchStatus } from "../enum/matchStatus";
import { AiDifficulty } from "../enum/aiDifficulty";
import { MATCH_COSTS } from "../utils/constants";
import { Move } from "../models";

//funzione per gestire le mosse, prima applica la mossa dell'utente e poi se la partita 
// prosegue applica la mossa dell'AI
export const makeMove = async (matchId: number, userId:string, column:number)=>{
    return await sequelize.transaction(async (t)=>{
        const {match, game, status: statusAfterHuman, finishedAfterHumanMove} = await playHumanMove(
            matchId,
            userId,
            column,
            t
        );
        if(finishedAfterHumanMove){
            return {match, status: statusAfterHuman};
        }

        const aiUser = await userDao.findAI();
        if(!aiUser) throw new InternalServerError("utente AI non configurato nel sistema");

        const aiColumn = applyAIMove(game as Connect4AI, AiDifficulty.HARD);

        await moveDao.create({matchId, playerId:aiUser.id, column: aiColumn}as Move, t);
        //il costo della mossa dell'AI viene addebitato all'utente
        const humanUser = await userDao.read(userId, t);
        if(!humanUser) throw new InternalServerError("utente non configurato nel sistema");
        humanUser.tokens -= MATCH_COSTS.MOVE_COST;
        await userDao.update(humanUser,t);

        const status = getStatus(game);

        if(status.gameOver){
            match.status = MatchStatus.FINISHED;
            match.currentTurn =null;
            match.winnerId = mapWinnerToUserId(status, match.playerOneId, match.playerTwoId!);
            await matchDao.update(match,t);
            return {match, status};
        }

        match.currentTurn = userId; //torniamo direttamente il turno all'utente umano
        await matchDao.update(match,t);
        return {match, status};      
    });
}