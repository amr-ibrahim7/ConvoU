import express, { RequestHandler } from "express";
import { generateInsight } from "../controllers/insights.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:conversationId", protectRoute as RequestHandler, generateInsight);

export default router;