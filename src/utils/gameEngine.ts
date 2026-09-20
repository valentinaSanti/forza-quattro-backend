import {Connect4,Connect4AI, GameStatus} from "connect4-ai";
import { MatchType } from "../enum/matchType";
import { AiDifficulty } from "../enum/aiDifficulty";

//Attraverso questo modulo viene isolato il resto del progetto dalla libreria esterna

//attraverso questa funzione viene ricostruito lo stato delle partite eseguendo in ordine tutte le mosse
export const rebuildGame = (type: MatchType, moveHistory: number[]):Connect4|Connect4AI =>{
    const game = type === MatchType.VS_AI? new Connect4AI() : new Connect4();
    game.playMoves(moveHistory);
    return game;
}

// metodo per verificare che la colonna selezionata sia giocabile allo stato attuale del match
export const validateMove = (game:Connect4|Connect4AI,column: number):boolean =>{
    return game.canPlay(column);
}

// funzione per applicare una mossa umana al gioco
export const applyMove = (game: Connect4|Connect4AI, column: number):void =>{
    game.play(column);
}

//funzione per calcolare ed eseguire la mossa dell'AI
export const applyAIMove = (game: Connect4AI,diffulty: AiDifficulty = AiDifficulty.HARD): number =>{
    return game.playAI(diffulty);
}

//funzione per restituire lo stato della partita
export const getStatus = (game: Connect4|Connect4AI): GameStatus =>{
    return game.gameStatus();
}

//funzione per definire chi ha vinto la partita e mi restiuisce l'ID del vincitore
export const mapWinnerToUserId = (
    status: GameStatus,
    playerOneId:string,
    playerTwoId: string,
): string | null =>{
    if(!status.gameOver || status.winner=== undefined || status.winner===null){
        return null;
    }
    return status.winner === 1 ? playerOneId : playerTwoId;
}

