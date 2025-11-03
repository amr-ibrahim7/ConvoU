
import cors from "cors";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import passport from "passport";
import './lib/passport.js';


import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import insightsRoutes from "./routes/insights.route.js";
import { app, server } from "./lib/socket.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/insights", insightsRoutes); 

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../fe/out")));

app.get(/^(?!\/api).*/, (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, "../fe", "out", "index.html"));
});
}

// Server Initialization
const PORT: number = parseInt(process.env.PORT || "3001", 10);
server.listen(PORT, () => {
    console.log(`Server with Socket.IO is running on port ${PORT}`);
});