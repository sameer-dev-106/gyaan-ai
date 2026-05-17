import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessageApi, getChatsApi, getMessagesApi, deleteChatApi } from "../services/chat.api";
import { useDispatch, useSelector } from "react-redux";
import { createNewChat, addNewMessage, setChats, setCurrentChatId, setError, setLoading, addMessages, deleteChat, clearCurrentChat } from "../chat.slice";


export const useChat = () => {

    const chats = useSelector((state) => state.chat.chats);
    const dispatch = useDispatch();

    async function handleSendMessage({ message, chatId }) {
        if (!message?.trim()) return;
        dispatch(setLoading(true))
        const targetChatId = chatId || null;
        if (targetChatId && chats[targetChatId]) {
            dispatch(addNewMessage({ chatId: targetChatId, content: message, role: "user" }));
        }

        try {
            const response = await sendMessageApi({ message, chatId: targetChatId });
            const { chat, aiMessage } = response.data;
            const resolvedChatId = chat?._id || targetChatId;
            if (chat?._id && !chats[chat._id]) {
                dispatch(createNewChat({ chatId: chat._id, title: chat.title }));
                dispatch(addNewMessage({ chatId: chat._id, content: message, role: "user" }));
            }
            dispatch(addNewMessage({ chatId: resolvedChatId, content: aiMessage.content, role: aiMessage.role }));
            dispatch(setCurrentChatId(resolvedChatId));
        } catch (err) {
            dispatch(setError(err?.message || "Something went wrong"));
            return { success: false, error: err };
        } finally {
            dispatch(setLoading(false));
        }
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
                }
                return acc
            }, {})));
        } catch (err) {
            dispatch(setError(err?.message || "Something went wrong"));
            return { success: false, error: err }
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
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleDeleteChat,
        handleNewChat,
    }
}
