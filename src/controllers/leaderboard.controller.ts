import { Request, Response, NextFunction } from "express";
import * as LeaderboardService from "../services/leaderboardService";

export const getLeaderboard = async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const order = req.query.order === "asc" ? "ASC" : "DESC";
        const leaderboard = await LeaderboardService.getLeaderboard(order);
        res.json(leaderboard);
    }catch(error){
        next(error);
    }
}