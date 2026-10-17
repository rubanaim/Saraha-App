import nodemailer from "nodemailer";
import {config} from "dotenv";
import {env} from '../config/env.js';
//الـ nodemailer.js يتم تحميله أثناء الـ imports قبل تنفيذ


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: env.nodemailer.user,
        pass: env.nodemailer.password,
    },
});
export async function sendEmail(to,subject,html) {
    await transporter.sendMail({
        from: `"ngl-app" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    })
}