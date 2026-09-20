import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { InternalServerError } from "./errors";
import { SALT } from "./constants";
import { UserRole } from "../enum/userRole";

// funzioni di utilità per hash password e firma/verifica token
if(!process.env.JWT_PRIVATE_KEY || !process.env.JWT_PUBLIC_KEY ) {
    throw new InternalServerError("Chiavi JWT non definite nelle variabili d'ambiente");
}

const privateKey = process.env.JWT_PRIVATE_KEY?.replace(/\\n/g, '\n');
const publicKey = process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n');

// Payload del JWT contenente solo i metadati essenziali
export interface JwtUserPayload{
    id: string;
    email:string;
    role: UserRole;
}

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password,SALT);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};

//Generazione di un Token JWT firmato con la chiave privata, algoritmo RS256 con scadenza
export const generateToken = (payload: JwtUserPayload):string => {
    return jwt.sign(payload,privateKey,{algorithm: 'RS256',})
};

//Verifica del token con la chiave pubblica
export const verifyToken = (token:string) => {
    return jwt.verify(token,publicKey, {algorithms: ['RS256']});
}