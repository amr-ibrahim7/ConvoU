import express from "express";
import { signup, login, logout ,updateProfile, getMyProfile, updatePassword } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();



router.post("/signup",  signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", protectRoute, getMyProfile);



router.put("/update", protectRoute, upload.single("profilePic"), updateProfile);

router.put("/update-password", protectRoute, updatePassword);



  export default router;