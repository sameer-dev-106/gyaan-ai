import { io } from "socket.io-client";

export const initializeSocketConnection = () => {
    const socket = io("https://gyaan-ai-epi0.onrender.com", {
        withCredentials:true
    });

    socket.on("connect", () => {
        console.log("Connected to Socket.io server");
    });
}

