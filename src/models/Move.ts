import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../db/database';
import { Match } from './Match';
import { User } from './User'; 

interface MoveAttributes {
    id: number;
    matchId: number;
    playerId: string; //potrebbe toccare all'AI
    column: number; // colonna scelta dipende dal numero di colonne
    createdAt?: Date;
}
interface MoveCreationAttributes extends Optional<MoveAttributes,'id'>{}

export class Move extends Model<MoveAttributes,MoveCreationAttributes> implements MoveAttributes{
    public id!: number;
    public matchId!: number;
    public playerId!: string; //potrebbe toccare all'AI
    public column!: number; // colonna scelta dipende dal numero di colonne
    
    public readonly createdAt!: Date;
}

Move.init(
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        matchId: {
            type: DataTypes.INTEGER,
            allowNull:false,
            references: {model: Match, key:'id'},
        },
        playerId:{
            type: DataTypes.STRING,
            allowNull: false,
            references: {model: User, key:'id'},
        },
        column:{
            type: DataTypes.INTEGER,
            allowNull: false,
            //valutare check che il numero sia nel numero di colonne impostato
        },
    },
    {
        sequelize,
        tableName: 'moves',
        timestamps: true,
        updatedAt: false,
    }
);
