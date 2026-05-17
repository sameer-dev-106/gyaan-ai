import axios from "axios";


const API = axios.create({
    baseURL: "http://localhost:3000/api/chats",
    withCredentials: true,
});

export const sendMessageApi = async ({message, chatId}) => {
    try {
        const response = await API.post("/message", { message, chat: chatId });
        return { success: true, data: response.data };
    } catch (err) {
        throw err.response?.data?.message || "Something went wrong";
    }
}

export const getChatsApi = async () => {
    try {
        const response = await API.get("/");
        return { success: true, data: response.data };
    } catch (err) {
        throw err.response?.data?.message || "Something went wrong";
    }
}

export const getMessagesApi = async (chatId) => {
    try {
        const response = await API.get(`/${chatId}/messages`);
        return { success: true, data: response.data };
    } catch (err) {
        throw err.response?.data?.message || "Something went wrong";
    }
}

export const deleteChatApi = async ({chatId}) => {
    try {
        const response = await API.delete(`/delete/${chatId}`);
        return { success: true, data: response.data };
    } catch (err) {
        throw err.response?.data?.message || "Something went wrong";
    }
}

