import { sequelize } from "../db/database";
import { InternalServerError } from "../utils/errors";
import { playHumanMove, matchDao } from "./baseGameService";

// funzione per gestire i movimenti in una partita user vs user
export const makeMove = async (matchId: number, userId: string, column:number) =>{
    return await sequelize.transaction(async (t)=>{
        const {match, status, finishedAfterHumanMove} = await playHumanMove(matchId, userId,column,t);

        if (finishedAfterHumanMove){
            return {match, status};
        }
        if(match.playerTwoId === null){
            throw new InternalServerError("Partita senza secondo giocatore assegnato");
        }
        match.currentTurn = match.playerOneId === userId ? match.playerTwoId : match.playerOneId;
        await matchDao.update(match, t);

        return {match, status};
    })
}