import { Router } from "express";
import * as MatchController from "../controllers/match.controllers";
import { authenticateJWT, forbiddenAdmin} from "../middlewares/authMiddleware";
import { checkTokenBalance } from "../middlewares/tokenMiddleware";
import { validateCreateMatch, validateMove } from "../middlewares/validatorMiddleware";
import * as MoveController from "../controllers/move.controllers";
const router = Router();

//creazione match
router.post("/", authenticateJWT, forbiddenAdmin, ...validateCreateMatch, checkTokenBalance, MatchController.createMatch);


// stato della partita
router.get("/:id/status",authenticateJWT, forbiddenAdmin, MatchController.getStatus);

//abbandono della partita
router.post("/:id/abandon",authenticateJWT, forbiddenAdmin, MatchController.abandon);

//Route per effettuare una mossa al costo di 0.05 (anche AI)
router.post("/:id/move", authenticateJWT, forbiddenAdmin, ...validateMove, MoveController.makeMove);

//Storico mosse filtrato per data (formato JSON | pdf)
router.get("/:id/history", authenticateJWT, forbiddenAdmin, MoveController.getHistory);

export default router;