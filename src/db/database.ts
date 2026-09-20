import {Sequelize, Dialect} from 'sequelize';
import dotenv from 'dotenv';
import { InternalServerError } from '../utils/errors';

dotenv.config();

// Classe Singleton per la configurazione e la gestione della connessione a PostgresSQL via Sequelize
class Database{
    private static instance: Sequelize | null = null;

    private constructor(){}

    public static getInstance(): Sequelize{
        if(!Database.instance){
            Database.instance = new Sequelize(
                process.env.DB_NAME as string,
                process.env.DB_USER as string,
                process.env.DB_PASSWORD as string,  
                {
                    host: process.env.DB_HOST || 'localhost',
                    port: Number(process.env.DB_PORT) || 5432,
                    dialect:'postgres',
                    logging: false
                },
            );
        }
        return Database.instance;
    }
    public static async testConnection(): Promise<void>{
        try{
            await Database.getInstance().authenticate();
            console.log("Connessione al database avvenuta con successo");
        }catch(error){
            console.error("Errore di connessione al database:", error)
        }
    }

    public static async close(): Promise<void> {
    if (Database.instance) {
      await Database.instance.close();
      Database.instance = null;
    }
  }
}

export const sequelize = Database.getInstance();
export const testConnection =Database.testConnection;
export const closeConnection = Database.close;
export default Database;