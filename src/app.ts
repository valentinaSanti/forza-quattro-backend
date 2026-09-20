import express from "express";
import dotenv from 'dotenv';
import authRoute from "./routes/auth.router";
import matchRoute from "./routes/match.route";
import adminRoute from "./routes/admin.route";
import { errorHandler } from "./middlewares/errorHandler";
import leaderboardRoute from "./routes/leaderboard.route";

// caricamento delle variabili di ambiente
dotenv.config();

const app = express(); 
app.use(express.json());

app.use("/api/v1/auth",authRoute);
app.use("/api/v1/matches",matchRoute);
app.use("/api/v1/leaderboard",leaderboardRoute);
app.use("/api/v1/admin", adminRoute);

app.use(errorHandler);
export default app;