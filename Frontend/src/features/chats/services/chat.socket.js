import { io } from "socket.io-client";

let socket = null;

export const initializeSocketConnection = () => {
    if (socket?.connected) return socket;
    socket = io("https://gyaan-ai-epi0.onrender.com", {
        withCredentials:true
    });
    socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
    });
    socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
    });
    socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
    });
    return socket;
}

export const getSocket = () => socket;
