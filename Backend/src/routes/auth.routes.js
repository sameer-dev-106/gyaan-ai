import { Router } from "express";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { register,  login, getMe, verifyEmail } from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register", registerValidator, register);

/**
 * @route GET /api/auth/verify-email?token=...
 * @desc Verify user's email address
 * @access Public
 */
authRouter.get("/verify-email", verifyEmail);

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 * @body { email, password }
 */
authRouter.post("/login", loginValidator, login);

/**
 * @route GET /api/auth/me
 * @desc Get current logged in user's info
 * @access Private
 */
authRouter.get("/me", authUser, getMe);


export default authRouter;