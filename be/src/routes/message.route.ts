import express, { RequestHandler } from "express";
import { getAllContacts, getConversations, getMessages, sendMessage } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();


// the middlewares execute in order so requests get rate-limited first, then authenticated.
// this is actually more efficient since unauthenticated requests get blocked by rate limiting
// before hitting the auth middleware.

router.use(protectRoute as RequestHandler);

router.get("/contacts", getAllContacts as RequestHandler);
router.get("/conversations", getConversations as RequestHandler);
router.get("/:id", getMessages as RequestHandler);
// router.post("/send/:id", sendMessage as RequestHandler);
router.post("/send/:id", upload.single('image'), sendMessage as RequestHandler);




  export default router;