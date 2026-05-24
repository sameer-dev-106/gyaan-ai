import { initializeSocketConnection, getSocket } from "../services/chat.socket";
import { sendMessageApi, getChatsApi, getMessagesApi, deleteChatApi } from "../services/chat.api";
import { useDispatch, useSelector } from "react-redux";
import {
    createNewChat,
    addNewMessage,
    addMessages,
    startStreamingMessage,
    appendStreamChunk,
    endStreamingMessage,
    setChats,
    setCurrentChatId,
    setError,
    setLoading,
    setTokenLimitError,
    deleteChat,
    clearCurrentChat
} from "../chat.slice";
import { updateTokenUsage } from "../../auth/auth.slice";

export const useChat = () => {
    const chats = useSelector((state) => state.chat.chats);
    const dispatch = useDispatch();

    function registerSocketEvents() {
        const socket = getSocket();
        if (!socket) return;

        socket.off("ai:stream:start");
        socket.off("ai:chunk");
        socket.off("ai:stream:end");
        socket.off("ai:stream:error");

        socket.on("ai:stream:start", ({ chatId, newChat, userMessage }) => {
            if (newChat && !chats[newChat._id]) {
                dispatch(createNewChat({ chatId: newChat._id, title: newChat.title }));
                dispatch(addNewMessage({ chatId: newChat._id, content: userMessage, role: "user" }));
                dispatch(setCurrentChatId(newChat._id));
            }
            dispatch(startStreamingMessage({ chatId }));
        });

        socket.on("ai:chunk", ({ chatId, chunk }) => {
            dispatch(appendStreamChunk({ chatId, chunk }));
        });

        socket.on("ai:stream:end", ({ chatId, tokensUsed, tokenLimit }) => {
            dispatch(endStreamingMessage({ chatId }));
            dispatch(setLoading(false));
            // Update token usage in auth state
            if (tokensUsed !== undefined) {
                dispatch(updateTokenUsage({ tokensUsed, tokenLimit }));
            }
        });

        socket.on("ai:stream:error", ({ chatId, error }) => {
            dispatch(endStreamingMessage({ chatId }));
            dispatch(setError(error));
            dispatch(setLoading(false));
        });
    }

    async function handleSendMessage({ message, chatId }) {
        if (!message?.trim()) return;
        dispatch(setLoading(true));
        dispatch(setTokenLimitError(false));

        const targetChatId = chatId || null;

        if (targetChatId && chats[targetChatId]) {
            dispatch(addNewMessage({ chatId: targetChatId, content: message, role: "user" }));
        }

        try {
            const response = await sendMessageApi({ message, chatId: targetChatId });
            const { chatId: resolvedChatId } = response.data;

            if (targetChatId) {
                dispatch(setCurrentChatId(resolvedChatId));
            }

        } catch (err) {
            // Token limit error (429)
            if (err?.response?.status === 429) {
                dispatch(setTokenLimitError(true));
                dispatch(setError(err?.response?.data?.message || "Daily token limit reached"));
            } else {
                dispatch(setError(err?.message || "Something went wrong"));
            }
            dispatch(setLoading(false));
            return { success: false, error: err };
        }
        // setLoading(false) → socket "ai:stream:end" pe hoga
    }

    async function handleGetChats() {
        dispatch(setLoading(true));
        try {
            const response = await getChatsApi();
            const chats = response.data.chat;
            dispatch(setChats(chats.reduce((acc, chat) => {
                acc[chat._id] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdate: chat.updatedAt,
                };
                return acc;
            }, {})));
        } catch (err) {
            dispatch(setError(err?.message || "Something went wrong"));
            return { success: false, error: err };
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleOpenChat(chatId, chats) {
        try {
            dispatch(setCurrentChatId(chatId));
            if (chats[chatId]?.messages.length === 0) {
                const response = await getMessagesApi(chatId);
                const { messages } = response.data;
                const formattedMessages = messages.map(msg => ({ content: msg.content, role: msg.role }));
                dispatch(addMessages({ chatId, messages: formattedMessages }));
            }
        } catch (err) {
            dispatch(setError(err?.message || "Something went wrong"));
            return { success: false, error: err };
        }
    }

    async function handleDeleteChat(chatId) {
        try {
            await deleteChatApi({ chatId });
            dispatch(deleteChat(chatId));
        } catch (err) {
            dispatch(setError(err?.message || "Delete failed"));
            return { success: false, error: err };
        }
    }

    function handleNewChat() {
        dispatch(clearCurrentChat());
    }

    return {
        initializeSocketConnection,
        registerSocketEvents,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleDeleteChat,
        handleNewChat,
    };
};
