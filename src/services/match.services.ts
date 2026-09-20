import { UserDAo } from "../dao/user.dao";
import { MatchDao } from "../dao/match.dao";
import { BadRequestError, ConflictError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from "../utils/errors";
import { MATCH_COSTS } from "../utils/constants";
import { Match } from "../models";
import { sequelize } from "../db/database";
import { MatchStatus } from "../enum/matchStatus";
import { MatchType } from "../enum/matchType";
import { WinReason } from "../enum/winReason";

const userDAo = new UserDAo();
const matchDao = new MatchDao();

export const createMatch =async (
    creatorId: string,
    type: MatchType,
    playerTwoEmail: string | undefined,
    timeLimit: number |null
) => {
    return await sequelize.transaction(async (t) =>{
        const creator = await userDAo.read(creatorId,t);
        if(!creator) throw new NotFoundError("Utente creatore del match inesistente");

        //verifica che l'utente (non AI) non abbia già altre partite attive
        // l'utente AI e admin non sono soggette a questo vincolo ma non possono creare partite
        const existingActiveMatch = await matchDao.findActiveMatchByUser(creatorId);
        if(existingActiveMatch) throw new ConflictError( "Hai già un metch attivo");

        //selezione del costo del match
        const cost = type === MatchType.UVU ? MATCH_COSTS.UVU_CREATION : MATCH_COSTS.VS_AI_CREATION;

        if (creator.tokens <cost){
            throw new UnauthorizedError("Unauthorized");
        }
        let playerTwoId: string;

        if(type === MatchType.UVU){
            if(!playerTwoEmail){
                throw new BadRequestError("Obbligatorio inserire la mail dell'avversario per una partita 1 vs 1");
            }
            const secondPlayer = await userDAo.findByEmail(playerTwoEmail);
            if(!secondPlayer){
                throw new NotFoundError ("Avversario non trovato");
            }
            if (secondPlayer.id === creator.id){
                throw new BadRequestError("Non puoi sfidare te stesso");
            }
            playerTwoId = secondPlayer.id;
        }else{
            const aiUser = await userDAo.findAI();
            if(!aiUser){
                throw new InternalServerError("Utente AI inesistente");
            }
            playerTwoId = aiUser.id;
        }
        //Creazione della partita
        const match = await matchDao.create({
            type, 
            playerOneId: creator.id,
            playerTwoId,
            currentTurn:creator.id,
            timeLimit,
        },t);

        //L'addebito del costo del match
        creator.tokens -= cost;
        await userDAo.update(creator,t);
        return match;
    });
};

//definizione dello stato del match
export const getMatchStatus = async(matchId:number)=>{
    const match = await matchDao.read(matchId);
    if(!match) throw new NotFoundError( "Match non trovato");
    return match;
};

//definizione del servizio per abbandonare il match
export const abandonMatch = async (matchId:number,userId:string)=>{
    const match = await matchDao.read(matchId);

    if(!match) throw new NotFoundError( "Match non trovato");
    
    if(match.playerOneId!== userId && match.playerTwoId!==userId){
        throw new ForbiddenError("Non fai parte del match");
    }
    if(match.status!==MatchStatus.ACTIVE){
        throw new BadRequestError("La partita non è attiva");
    }
    match.status = MatchStatus.ABANDONED;
    match.winnerId =match.playerOneId===userId? match.playerTwoId : match.playerOneId;
    match.winnerReason = WinReason.WIN_ABB;
    match.currentTurn = null;

    await matchDao.update(match);

    return match;
};


    