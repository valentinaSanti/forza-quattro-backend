import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../db/database';
import { User } from './User';
import { MatchType } from '../enum/matchType';
import { MatchStatus } from '../enum/matchStatus';
import { WinReason } from '../enum/winReason';

interface MatchAttribute {
    id: number;
    type: MatchType; //user vs user o user vs AI
    status: MatchStatus;
    playerOneId: string;
    playerTwoId: string | null; // null nel caso in cui vsAI
    currentTurn: string | null; // id utente che deve giocare
    winnerId: string | null;
    winnerReason: WinReason | null;
    timeLimit: number | null; //tempo limite per una mossa, nullo se non c'è un limite
    boardState: string;
}

//Attributi con valori di default alla creazione:id e token
export interface MatchCreationAttributes extends Optional<MatchAttribute,'id' |'boardState'|'status' | 'winnerReason' | 'winnerId'| 'currentTurn' | 'playerTwoId'>{}

export class Match extends Model<MatchAttribute,MatchCreationAttributes> implements MatchAttribute {
    public id!: number;
    public type!: MatchType; 
    public status!: MatchStatus;
    public playerOneId!: string;
    public playerTwoId!: string | null; 
    public currentTurn!: string | null; 
    public winnerId!: string | null;
    public winnerReason!: WinReason | null;
    public timeLimit!: number | null; 
    public boardState!: string;

    // Date relative alla creazione del match e al suo aggiornamento 
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
Match.init(
    {
       id:{
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
        },
        type:{
            type:DataTypes.ENUM(...Object.values(MatchType)),
            allowNull:false,
        },
        status:{
            type: DataTypes.ENUM(...Object.values(MatchStatus)),
            allowNull:false,
            defaultValue:MatchStatus.ACTIVE,
        },
        playerOneId:{
            type: DataTypes.STRING,
            allowNull:false,
            references:{model: 'users', key: 'id'},
        },
        playerTwoId:{
            type: DataTypes.STRING,
            allowNull:true,
            references:{model: 'users', key: 'id'},
        },
        currentTurn:{
            type: DataTypes.STRING,
            allowNull:true,
        },
        winnerId: {
            type: DataTypes.STRING,
            allowNull:true,
            references:{model: 'users', key: 'id'},
        },
        winnerReason:{
            type:DataTypes.ENUM(...Object.values(WinReason)),
            allowNull:true,
            defaultValue: null,
        },
        timeLimit:{
            type: DataTypes.INTEGER,
            allowNull:true,
        },
        boardState:{
            type: DataTypes.TEXT,
            allowNull:false,
            defaultValue: JSON.stringify(Array(6).fill(Array(7).fill(null))) //griglia vuota 6x7
        },
    },
    {
        sequelize,
        tableName: "matches",
        timestamps: true,
    }
);