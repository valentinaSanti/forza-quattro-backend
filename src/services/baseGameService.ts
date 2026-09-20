import { Transaction } from "sequelize";
import { MatchDao } from "../dao/match.dao";
import { UserDAo } from "../dao/user.dao";
import { MoveDAo } from "../dao/move.dao";
import { MATCH_COSTS } from "../utils/constants";
import { MatchStatus } from "../enum/matchStatus";
import { Match, Move } from "../models";
import { Connect4, Connect4AI, GameStatus } from "connect4-ai";
import { match } from "assert";
import { BadRequestError, ForbiddenError, NotFoundError, UnprocessableEntityError } from "../utils/errors";
import { applyMove, getStatus, mapWinnerToUserId, rebuildGame, validateMove } from "../utils/gameEngine";

export const matchDao = new MatchDao();
export const moveDao = new MoveDAo();
export const userDao = new UserDAo();

// interfaccia per il movimento da parte dell'utente umano
export interface HumanMoveResult{
    match: Match;
    game: Connect4 |Connect4AI;
    status: GameStatus;
    finishedAfterHumanMove: boolean;
}; 

//funzione per effettuare il movimento dell'utente umano
export const playHumanMove = async (
    matchId: number,
    userId: string,
    column: number,
    t: Transaction
): Promise<HumanMoveResult> =>{
    const match = await matchDao.read(matchId, t);
    if (!match) throw new NotFoundError("Partita non trovata");
    if(match.status !== MatchStatus.ACTIVE) throw new BadRequestError("La partta non è più attiva");
    if(match.playerOneId !== userId && match.playerTwoId !== userId){
        throw new ForbiddenError("Non fai parte dei giocatori di questa partita");
    }
    if (match.currentTurn !== userId) throw new BadRequestError("Non è il tuo turno");
    const user = await userDao.read(userId,t);
    if (!user) throw new NotFoundError("Utente non trovato");

    const previousMoves = await moveDao.findByMatch(matchId);
    const moveHistory = previousMoves.map((m)=> m.column);
    const game =rebuildGame(match.type, moveHistory);

    if(!validateMove(game, column)) {
        throw new UnprocessableEntityError("Mossa non ammisibile");
    }

    applyMove(game,column);
    await moveDao.create({matchId, playerId: userId, column} as Move, t);
    user.tokens -= MATCH_COSTS.MOVE_COST;
    await userDao.update(user,t);

    const status = getStatus(game);
    if(status.gameOver){
        match.status = MatchStatus.FINISHED;
        match.currentTurn =null;
        match.winnerId = mapWinnerToUserId(status, match.playerOneId, match.playerTwoId!);
        await matchDao.update(match,t);
        return {match, game, status, finishedAfterHumanMove: true};
    }
    return {match, game, status, finishedAfterHumanMove: false};
};
// funzione per ritornare la storia delle mosse
export const getMoveHistory = async (matchId: number, from?: Date, to?: Date) =>{
    const match = await matchDao.read(matchId);
    if (!match) throw new NotFoundError("Partita non presente")
    return await moveDao.findByMatchWithDateFilter(
        matchId,
        from,
        to
    );
};
