import { sequelize } from "../db/database";
import {User, Match, Move} from "../models";
import bcrypt from "bcryptjs";
import { SALT, TOKEN_USER } from "../utils/constants";
import { UserRole } from "../enum/userRole";

const seed = async () =>{
    try{
        //questa struttura adatta alla fase di sviluppo
        console.log("Reset database");
        await sequelize.sync({force:true});
        console.log("Tabelle create/ricreate con successo");

        // password comune per utenti di test
        const hashedPassword = await bcrypt.hash("password12345",SALT);

        //Utente amministratore
        await User.create({
            email:"admin@example.it",
            password: hashedPassword,
            role: UserRole.ADMIN,
            isAI: false,
            tokens: 100,
        });

        //Utente speciale che rappresenta AI non fa login
        await User.create({
            email:"ai@example.it",
            password: hashedPassword,
            role: UserRole.USER,
            isAI: true,
            tokens: 999999999999999,
        });

        //utenti normali di prova
        await User.create({
            email:"mario.rossi@example.it",
            password: hashedPassword,
            role: UserRole.USER,
            isAI: false,
            tokens: TOKEN_USER,
        });
        await User.create({
            email:"luca.bianchi@example.it",
            password: hashedPassword,
            role: UserRole.USER,
            isAI: false,
        });
        await User.create({
            email:"matteo.neri@example.it",
            password: hashedPassword,
            role: UserRole.USER,
            isAI: false,
        });

        console.log("Seed completato con successo");
        process.exit(0);
    }catch(error){
        console.error("Errore durante il seed", error);
        process.exit(1);
    }
};

seed();