import express from "express";
import { sendMessage, getMessages } from "../controllers/chatController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/message",  sendMessage);
router.get("/messages",  getMessages);

export default router;
