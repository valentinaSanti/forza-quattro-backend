//N.B. Non inserire import o export in questo tipo di file altrimenti non viene considerato il declare
//questa dichiarazione è necessaria perchè la libreria è scritta in Javascript

declare module "connect4-ai" {
    export interface SolutionPoint{
        column:number;
        spacesFromBottom: number;
    }
    export interface GameStatus {
        movesPlayed: number;
        currentPlayer: number; //1|2
        gameOver: boolean;
        winner?: number|null; // 1|2 ho un valore solo se GameOver true
        solution?:SolutionPoint[];
    }

    export class Connect4{
        constructor(w?: number, h?: number);
        width: number;
        height: number;
        gameOver: boolean;
        winner: number |null;

        reset(): void;
        play(col:number):void;
        canPlay(col:number):boolean;
        play1BasedColumn(col: number):void;
        playMoves(plays: number[]):void;

        getMoveCount(): number;
        getPlays(): string;
        getActivePlayer(): number;
        gameStatus():GameStatus;
        ascii():string;
    }
    
    export class Connect4AI extends Connect4{
        constructor(w?: number, h?: number);
        playAI(level:"hard" | "medium" | "easy"):number;
    }
}
