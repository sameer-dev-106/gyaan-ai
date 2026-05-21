import dotenv from "dotenv";

dotenv.config()

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables")
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables")
}

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not defined in environment variables")
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is not defined in environment variables")
}

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_USER_EMAIL: process.env.GOOGLE_USER_EMAIL,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    BASE_URL: process.env.BASE_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    TAVILY_API_KEY: process.env.TAVILY_API_KEY
}