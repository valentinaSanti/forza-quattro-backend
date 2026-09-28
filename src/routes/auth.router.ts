import { Router } from "express";
import * as AuthController from "../controllers/auth.controllers";
import { validateLogin, validateRegister } from "../middlewares/validatorMiddleware";

const router = Router();

// rotta login utente
router.post("/login",validateLogin,AuthController.login);

//rotta registrazione utente
router.post("/register",validateRegister, AuthController.register);

export default router;