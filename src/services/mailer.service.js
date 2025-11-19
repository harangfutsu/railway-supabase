const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAILER_SMTP_HOST,
  port: 587,
  auth: {
    user: process.env.MAILER_SMTP_USER,
    pass: process.env.MAILER_SMTP_PASSWORD,
  },
});

const sendVerificationEmail = async (to, token) => {
  const verifyUrl = `http://localhost:3000/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.MAILER_DEFAULT_SENDER_EMAIL,
    to,
    subject: "Verifikasi Akun EduCourse",
    html: `
      <h3>Selamat datang di EduCourse!</h3>
      <p>Terima kasih sudah mendaftar. Klik tautan berikut untuk memverifikasi akun kamu:</p>
      <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>
      <br/><br/>
      <p>Jika kamu tidak merasa mendaftar, abaikan email ini.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email verifikasi dikirim ke ${to}`);
  } catch (error) {
    console.error("❌ Gagal mengirim email verifikasi:", error);
  }
};

module.exports = { sendVerificationEmail };
