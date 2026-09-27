import { User } from "../models";
import { hashPassword, verifyPassword,generateToken } from "../utils/auth.helper";
import { UserDAo } from "../dao/user.dao";

const userDao = new UserDAo();

//registrazione dell'utente
export const register = async (email:string, password:string) => {
    //verifica se la mail è già presente
    const existinUser = await userDao.findByEmail(email); 
    
    if(existinUser){
        return null;
    }

    const hashedPassword = await hashPassword(password);
    const user = await userDao.create({email, password:hashedPassword} as any);
    return user;
};

//login dell'utente
export const login = async (email:string, password:string) => {
    const user = await userDao.findByEmail(email);
    if (!user) return null;

    const isValid =await verifyPassword(password,user.password);
    if(!isValid) return null;

    const token = generateToken({id:user.id, email: user.email, role: user.role});
    return token;
} 