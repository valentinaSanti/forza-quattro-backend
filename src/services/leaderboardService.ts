import { matchDao } from "./baseGameService";
import { UserDAo } from "../dao/user.dao";
import { MatchType } from "../enum/matchType";
import { MatchStatus } from "../enum/matchStatus";
import { User, Match } from "../models";
import { WinReason } from "../enum/winReason";
import { MatchEndCause } from "../enum/matchEndCause";

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

// funzione per tradurre lo conclusione della partita dal punto di vista del singolo utente
const getResultLabel = (match: Match, userId: string): WinReason =>{
    const won = match.winnerId === userId;
    const byAbandonOrTimeout = match.winnerReason === MatchEndCause.ABANDONED || match.winnerReason === MatchEndCause.TIMEOUT;

    if (won) return byAbandonOrTimeout? WinReason.WIN_ABB : WinReason.WIN;
    return byAbandonOrTimeout ? WinReason.GAME_OVER_ABB : WinReason.GAME_OVER;
};

//gestione dello stato iniziale
const computeUserStats = (user: User, matches: Match[]):LeaderboardEntry =>{
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
                if(match.status === MatchStatus.ACTIVE) continue;
                //gestione pareggio
                if(!match.winnerId) continue;
                
                const isVsAI = match.type === MatchType.VS_AI;
                const label = getResultLabel(match,user.id);

                //gestione casistiche conclusione partite
                if(label === WinReason.WIN) isVsAI ? entry.wonVsAI++ : entry.wonVsUser++;
                else if (label === WinReason.WIN_ABB) isVsAI ? entry.wonByAbandonVsAi++ : entry.wonByAbandonVsUser++;
                else if (label === WinReason.GAME_OVER) isVsAI ? entry.lostVsAi++ : entry.lostVsUser++;
                else if (label === WinReason.GAME_OVER_ABB) isVsAI ? entry.lostByAbandonVsAi++ : entry.lostByAbandonVsUser++;  
            }
            
            entry.score = entry.wonVsUser + entry.wonVsAI + entry.wonByAbandonVsAi + entry.wonByAbandonVsUser;
            return entry;
};

// funzione per calcolare la classifica pubblica di tutti gli utenti (admin e AI esclusi)
//aggregando le partite giocate. Distinzione partire perse e vinte per allineamento e per abbandono, 
// distinzione vs AI o vs user. Il punteggio tiene conto anche delle partite vinte 
// per abbandono dell'altro giocatore
export const getLeaderboard = async (order: "ASC"| "DESC" = "DESC"): Promise<LeaderboardEntry[]> => {
    const users = await userDao.readAllRealUser();
    const leardboar: LeaderboardEntry[] = await Promise.all(
        users.map(async(user)=>{
            const matches = await matchDao.findAllByUser(user.id);
            return computeUserStats(user, matches);
            })
    );
    //ordinamento per punteggio
    leardboar.sort((a,b)=>(order === "DESC" ?b.score - a.score: a.score - b.score));

    return leardboar;
}