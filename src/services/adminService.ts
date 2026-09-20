import { UserDAo } from "../dao/user.dao";
import { BadRequestError, NotFoundError } from "../utils/errors";

const userDao = new UserDAo();

//funzione per far ricaricare i token dall'admin
export const rechargeUserTokens = async (email: string, newTokenAmount: number) => {
    if(newTokenAmount <0){
        throw new BadRequestError("Il nuovo credito non può essere negativo")
    }
     const user = await userDao.findByEmail(email);
     if(!user) throw new NotFoundError("Utente non trovato");

     user.tokens=newTokenAmount;
     await userDao.update(user);

     return user;
};

