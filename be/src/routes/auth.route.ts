import express from "express";
import { signup, login, logout ,updateProfile, getMyProfile, updatePassword } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();



router.post("/signup", arcjetProtection, signup);

router.post("/login",arcjetProtection, login);

router.post("/logout", arcjetProtection,logout);

router.get("/me", arcjetProtection, protectRoute, getMyProfile);



router.put("/update", arcjetProtection, protectRoute, upload.single("profilePic"), updateProfile);

router.put("/update-password", arcjetProtection, protectRoute, updatePassword);



  export default router;