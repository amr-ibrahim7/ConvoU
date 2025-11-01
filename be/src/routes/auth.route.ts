import express, { RequestHandler } from "express";
import { signup, login, logout ,updateProfile, getMyProfile, updatePassword, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import passport from "passport";
import generateToken from "../utils/generateToken.js";

const router = express.Router();



router.post("/signup", arcjetProtection, signup);

router.post("/login",arcjetProtection, login);

router.post("/logout", arcjetProtection,logout);

router.get("/me", arcjetProtection, protectRoute as RequestHandler, getMyProfile as RequestHandler);
router.put("/update", arcjetProtection, protectRoute as RequestHandler, upload.single("profilePic"), updateProfile as RequestHandler);
router.put("/update-password", arcjetProtection, protectRoute as RequestHandler, updatePassword as RequestHandler);

router.get("/check", protectRoute as RequestHandler, checkAuth as RequestHandler);


router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));


router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google-auth-failed`,
    session: false,
  }),
  (req: any, res) => {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=authentication-failed`);
    }


    generateToken(req.user.id, res);
    

    res.redirect(`${process.env.CLIENT_URL}/mymessages`);
  }
);





  export default router;