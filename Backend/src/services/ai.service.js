import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage } from "langchain";
import { config } from "../config/config.js";

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: config.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: config.MISTRAL_API_KEY
});

export const generateResponse = async (messages) => {
    try {
        const response = await geminiModel.invoke(messages.map(msg => {
            if (msg.role == "user") {
                return new HumanMessage(msg.content);
            } else if (msg.role == "ai") {
                return new AIMessage(msg.content);
            }
        }));
        return response.text;
    } catch (error) {
        console.error("Error generating Gemini AI response:", error);
        // throw new Error("Failed to generate Gemini AI response");
    }
}

export const generateChatTitle = async (message) => {
    try {
        const response = await mistralModel.invoke([
            new SystemMessage(`
                You are a helpful assistant that generates concise and descriptive titles for chat conversations.
                
                User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.    
            `),
            new HumanMessage(`
                Generate a title for a chat conversation based on the following first message:
                "${message}"
            `)
        ]);

        return response.text;

    } catch (error) {
        console.error("Error generating Mistral AI response:", error);
        throw new Error("Failed to generate Mistral AI response");
    }
}
