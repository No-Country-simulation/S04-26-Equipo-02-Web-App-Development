import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

const smtpHost = process.env.SMTP_HOST ?? "";
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const smtpSecure = process.env.SMTP_SECURE === "true";
const smtpUser = process.env.SMTP_USER ?? "";
const smtpPass = process.env.SMTP_PASS ?? "";

const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
        user: smtpUser,
        pass: smtpPass
    }
});

transporter.verify((error: Error | null) => {
    if (error) {
        console.error("Error al conectar con el servidor SMTP:", error);
    } else {
        console.log("Servidor SMTP listo para enviar emails");
    }
});

export type SendEmailParams = {
    to: string;
    subject: string;
    html: string;
};

export const sendEmail = async ({ to, subject, html }: SendEmailParams): Promise<SMTPTransport.SentMessageInfo> => {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME ?? ""}" <${process.env.SMTP_FROM_EMAIL ?? ""}>`,
            to,
            subject,
            html
        });

        console.log("Email enviado:", info.messageId);
        return info;

    } catch (error) {
        console.error("Error al enviar email:", error);
        throw new Error("EMAIL_SEND_FAIL");
    }
};

export default transporter;