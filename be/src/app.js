import cors from "cors";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("backend is working!");
  });


  app.get("/api/auth/signup", (req, res) => {
    res.send("Signup endpoint");
  });

  app.get("/api/auth/login", (req, res) => {
    res.send("Login endpoint");
  });

 app.get("/api/auth/logout", (req, res) => {
    res.send("Logout endpoint");
  });


  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    console.log(`running!! on port ${PORT}`);
  });