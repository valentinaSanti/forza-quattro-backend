import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as AdminService from "../services/adminService";

//controller per gestire il carimento dei token da parte dell'utente
export const rechargeTokens = async (req:AuthRequest, res: Response, next:NextFunction) =>{
    try{
        const {email, tokens} = req.body;
        const user = await AdminService.rechargeUserTokens(email, tokens);
        res.json({message:"Ricarica avvenuta con successo", email:user.email, tokens:user.tokens});
    }catch(error){
        next(error);
    }
}