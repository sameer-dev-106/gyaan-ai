import { generateChatTitle, generateResponseStream } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { getIo } from "../socket/server.socket.js";

/**
 * @route POST /api/chats/message
 * @desc Save user msg, return chatId immediately, then stream AI via socket
 * @access Private
 * @body { message, chat (optional chatId) }
 */
export async function sendMessage(req, res, next) {
    try {
        const { message, chat: chatId } = req.body;
        const userId = req.user.id;
        const io = getIo();
        let newChat = null;
        if (!chatId) {
            const title = await generateChatTitle(message);
            newChat = await chatModel.create({ user: userId, title });
        }
        const resolvedChatId = chatId || newChat._id.toString();
        await messageModel.create({
            chat: resolvedChatId,
            content: message,
            role: "user",
        });
        const messages = await messageModel.find({ chat: resolvedChatId });
        res.status(201).json({
            success: true,
            chatId: resolvedChatId,
            chat: newChat ? { _id: newChat._id, title: newChat.title } : null,
        });
        io.to(userId).emit("ai:stream:start", {
            chatId: resolvedChatId,
            newChat: newChat ? { _id: newChat._id, title: newChat.title } : null,
            userMessage: message,
        });
        let fullResponse = "";
        try {
            fullResponse = await generateResponseStream(messages, (chunk) => {
                io.to(userId).emit("ai:chunk", { chatId: resolvedChatId, chunk });
            });
            if (!fullResponse.trim()) {
                throw new Error("AI returned empty response");
            }
            await messageModel.create({
                chat: resolvedChatId,
                content: fullResponse,
                role: "ai",
            });
            io.to(userId).emit("ai:stream:end", { chatId: resolvedChatId });
        } catch (streamErr) {
            console.error("Streaming error:", streamErr);
            io.to(userId).emit("ai:stream:error", {
                chatId: resolvedChatId,
                error: "AI response generation failed",
            });
        }
    } catch (err) {
        next(err);
    }
}

/**
 * @route GET /api/chats
 */
export async function getChats(req, res, next) {
    try {
        const chat = await chatModel.find({ user: req.user.id });
        res.status(200).json({ message: "Chat retrieved successfully.", chat });
    } catch (err) {
        next(err);
    }
}

/**
 * @route GET /api/chats/:chatId/messages
 */
export async function getMessages(req, res, next) {
    try {
        const { chatId } = req.params;
        const chat = await chatModel.findOne({ _id: chatId, user: req.user.id });
        if (!chat) return res.status(404).json({ message: "chat not found" });
        const messages = await messageModel.find({ chat: chatId });
        res.status(200).json({ message: "Messages retrieved successfully.", messages });
    } catch (err) {
        next(err);
    }
}

/**
 * @route DELETE /api/chats/delete/:chatId
 */
export async function deleteChat(req, res, next) {
    try {
        const { chatId } = req.params;
        const chat = await chatModel.findOneAndDelete({ _id: chatId, user: req.user.id });
        await messageModel.deleteMany({ chat: chatId });
        if (!chat) return res.status(404).json({ message: "chat not found" });
        res.status(200).json({ message: "Chat deleted successfully." });
    } catch (err) {
        next(err);
    }
}