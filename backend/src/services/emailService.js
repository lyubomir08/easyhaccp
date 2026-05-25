import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendHealthCardExpiryEmail = async ({ to, employeeName, expiryDate, objectName, daysLeft }) => {
    const formattedDate = new Date(expiryDate).toLocaleDateString("bg-BG");

    const subject = daysLeft === 0
        ? `⚠️ Здравна книжка ИЗТЕКЛА — ${employeeName}`
        : `⚠️ Здравна книжка изтича след ${daysLeft} дни — ${employeeName}`;

    const message = daysLeft === 0
        ? `Здравната книжка на <strong>${employeeName}</strong> от обект <strong>${objectName}</strong> е <strong style="color:red">изтекла днес (${formattedDate})</strong>.`
        : `Здравната книжка на <strong>${employeeName}</strong> от обект <strong>${objectName}</strong> изтича на <strong>${formattedDate}</strong> (след <strong>${daysLeft} дни</strong>).`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1e293b; padding: 20px; border-radius: 8px 8px 0 0;">
                <h2 style="color: white; margin: 0;">Easy<span style="color: #3b82f6">HACCP</span></h2>
            </div>
            <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
                <h3 style="color: #dc2626; margin-top: 0;">Напомняне за здравна книжка</h3>
                <p style="color: #334155; font-size: 15px;">${message}</p>
                <p style="color: #334155; font-size: 15px;">Моля, уредете подновяването навреме.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">Това е автоматично съобщение от системата EasyHACCP.</p>
            </div>
        </div>
    `;

    await transporter.sendMail({
        from: `"EasyHACCP" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};
