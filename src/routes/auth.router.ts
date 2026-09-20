import { Router } from "express";
import * as AuthController from "../controllers/auth.controllers";
import { validateLogin, validateRegister } from "../middlewares/validatorMiddleware";

const router = Router();

router.post("/login",validateLogin,AuthController.login);
router.post("/register",validateRegister, AuthController.register);
export default router;