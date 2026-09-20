
//Rotta per caricare i token
import { Router } from "express";
import * as AdminController from "../controllers/admin.controller";
import { authenticateJWT, requireAdmin } from "../middlewares/authMiddleware";
import { validateRecharge } from "../middlewares/validatorMiddleware";

const router = Router();
router.post("/recharge", authenticateJWT, requireAdmin, ...validateRecharge, AdminController.rechargeTokens);

export default router;