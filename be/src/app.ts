import cors from "cors";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";


import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";


dotenv.config();
const app: Application = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT: number = parseInt(process.env.PORT || "3001", 10);

// app.use(cors({
//   credentials: true,
//   origin: true 
// }));


app.use(cors());


app.use(express.json());
app.use(cookieParser());


app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Development Backend!");
});


app.get("/api/test", (req: Request, res: Response) => {
    res.status(200).json({ message: "Backend is working!" });
});
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../fe/out")));

app.get(/^(?!\/api).*/, (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, "../fe", "out", "index.html"));
});
}


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});