import { Router } from "express";
import * as MatchController from "../controllers/match.controllers";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { checkTokenBalance } from "../middlewares/tokenMiddleware";
import { validateCreateMatch, validateMove } from "../middlewares/validatorMiddleware";
import * as MoveController from "../controllers/move.controllers";
const router = Router();

//creazione match
router.post("/", authenticateJWT, ...validateCreateMatch, checkTokenBalance, MatchController.createMatch);
//router.post("/", authenticateJWT, checkTokenBalance, MatchController.createMatch);

// stato della partita
router.get("/:id/status",authenticateJWT, MatchController.getStatus);

//abbandono della partita
router.post("/:id/abandon",authenticateJWT, MatchController.abandon);

//Route per effettuare una mossa al costo di 0.05 (anche AI)
router.post("/:id/move", authenticateJWT,...validateMove, MoveController.makeMove);

//Storico mosse filtrato per data (formato JSON | pdf)
router.get("/:id/history", authenticateJWT, MoveController.getHistory);

export default router;