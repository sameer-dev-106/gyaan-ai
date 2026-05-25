import { Router } from "express";
import { getMemory, updatePreferences, clearFacts } from "../controllers/memory.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const memoryRouter = Router();

// All memory routes require auth
memoryRouter.use(authUser);

/**
 * @route GET /api/memory
 * @desc Get current user's full memory doc
 */
memoryRouter.get("/", getMemory);

/**
 * @route PUT /api/memory/preferences
 * @desc Update user preferences
 * @body { fullName, profession, location, language, responseStyle, interests }
 */
memoryRouter.put("/preferences", updatePreferences);

/**
 * @route DELETE /api/memory/facts
 * @desc Clear all AI-extracted facts for the user
 */
memoryRouter.delete("/facts", clearFacts);

export default memoryRouter;