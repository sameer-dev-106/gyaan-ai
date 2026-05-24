import { io } from "socket.io-client";

let socket = null;

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const initializeSocketConnection = () => {
    if (socket?.connected) return socket;
    socket = io(BACKEND_URL, {
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
