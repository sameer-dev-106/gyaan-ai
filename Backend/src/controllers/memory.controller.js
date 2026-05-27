import {
    getOrCreateMemory,
    updateUserPreferences,
    clearUserFacts,
} from "../services/memory.service.js";
import userModel from "../models/user.model.js";

/**
 * @route GET /api/memory
 * @desc Get current user's memory (preferences + facts)
 * @access Private
 */
export async function getMemory(req, res, next) {
    try {
        const memory = await getOrCreateMemory(req.user.id);
        res.status(200).json({ success: true, memory });
    } catch (err) {
        next(err);
    }
}

/**
 * @route PUT /api/memory/preferences
 * @desc Update user preferences (fullName, profession, language, etc.)
 * @access Private
 * @body { fullName, profession, location, language, responseStyle, interests }
 */
export async function updatePreferences(req, res, next) {
    try {
        const { fullName, dateOfBirth, profession, location, language, responseStyle, interests } = req.body;
        const memory = await updateUserPreferences(req.user.id, {
            fullName, dateOfBirth, profession, location, language, responseStyle, interests,
        });
        await userModel.findByIdAndUpdate(req.user.id, { profileCompleted: true });
        res.status(200).json({ success: true, message: "Preferences updated!", memory });
    } catch (err) {
        next(err);
    }
}

/**
 * @route DELETE /api/memory/facts
 * @desc Clear all AI-extracted facts (keep preferences)
 * @access Private
 */
export async function clearFacts(req, res, next) {
    try {
        const memory = await clearUserFacts(req.user.id);
        res.status(200).json({ success: true, message: "AI memory cleared!", memory });
    } catch (err) {
        next(err);
    }
}