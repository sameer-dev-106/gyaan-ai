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

        // Token has no expiry by default — add one for security
        const emailVerificationToken = jwt.sign(
            { email: user.email },
            config.JWT_SECRET,
            { expiresIn: "24h" }   // token expires in 24 hours
        );

        // Link points to the FRONTEND verification page (not the backend route)
        const verifyUrl = `${config.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;

        await sendEmail({
            to: email,
            subject: "Verify your Gyaan AI account",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                </head>
                <body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',system-ui,sans-serif;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 0;">
                    <tr>
                      <td align="center">
                        <table width="520" cellpadding="0" cellspacing="0"
                          style="background:#141414;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
                          <!-- Header -->
                          <tr>
                            <td style="background:linear-gradient(135deg,#1a0a0a 0%,#1f1010 100%);
                                        border-bottom:1px solid rgba(243,57,57,0.2);
                                        padding:32px 40px;text-align:center;">
                              <div style="font-size:28px;font-weight:800;
                                          background:linear-gradient(135deg,#f33939,#ff6b6b);
                                          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                                          background-clip:text;letter-spacing:-0.5px;">
                                Gyaan AI
                              </div>
                              <p style="margin:8px 0 0;color:rgba(255,255,255,0.4);font-size:13px;">
                                Intelligent Learning Platform
                              </p>
                            </td>
                          </tr>
                          <!-- Body -->
                          <tr>
                            <td style="padding:40px;">
                              <h2 style="margin:0 0 12px;color:#fff;font-size:22px;font-weight:700;
                                          letter-spacing:-0.3px;">
                                Verify your email address
                              </h2>
                              <p style="margin:0 0 24px;color:rgba(255,255,255,0.55);font-size:15px;line-height:1.7;">
                                Hi <strong style="color:rgba(255,255,255,0.85);">${username}</strong>, 
                                welcome to Gyaan AI! Click the button below to verify your email and 
                                activate your account.
                              </p>
                              <!-- CTA Button -->
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td align="center" style="padding:8px 0 32px;">
                                    <a href="${verifyUrl}"
                                       style="display:inline-block;padding:14px 36px;
                                              background:linear-gradient(135deg,#f33939,#c72323);
                                              color:#fff;text-decoration:none;border-radius:10px;
                                              font-size:15px;font-weight:600;letter-spacing:0.2px;
                                              box-shadow:0 4px 20px rgba(243,57,57,0.35);">
                                      Verify My Email →
                                    </a>
                                  </td>
                                </tr>
                              </table>
                              <!-- Fallback link -->
                              <p style="margin:0 0 8px;color:rgba(255,255,255,0.35);font-size:12px;">
                                Button not working? Copy and paste this link into your browser:
                              </p>
                              <p style="margin:0 0 24px;word-break:break-all;
                                          color:rgba(243,57,57,0.7);font-size:12px;">
                                ${verifyUrl}
                              </p>
                              <!-- Warning -->
                              <div style="background:rgba(243,57,57,0.06);border:1px solid rgba(243,57,57,0.15);
                                           border-radius:8px;padding:14px 16px;">
                                <p style="margin:0;color:rgba(255,255,255,0.45);font-size:12px;line-height:1.6;">
                                  ⏱ This link expires in <strong style="color:rgba(255,255,255,0.65);">24 hours</strong>. 
                                  If you didn't create an account with Gyaan AI, you can safely ignore this email.
                                </p>
                              </div>
                            </td>
                          </tr>
                          <!-- Footer -->
                          <tr>
                            <td style="border-top:1px solid rgba(255,255,255,0.06);
                                        padding:20px 40px;text-align:center;">
                              <p style="margin:0;color:rgba(255,255,255,0.25);font-size:12px;">
                                © ${new Date().getFullYear()} Gyaan AI · All rights reserved
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
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
 * @desc Verify user's email address via token
 * @route GET /api/auth/verify-email?token=...
 * @access Public
 */
export async function verifyEmail(req, res, next) {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                message: "Verification token is required",
                success: false,
                err: "Missing token"
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, config.JWT_SECRET);
        } catch (jwtErr) {
            const isExpired = jwtErr.name === "TokenExpiredError";
            return res.status(400).json({
                message: isExpired
                    ? "Verification link has expired. Please register again."
                    : "Invalid verification token.",
                success: false,
                err: isExpired ? "token_expired" : "token_invalid"
            });
        }

        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                err: "User not found"
            });
        }

        if (user.verified) {
            // Already verified — still a success from the user's perspective
            return res.status(200).json({
                message: "Email is already verified. You can log in.",
                success: true,
                alreadyVerified: true
            });
        }

        user.verified = true;
        await user.save();

        return res.status(200).json({
            message: "Email verified successfully! You can now log in.",
            success: true
        });
    } catch (error) {
        next(error);
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
 * @route GET /api/auth/me
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