import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        isStreaming: false,
        error: null,
        tokenLimitError: false,
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload;
            state.chats[chatId] = {
                id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString(),
            };
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages.push({ content, role });
            }
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages.push(...messages);
            }
        },
        startStreamingMessage: (state, action) => {
            const { chatId } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages.push({ content: "", role: "ai", isStreaming: true });
                state.isStreaming = true;
            }
        },
        appendStreamChunk: (state, action) => {
            const { chatId, chunk } = action.payload;
            if (!state.chats[chatId]) return;
            const messages = state.chats[chatId].messages;
            const lastMsg = messages[messages.length - 1];
            if (lastMsg?.isStreaming) {
                lastMsg.content += chunk;
            }
        },
        endStreamingMessage: (state, action) => {
            const { chatId } = action.payload;
            if (!state.chats[chatId]) return;
            const messages = state.chats[chatId].messages;
            const lastMsg = messages[messages.length - 1];
            if (lastMsg?.isStreaming) {
                delete lastMsg.isStreaming;
            }
            state.isStreaming = false;
        },
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setTokenLimitError: (state, action) => {
            state.tokenLimitError = action.payload;
        },
        deleteChat: (state, action) => {
            const chatId = action.payload;
            delete state.chats[chatId];
            if (state.currentChatId === chatId) {
                state.currentChatId = null;
            }
        },
        clearCurrentChat: (state) => {
            state.currentChatId = null;
        },
        deleteMessagesFrom: (state, action) => {
            const { chatId, fromIndex } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages.splice(fromIndex);
            }
        },
        deleteMessage: (state, action) => {
            const { chatId, msgIndex } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages.splice(msgIndex, 1);
            }
        },
        updateMessage: (state, action) => {
            const { chatId, msgIndex, content } = action.payload;
            if (state.chats[chatId]?.messages[msgIndex]) {
                state.chats[chatId].messages[msgIndex].content = content;
            }
        },
    }
});

export const {
    createNewChat,
    addNewMessage,
    addMessages,
    startStreamingMessage,
    appendStreamChunk,
    endStreamingMessage,
    setChats,
    setCurrentChatId,
    setLoading,
    setError,
    setTokenLimitError,
    deleteChat,
    clearCurrentChat,
    deleteMessagesFrom,
    deleteMessage,
    updateMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
