import { Router } from "express";
import { sendMessage } from "../controllers/chat.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const chatRouter = Router();

// /api/chats/message
// /api/chats
chatRouter.post("/message", authUser, sendMessage)

export default chatRouter;
