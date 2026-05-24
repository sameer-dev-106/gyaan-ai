import userModel from "../models/user.model.js";
import { config } from "../config/config.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 * @body { username, email, password }
 */
export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const isUserAlreadyExist = await userModel.findOne({
            $or: [{ username }, { email }]
        });
        if (isUserAlreadyExist) {
            let message = "User already exists";
            const emailMatch = isUserAlreadyExist.email === email;
            const usernameMatch = isUserAlreadyExist.username === username;
            if (emailMatch && usernameMatch) {
                message += " with this email and username";
            } else if (emailMatch) {
                message += " with this email address";
            } else if (usernameMatch) {
                message += " with this username";
            }
            return res.status(409).json({
                message,
                success: false,
                err: message
            });
        }
        const user = await userModel.create({ username, email, password });
        const emailVerificationToken = jwt.sign({
            email: user.email,
        }, config.JWT_SECRET)
        await sendEmail({
            to: email,
            subject: "Welcome to Gyaan AI!",
            html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Gyaan AI</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="${config.BASE_URL}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Gyaan AI Team</p>
        `
        });
        res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc Verify user's email address
 * @route GET /api/auth/verify-email?token=...
 * @access Public
 */
export async function verifyEmail(req, res, next) {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                err: "User not found"
            });
        }
        user.verified = true;
        await user.save();
        const html =
            `
        <h1>Email Verified Successfully!</h1>
        <p>Your email has been verified. You can now log in to your account.</p>
        <a href="https://gyaan-ai-epi0.onrender.com/login">Go to Login</a>
    `
        return res.send(html);
    } catch (error) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: "Invalid or expired token"
        });
    }
}

/**
 * @desc Login user and return JWT token
 * @route POST /api/auth/login
 * @access Public
 * @body { email, password }
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email. Please check and try again.",
                success: false,
                err: "User not found"
            })
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid password",
                success: false,
                err: "Incorrect password"
            });
        }
        if (!user.verified) {
            return res.status(400).json({
                message: "Please verify your email before logging in",
                success: false,
                err: "Email not verified"
            });
        }
        const token = jwt.sign({
            id: user._id,
            username: user.username,
        }, config.JWT_SECRET, { expiresIn: '7d' })
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            message: "Login successful",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc Get current logged in user's details
 * @route GET /api/auth/get-me
 * @access Private
 */
export async function getMe(req, res, next) {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                err: "User not found"
            });
        }
        res.status(200).json({
            message: "User details fetched successfully",
            success: true,
            user
        });
    } catch (err) {
        next(err);
    }
}


/**
 * @desc Logout user — clear the token cookie
 * @route POST /api/auth/logout
 * @access Private
 */
export async function logout(req, res, next) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        res.status(200).json({ message: "Logged out successfully", success: true });
    } catch (err) {
        next(err);
    }
}

/**
 * @desc Update user profile (username)
 * @route PUT /api/auth/update-profile
 * @access Private
 * @body { username }
 */
export async function updateProfile(req, res, next) {
    try {
        const { username } = req.body;
        const userId = req.user.id;
        if (!username || username.trim().length < 2) {
            return res.status(400).json({ message: "Username must be at least 2 characters", success: false });
        }
        const existing = await userModel.findOne({ username: username.trim(), _id: { $ne: userId } });
        if (existing) {
            return res.status(409).json({ message: "Username already taken", success: false });
        }
        const user = await userModel.findByIdAndUpdate(
            userId,
            { username: username.trim() },
            { new: true }
        ).select("-password");
        res.status(200).json({ message: "Profile updated successfully", success: true, user });
    } catch (err) {
        next(err);
    }
}

/**
 * @desc Change password
 * @route PUT /api/auth/change-password
 * @access Private
 * @body { currentPassword, newPassword }
 */
export async function changePassword(req, res, next) {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new password required", success: false });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters", success: false });
        }
        const user = await userModel.findById(userId);
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect", success: false });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: "Password changed successfully", success: true });
    } catch (err) {
        next(err);
    }
}
