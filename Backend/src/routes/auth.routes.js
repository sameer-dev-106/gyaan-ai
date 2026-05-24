import { Router } from "express";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { register, login, getMe, verifyEmail, logout, updateProfile, changePassword } from "../controllers/auth.controller.js";
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

/**
 * @route POST /api/auth/logout
 * @desc Logout user by clearing the token cookie
 * @access Private
 */
authRouter.post("/logout", authUser, logout);

/**
 * @route PUT /api/auth/update-profile
 * @desc Update user's profile information
 * @access Private
 * @body { name, email }
 */
authRouter.put("/update-profile", authUser, updateProfile);

/**
 * @route PUT /api/auth/change-password
 * @desc Change user's password
 * @access Private
 * @body { currentPassword, newPassword }
 */
authRouter.put("/change-password", authUser, changePassword);

export default authRouter;