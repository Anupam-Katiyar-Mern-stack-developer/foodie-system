import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),

  secure: process.env.SMTP_SECURE === "true",

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: {
        name: process.env.MAIL_FROM_NAME || "Foodie",
        address: process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER,
      },

      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent successfully to: ${to}`);

    return info;
  } catch (error) {
    console.error("Send email error:", error.message);

    throw error;
  }
};
