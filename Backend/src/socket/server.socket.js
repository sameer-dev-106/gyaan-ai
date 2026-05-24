import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: [
                "http://localhost:5173",
                "https://gyaan-ai-epi0.onrender.com"
            ],
            credentials: true,
        }
    });
    console.log("Socket.io server is RUNNING...");

    io.use((socket, next) => {
        try {
            const rawCookie = socket.handshake.headers.cookie || "";
            const tokenMatch = rawCookie.match(/(?:^|;\s*)token=([^;]+)/);
            const token = tokenMatch ? tokenMatch[1] : null;

            if (!token) {
                return next(new Error("Authentication error: No token"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.user?.id} (socket: ${socket.id})`);
        socket.join(socket.user.id);

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.user?.id}`);
        });
    });
}

export function getIo() {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
}