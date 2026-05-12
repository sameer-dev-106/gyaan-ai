import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

import authRouter from "./routes/auth.routes.js";
import handleError from "./middlewares/error.middleware.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

// Health check route
app.get("/", (req, res) => {
    res.json({message: "server is running"});
});

app.use("/api/auth", authRouter);

// Error handling middleware
app.use(handleError);

export default app;