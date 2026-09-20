import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth.helper";
import { UserRole } from "../enum/userRole";
import { ForbiddenError, UnauthorizedError } from "../utils/errors";

export interface AuthRequest extends Request{
    user?: any;
}

export const authenticateJWT = (req: AuthRequest,res: Response, next:NextFunction):void =>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        //res.status(StatusCodes.UNAUTHORIZED).json({message:"Token mancante o non valido"});
        return next(new UnauthorizedError('Token mancante o non valido'));
    }

    const token = authHeader.split(" ")[1];
    try{
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }catch(error){
        //res.status(StatusCodes.FORBIDDEN).json({message:"Token non valido"});
        return next(new UnauthorizedError('Token non valido o scaduto'));
    }
};

export const requireAdmin = (req: AuthRequest,res: Response, next:NextFunction) => {
    const user = req.user
    if (user && user.role === UserRole.ADMIN){
        next();
    }else {
        next(new ForbiddenError('Accesso negato. Sono richiesti privilegi di Admin'));
    }
};