import userMemoryModel from '../models/usermemory.model.js';
import { config } from '../config/config.js';
import { ChatMistralAI } from '@langchain/mistralai';
import { HumanMessage, SystemMessage } from 'langchain';

const mistralModel = new ChatMistralAI({
    model: 'mistral-small-latest',
    apiKey: config.MISTRAL_API_KEY,
});

export async function getOrCreateMemory(userId) {
    let memory = await userMemoryModel.findOne({ user: userId });
    if (!memory) {
        memory = await userMemoryModel.create({ user: userId });
    }
    return memory;
}

export async function buildMemoryPromptBlock(userId) {
    const memory = await getOrCreateMemory(userId);
    const memStr = memory.toPromptString();
    if (!memStr.trim()) return '';

    return `\n\n── What you know about this user ──\n${memStr}\n──────────────────────────────────`;
}

export async function extractAndSaveFacts(userId, userMessage, aiResponse) {
    try {
        const memory = await getOrCreateMemory(userId);
        const existingFacts = memory.facts.map(f => `${f.key}: ${f.value}`).join('\n') || 'None yet.';
        const prompt = `You are a memory extraction assistant.

Below is a conversation snippet:
User: "${userMessage}"
AI: "${aiResponse}"

Existing known facts about this user:
${existingFacts}

Extract any NEW factual information about the user from this conversation (profession, skills, projects, preferences, location, goals, etc.).
Return ONLY a JSON array of objects like:
[{ "key": "fact name", "value": "fact value" }]

Rules:
- Only extract facts explicitly stated by the USER, not the AI.
- Skip facts already covered in existing facts.
- If nothing new, return: []
- Max 5 new facts per call.
- Keep values short (under 15 words).

Return ONLY valid JSON, no explanation.`;

        const result = await mistralModel.invoke([
            new SystemMessage('You extract factual user information from conversations. Return only JSON.'),
            new HumanMessage(prompt),
        ]);

        const raw = result.content || result.text || '[]';
        const clean = raw.replace(/```json|```/g, '').trim();
        const newFacts = JSON.parse(clean);

        if (!Array.isArray(newFacts) || newFacts.length === 0) return;

        newFacts.forEach(({ key, value }) => {
            if (!key || !value) return;
            const existing = memory.facts.find(f => f.key.toLowerCase() === key.toLowerCase());
            if (existing) {
                existing.value = value;
                existing.updatedAt = new Date();
            } else {
                memory.facts.push({ key, value, updatedAt: new Date() });
            }
        });

        if (memory.facts.length > 30) {
            memory.facts = memory.facts.slice(-30);
        }

        memory.lastExtractedAt = new Date();
        await memory.save();

    } catch (err) {
        console.error('Memory extraction error:', err.message);
    }
}

export async function updateUserPreferences(userId, preferences) {
    const memory = await getOrCreateMemory(userId);

    const allowed = ['fullName', 'dateOfBirth', 'profession', 'location', 'language', 'responseStyle', 'interests'];
    allowed.forEach(key => {
        if (preferences[key] !== undefined) {
            memory.preferences[key] = preferences[key];
        }
    });

    await memory.save();
    return memory;
}

export async function clearUserFacts(userId) {
    const memory = await getOrCreateMemory(userId);
    memory.facts = [];
    memory.lastExtractedAt = null;
    await memory.save();
    return memory;
}