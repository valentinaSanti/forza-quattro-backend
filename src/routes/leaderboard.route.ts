import { Router } from "express";
import { getLeaderboard } from "../controllers/leaderboard.controller";

const router = Router();
//rotta classifica
router.get("/", getLeaderboard);

export default router;
