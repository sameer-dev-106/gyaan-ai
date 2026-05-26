import { Resend } from "resend";
import { config } from "../config/config.js";

const resend = new Resend(config.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
    try {
        const data = await resend.emails.send({
            from: "onboarding@resend.dev",
            to,
            subject,
            html
        });
        console.log("Email sent:", data);
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error("Email error:", error);
        return {
            success: false,
            error
        };
    }
}
