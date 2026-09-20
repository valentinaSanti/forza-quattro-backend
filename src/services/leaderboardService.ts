import { matchDao } from "./baseGameService";
import { UserDAo } from "../dao/user.dao";
import { MatchType } from "../enum/matchType";
import { MatchStatus } from "../enum/matchStatus";
import { match } from "node:assert/strict";

const userDao = new UserDAo();
interface LeaderboardEntry {
    email: string;
    score: number;
    wonVsUser: number;
    wonByAbandonVsUser: number;
    lostVsUser: number;
    lostByAbandonVsUser: number;
    wonVsAI: number;
    wonByAbandonVsAi: number;
    lostVsAi: number;
    lostByAbandonVsAi: number;
}

// funzione per calcolare la classifica pubblica di tutti gli utenti (admin e AI esclusi)
//aggregando le partite giocate. Distinzione partire perse e vinte per allineamento e per abbandono, 
// distinzione vs AI o vs user. Il punteggio tiene conto anche delle partite vinte 
// per abbandono dell'altro giocatore
export const getLeaderboard = async (order: "ASC"| "DESC" = "DESC"): Promise<LeaderboardEntry[]> => {
    const users = await userDao.readAllRealUser();
    const leardboar: LeaderboardEntry[] = await Promise.all(
        users.map(async(user)=>{
            const matches = await matchDao.findAllByUser(user.id);
            const entry: LeaderboardEntry ={
                email: user.email,
                score: 0,
                wonVsUser: 0,
                wonByAbandonVsUser: 0,
                lostVsUser: 0,
                lostByAbandonVsUser: 0,
                wonVsAI: 0,
                wonByAbandonVsAi: 0,
                lostVsAi: 0,
                lostByAbandonVsAi: 0,
            };
            for (const match of matches){
                const isFinishedOrAbandoned =
                match.status === MatchStatus.FINISHED || match.status === MatchStatus.ABANDONED;
                if(!isFinishedOrAbandoned || !match.winnerId) continue;
                const isVsAI = match.type === MatchType.VS_AI;
                const won = match.winnerId === user.id;
                const byAbandon = match.status === MatchStatus.ABANDONED;

                if (won){
                    if(isVsAI){
                        byAbandon ? entry.lostByAbandonVsAi++ : entry.lostVsAi;
                    }else{
                        byAbandon ? entry.lostByAbandonVsUser ++ : entry.lostVsUser;
                    }
                }
            }
            entry.score = entry.wonVsUser + entry.wonVsAI + entry.wonByAbandonVsAi + entry.wonByAbandonVsUser;
            return entry;
        })
    );
    //ordinamento per punteggio
    leardboar.sort((a,b)=>(order === "DESC" ?b.score - a.score: a.score - b.score));

    return leardboar;
}