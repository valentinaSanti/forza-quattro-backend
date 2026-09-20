import { Model, DataTypes, Op, Optional } from 'sequelize';
import { sequelize } from '../db/database';
import { TOKEN_USER } from '../utils/constants';
import { UserRole } from '../enum/userRole';

//Attributi del modello User
interface UserAttributes{
    id: string;
    email:string;
    password:string;
    role: UserRole;
    isAI:boolean; //campo per tenere traccia della tipologia di utente, true solo per utente AI
    tokens: number;
    points: number; //necessario per gestione classifica
}

//Attributi con valori di default alla creazione:id e token
interface UserCreationAttributes extends Optional<UserAttributes,'id' |'role' | 'isAI' | 'tokens'| 'points'>{}

export class User extends Model<UserAttributes,UserCreationAttributes> implements UserAttributes{
    public id!:string;
    public email!:string;
    public password!:string;
    public role!: UserRole;
    public isAI!: boolean;
    public tokens!: number;
    public points!: number;

    // Date relative alla creazione dell'utente e al suo aggiornamento 
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id:{
            type: DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            primaryKey:true,
        },
        email:{
            type: DataTypes.STRING,
            allowNull:false,
            unique: true,
            validate:{
                isEmail: true,
            }
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        role:{
            type:DataTypes.ENUM(...Object.values(UserRole)),
            allowNull:false,
            defaultValue:UserRole.USER,
        },
        isAI:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue: false,
        },
        tokens:{
            type:DataTypes.DOUBLE,
            allowNull:false,
            defaultValue:TOKEN_USER, 
        },
        points:{
            type:DataTypes.DOUBLE,
            allowNull:false,
            defaultValue:0.0, 
        },
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: true,
    }
);
