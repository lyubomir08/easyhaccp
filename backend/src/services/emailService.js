import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendActivationEmail = async (toEmail, username, password) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,  // твоят имейл
                pass: process.env.EMAIL_PASS   // app password (не реалната парола)
            },
        });

        const mailOptions = {
            from: `"EasyHACCP Support" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: "Вашият достъп до системата EasyHACCP",
            html: `
        <h2>Здравей, ${username}!</h2>
        <p>Вашият профил е активиран успешно.</p>
        <p>Данни за достъп:</p>
        <ul>
          <li><b>Потребител:</b> ${username}</li>
          <li><b>Парола:</b> ${password}</li>
        </ul>
        <p>Можете да влезете в системата тук: 
          <a href="https://easyhaccp.bg/login">easyhaccp.bg/login</a>
        </p>
        <p>Поздрави,<br>Екипът на EasyHACCP</p>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Имейл изпратен до ${toEmail}`);
    } catch (error) {
        console.error("Грешка при изпращане на имейл:", error.message);
        throw new Error("Email sending failed");
    }
};
