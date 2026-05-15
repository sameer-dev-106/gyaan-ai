import { Router } from "express";
import { sendMessage } from "../controllers/chat.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { get } from "mongoose";

// Chat routes
const chatRouter = Router();

/**
 * All routes in this router require authentication
 */
chatRouter.use(authUser);

/**
 * @route POST /api/chats/message
 * @desc Send a message in a chat, if chatId is not provided, a new chat will be created
 * @access Private
 * @body { message, chat (optional) }
 */
chatRouter.post("/message", sendMessage);

/**
 * @route GET /api/chats
 * @desc Get all chats of the logged in user
 * @access Private
 */
chatRouter.get("/", getChats);

/**
 * @route GET /api/chats/:chatId/messages
 * @desc Get all messages in a chat
 * @access Private
 */
chatRouter.get("/:chatId/messages", getMessages);

/**
 * @route DELETE /api/chats/delete/:chatId
 * @desc Delete a chat and all its messages
 * @access Private
 */
chatRouter.delete("/delete/:chatId", deleteChat);

export default chatRouter;
