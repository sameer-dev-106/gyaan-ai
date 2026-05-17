import { generateChatTitle, generateResponse } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

/**
 * @route POST /api/chats/message
 * @desc Send a message in a chat, if chatId is not provided, a new chat will be created
 * @access Private
 * @body { message, chat (optional) }
 */
export async function sendMessage(req, res, next) {
    try {
        const { message, chat: chatId } = req.body;
        let title = null, chat = null;
        if (!chatId) {
            title = await generateChatTitle(message);
            chat = await chatModel.create({
                user: req.user.id,
                title
            });
        }
        const userMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: message,
            role: "user",
        });
        const messages = await messageModel.find({ chat: chatId || chat._id});
        const result = await generateResponse(messages);
        const aiMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: result,
            role: "ai",
        });
        res.status(201).json({
            title,
            chat,
            aiMessage
        });
    } catch (err) {
        next(err);
    }
}

/**
 * @route GET /api/chats
 * @desc Get all chats of the logged in user
 * @access Private
 */
export async function getChats(req, res, next) {
    try {
        const user = req.user;
        const chat = await chatModel.find({ user: user.id });
        res.status(200).json({
            message: "Chat retrieved successfully.",
            chat
        })
    } catch (err) {
        next(err);
    }
}

/**
 * @route GET /api/chats/:chatId/messages
 * @desc Get all messages in a chat
 * @access Private
 */
export async function getMessages(req, res, next) {
    try {
        const { chatId } = req.params;
        const chat = await chatModel.findOne({ _id: chatId, user: req.user.id });
        if (!chat) return res.status(404).json({ message: "chat not found" });
        const messages = await messageModel.find({ chat: chatId });
        res.status(200).json({
            message: "Messages retrieved successfully.",
            messages
        })
    } catch (err) {
        next(err);
    }
}

/**
 * @route DELETE /api/chats/delete/:chatId
 * @desc Delete a chat and all its messages
 * @access Private
 */
export async function deleteChat(req, res, next) {
    try {
        const { chatId } = req.params;
        const chat = await chatModel.findOneAndDelete({ _id: chatId, user: req.user.id });
        await messageModel.deleteMany({ chat: chatId });
        if (!chat) return res.status(404).json({ message: "chat not found" });
        res.status(200).json({
            message: "Chat deleted successfully."
        })
    } catch (err) {
        next(err);
    }
}
