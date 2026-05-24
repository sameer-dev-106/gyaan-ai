import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import handleError from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://gyaan-ai-epi0.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.static(path.join(__dirname, "../public")));

// Health check route
app.get("/", (req, res) => {
    res.json({ message: "server is running" });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

// Frontend
app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});


// Error handling middleware
app.use(handleError);

export default app;