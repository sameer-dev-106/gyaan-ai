import { config } from "../config/config.js";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { searchInternet } from "./internet.service.js";
import { buildMemoryPromptBlock } from "./memory.service.js";

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: config.MISTRAL_API_KEY,
});

const tools = [
    {
        type: "function",
        function: {
            name: "searchInternet",
            description: "Use this to get real-time or up-to-date information from the internet. Use it for current events, today's date, recent news, current leaders/positions, prices, weather, or anything that may have changed recently.",
            parameters: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "The search query to look up on the internet.",
                    },
                },
                required: ["query"],
            },
        },
    },
];

const modelWithTools = mistralModel.bindTools(tools);


async function buildSystemPrompt(username, userId) {
    let prompt = `You are Gyaan AI, a helpful and precise assistant for answering questions.
The user you are talking to is named "${username}". Address them by name occasionally to make the conversation feel personal.
If you don't know the answer, say you don't know.
IMPORTANT: For any question about current date/time, recent news, current leaders, current events, prices, or anything that may have changed — you MUST use the "searchInternet" tool. Do not guess from training data.`;

    if (userId) {
        const memoryBlock = await buildMemoryPromptBlock(userId);
        if (memoryBlock) {
            prompt += `\n\nUse the following known information about this user to personalize your responses:${memoryBlock}`;
        }
    }

    return prompt;
}

function buildMessages(messages, systemPrompt) {
    return [
        new SystemMessage(systemPrompt),
        ...messages.map((msg) => {
            if (msg.role === "user") return new HumanMessage(msg.content);
            if (msg.role === "ai") return new AIMessage(msg.content);
        }).filter(Boolean),
    ];
}

async function runAgentLoop(langchainMessages) {
    let messages = [...langchainMessages];
    const MAX_ITERATIONS = 5;

    for (let i = 0; i < MAX_ITERATIONS; i++) {
        const response = await modelWithTools.invoke(messages);
        messages.push(response);

        const toolCalls = response.tool_calls || [];
        if (toolCalls.length === 0) {
            return response.content || "";
        }

        for (const toolCall of toolCalls) {
            console.log(`[Agent] Calling tool: ${toolCall.name} with query: ${toolCall.args?.query}`);
            let toolResult;
            try {
                if (toolCall.name === "searchInternet") {
                    toolResult = await searchInternet({ query: toolCall.args.query });
                } else {
                    toolResult = `Tool "${toolCall.name}" not found.`;
                }
            } catch (err) {
                toolResult = `Tool error: ${err.message}`;
                console.error(`[Agent] Tool error:`, err.message);
            }

            messages.push(
                new ToolMessage({
                    content: toolResult,
                    tool_call_id: toolCall.id,
                })
            );
        }
    }

    throw new Error("Agent loop exceeded max iterations");
}

/**
 * Generate a streaming AI response.
 * Note: Tool calls can't be truly streamed, so we run the agent loop first,
 * then stream the final answer for a smooth UX.
 */
export const generateResponseStream = async (messages, onChunk, username = "there", userId = null) => {
    try {
        const systemPrompt = await buildSystemPrompt(username, userId);
        const langchainMessages = buildMessages(messages, systemPrompt);

        const fullText = await runAgentLoop(langchainMessages);

        if (!fullText.trim()) {
            throw new Error("AI returned empty response");
        }

        onChunk(fullText);
        return fullText;
    } catch (err) {
        console.error("generateResponseStream error:", err);
        throw new Error("Failed to generate AI response: " + err.message);
    }
};

export const generateChatTitle = async (message) => {
    try {
        const response = await mistralModel.invoke([
            new SystemMessage(
                `You are a helpful assistant that generates concise and descriptive titles for chat conversations.
User will provide you with the first message of a chat, and you will generate a title in 2-4 words. Be clear and relevant.`
            ),
            new HumanMessage(`Generate a title for this first message: "${message}"`),
        ]);
        return response.content || response.text;
    } catch (error) {
        console.error("Error generating chat title:", error);
        throw new Error("Failed to generate chat title");
    }
};
