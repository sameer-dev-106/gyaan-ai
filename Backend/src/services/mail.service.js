import nodemailer from "nodemailer";
import { config } from "../config/config.js";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        type: "OAuth2",
        user: config.GOOGLE_USER_EMAIL,
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        refreshToken: config.GOOGLE_REFRESH_TOKEN
    }
});

transporter.verify().then(() => {
    console.log("Email transporter is ready");
}).catch((err) => {
    console.error("Error setting up email transporter:", err);
});

export async function sendEmail({ to, subject, html, text }) {
    const mailOptions = {
        from: config.GOOGLE_USER_EMAIL,
        to,
        subject,
        html,
        text
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
        return { success: true, info };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
}
