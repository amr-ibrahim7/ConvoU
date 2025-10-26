import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import path from 'path';
dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("backend is working!");
  });


  app.use("/api/auth", authRoutes);
  app.use("/api/message", messageRoutes);


  const PORT = process.env.PORT || 3001;



  // make ready for development

  if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "../fe/out")))
  }

  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../fe", "out", "index.html"))
  })

  app.listen(PORT, () => {
    console.log(`running!! on port ${PORT}`);
  });