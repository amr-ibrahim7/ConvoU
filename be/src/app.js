import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("backend is working!");
  });


  app.use("/api/auth", authRoutes);
  app.use("/api/message", messageRoutes);


  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    console.log(`running!! on port ${PORT}`);
  });