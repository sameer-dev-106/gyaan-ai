import { config } from "../config/config.js";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain";
import { searchInternet } from "./internet.service.js";
import * as z from "zod";

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: config.MISTRAL_API_KEY
});

const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",
        description: "Use this tool to get latest information from the internet.",
        schema: z.object({
            query: z.string().describe("The search query to look up on the internet.")
        })
    }
);

const agent = createAgent({ model: mistralModel, tools: [searchInternetTool] });

const SYSTEM_PROMPT = `You are a helpful and precise assistant for answering questions.
If you don't know the answer, say you don't know.
If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.`;

function buildMessages(messages) {
    return [
        new SystemMessage(SYSTEM_PROMPT),
        ...messages.map(msg => {
            if (msg.role === "user") return new HumanMessage(msg.content);
            if (msg.role === "ai") return new AIMessage(msg.content);
        }).filter(Boolean)
    ];
}


export const generateResponseStream = async (messages, onChunk) => {
    try {
        const langchainMessages = buildMessages(messages);
        let fullText = "";
        const stream = await mistralModel.stream(langchainMessages);
        for await (const chunk of stream) {
            const text = chunk.content;
            if (typeof text === "string" && text) {
                fullText += text;
                onChunk(text);
            }
        }
        if (!fullText.trim()) {
            console.log("Stream empty — falling back to agent.invoke() for tool use");
            const result = await agent.invoke({ messages: langchainMessages });
            const finalMsg = result.messages[result.messages.length - 1];
            fullText = finalMsg.content || finalMsg.text || "";
            if (fullText) onChunk(fullText); 
        }
        if (!fullText.trim()) {
            throw new Error("AI returned empty response");
        }
        return fullText;
    } catch (err) {
        console.error("generateResponseStream error:", err);
        throw new Error("Failed to generate AI response: " + err.message);
    }
};

export const generateChatTitle = async (message) => {
    try {
        const response = await mistralModel.invoke([
            new SystemMessage(`You are a helpful assistant that generates concise and descriptive titles for chat conversations.
User will provide you with the first message of a chat, and you will generate a title in 2-4 words. Be clear and relevant.`),
            new HumanMessage(`Generate a title for this first message: "${message}"`)
        ]);
        return response.content || response.text;
    } catch (error) {
        console.error("Error generating chat title:", error);
        throw new Error("Failed to generate chat title");
    }
};