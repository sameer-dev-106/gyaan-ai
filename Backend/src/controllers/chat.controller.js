import { generateChatTitle, generateResponseStream } from "../services/ai.service.js";
import { extractAndSaveFacts } from "../services/memory.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import userModel from "../models/user.model.js";
import { getIo } from "../socket/server.socket.js";

// Rough token estimator (~4 chars per token)
function estimateTokens(text) {
    return Math.ceil((text || "").length / 4);
}

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

        const user = await userModel.findById(userId);
        user.checkAndResetDailyTokens();

        const tokensLeft = user.tokenLimit - user.tokensUsed;
        if (tokensLeft <= 0) {
            await user.save();
            return res.status(429).json({
                success: false,
                message: "Daily token limit reached. Please wait 24 hours or upgrade your plan.",
                tokensUsed: user.tokensUsed,
                tokenLimit: user.tokenLimit,
            });
        }

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
            fullResponse = await generateResponseStream(
                messages,
                (chunk) => {
                    io.to(userId).emit("ai:chunk", { chatId: resolvedChatId, chunk });
                },
                user.username,
                userId
            );

            if (!fullResponse.trim()) {
                throw new Error("AI returned empty response");
            }

            await messageModel.create({
                chat: resolvedChatId,
                content: fullResponse,
                role: "ai",
            });

            const tokensConsumed = estimateTokens(message) + estimateTokens(fullResponse);
            user.tokensUsed = Math.min(user.tokensUsed + tokensConsumed, user.tokenLimit);
            await user.save();

            io.to(userId).emit("ai:stream:end", {
                chatId: resolvedChatId,
                tokensUsed: user.tokensUsed,
                tokenLimit: user.tokenLimit,
            });

            extractAndSaveFacts(userId, message, fullResponse).catch(err =>
                console.error("Background memory extraction failed:", err.message)
            );

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

/**
 * @route DELETE /api/chats/:chatId/messages/:messageId
 * @desc  Delete a message AND all messages that came after it (same chat)
 *        This is used when user deletes their own message — the AI reply
 *        and everything below it should also be removed.
 * @access Private
 */
export async function deleteMessageFrom(req, res, next) {
    try {
        const { chatId, messageId } = req.params;

        const chat = await chatModel.findOne({ _id: chatId, user: req.user.id });
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        const targetMessage = await messageModel.findOne({ _id: messageId, chat: chatId });
        if (!targetMessage) return res.status(404).json({ message: "Message not found" });

        const deletedResult = await messageModel.deleteMany({
            chat: chatId,
            createdAt: { $gte: targetMessage.createdAt },
        });

        res.status(200).json({
            message: "Message and subsequent messages deleted successfully.",
            deletedCount: deletedResult.deletedCount,
        });
    } catch (err) {
        next(err);
    }
}
